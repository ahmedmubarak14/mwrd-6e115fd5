-- Add internal approval workflow support to requests table
-- PRD Section 4.1: Team Collaboration & Approval Workflows

-- Add internal approval columns to requests table
ALTER TABLE requests ADD COLUMN IF NOT EXISTS internal_approval_status TEXT DEFAULT 'not_required';
ALTER TABLE requests ADD COLUMN IF NOT EXISTS internal_approval_required BOOLEAN DEFAULT false;
ALTER TABLE requests ADD COLUMN IF NOT EXISTS submitted_by UUID REFERENCES user_profiles(id);
ALTER TABLE requests ADD COLUMN IF NOT EXISTS internal_approver_id UUID REFERENCES user_profiles(id);
ALTER TABLE requests ADD COLUMN IF NOT EXISTS internal_approval_notes TEXT;
ALTER TABLE requests ADD COLUMN IF NOT EXISTS internal_approved_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE requests ADD COLUMN IF NOT EXISTS internal_rejected_at TIMESTAMP WITH TIME ZONE;

-- Add check constraint for internal approval status
ALTER TABLE requests DROP CONSTRAINT IF EXISTS requests_internal_approval_status_check;
ALTER TABLE requests ADD CONSTRAINT requests_internal_approval_status_check
  CHECK (internal_approval_status IN ('not_required', 'pending', 'approved', 'rejected', 'changes_requested'));

-- Create index for approval queue queries
CREATE INDEX IF NOT EXISTS idx_requests_internal_approval_status
  ON requests(internal_approval_status, client_id)
  WHERE internal_approval_required = true;

CREATE INDEX IF NOT EXISTS idx_requests_internal_approver
  ON requests(internal_approver_id, internal_approval_status);

-- Create table for approval history/audit trail
CREATE TABLE IF NOT EXISTS request_approval_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('submitted', 'approved', 'rejected', 'changes_requested', 'resubmitted')),
  actor_id UUID NOT NULL REFERENCES user_profiles(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes for approval history
CREATE INDEX IF NOT EXISTS idx_approval_history_request_id ON request_approval_history(request_id);
CREATE INDEX IF NOT EXISTS idx_approval_history_actor_id ON request_approval_history(actor_id);
CREATE INDEX IF NOT EXISTS idx_approval_history_created_at ON request_approval_history(created_at DESC);

-- Enable RLS on approval history
ALTER TABLE request_approval_history ENABLE ROW LEVEL SECURITY;

-- RLS policies for approval history
CREATE POLICY "Users can view approval history for their organization's requests"
  ON request_approval_history FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM requests r
      JOIN user_profiles up ON r.client_id = up.id
      WHERE r.id = request_approval_history.request_id
        AND up.company_name = (SELECT company_name FROM user_profiles WHERE id = auth.uid())
    )
  );

CREATE POLICY "Admins can view all approval history"
  ON request_approval_history FOR SELECT
  USING (is_admin());

CREATE POLICY "Users can insert approval history for requests they have access to"
  ON request_approval_history FOR INSERT
  WITH CHECK (auth.uid() = actor_id);

-- Update RLS policies for requests table to support internal approvals
DROP POLICY IF EXISTS "client_admins_can_approve_internal_requests" ON requests;
CREATE POLICY "client_admins_can_approve_internal_requests"
  ON requests FOR UPDATE
  USING (
    -- Client-Admin can approve requests from their organization
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid()
        AND up.role = 'client'
        AND up.company_name = (SELECT company_name FROM user_profiles WHERE id = requests.client_id)
        AND (up.client_admin = true OR up.id = requests.client_id)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid()
        AND up.role = 'client'
        AND up.company_name = (SELECT company_name FROM user_profiles WHERE id = requests.client_id)
        AND (up.client_admin = true OR up.id = requests.client_id)
    )
  );

-- Function to submit request for internal approval
CREATE OR REPLACE FUNCTION submit_request_for_internal_approval(
  p_request_id UUID,
  p_approver_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_request_data RECORD;
  v_approver_id UUID;
  v_result JSONB;
BEGIN
  -- Get request data and verify permissions
  SELECT r.*, up.company_name
  INTO v_request_data
  FROM requests r
  JOIN user_profiles up ON r.client_id = up.id
  WHERE r.id = p_request_id
    AND r.client_id = auth.uid();

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Request not found or access denied'
    );
  END IF;

  -- Check if request is in draft status
  IF v_request_data.status != 'draft' THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Only draft requests can be submitted for approval'
    );
  END IF;

  -- Find an approver if not specified
  IF p_approver_id IS NULL THEN
    -- Find a Client-Admin from the same company
    SELECT id INTO v_approver_id
    FROM user_profiles
    WHERE company_name = v_request_data.company_name
      AND role = 'client'
      AND client_admin = true
      AND id != auth.uid()
      AND status = 'active'
    LIMIT 1;

    IF v_approver_id IS NULL THEN
      RETURN jsonb_build_object(
        'success', false,
        'error', 'No approver found in your organization'
      );
    END IF;
  ELSE
    v_approver_id := p_approver_id;
  END IF;

  -- Update request with internal approval requirement
  UPDATE requests
  SET
    internal_approval_required = true,
    internal_approval_status = 'pending',
    submitted_by = auth.uid(),
    internal_approver_id = v_approver_id,
    updated_at = NOW()
  WHERE id = p_request_id;

  -- Log the action in approval history
  INSERT INTO request_approval_history (request_id, action, actor_id, notes)
  VALUES (p_request_id, 'submitted', auth.uid(), 'Request submitted for internal approval');

  -- Create notification for approver
  INSERT INTO notifications (user_id, title, message, type, priority, reference_id, reference_type)
  VALUES (
    v_approver_id,
    'New RFQ Awaiting Your Approval',
    'A new RFQ "' || v_request_data.title || '" has been submitted for your approval by ' ||
      (SELECT full_name FROM user_profiles WHERE id = auth.uid()),
    'approval_request',
    'high',
    p_request_id,
    'request'
  );

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Request submitted for approval',
    'approver_id', v_approver_id
  );
END;
$$;

-- Function to approve internal request
CREATE OR REPLACE FUNCTION approve_internal_request(
  p_request_id UUID,
  p_notes TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_request_data RECORD;
  v_submitter_id UUID;
BEGIN
  -- Get request data and verify approver permissions
  SELECT r.*, up.company_name, r.submitted_by
  INTO v_request_data
  FROM requests r
  JOIN user_profiles up ON r.client_id = up.id
  WHERE r.id = p_request_id
    AND r.internal_approval_status = 'pending'
    AND (r.internal_approver_id = auth.uid() OR auth.uid() IN (
      SELECT id FROM user_profiles
      WHERE company_name = up.company_name
        AND role = 'client'
        AND client_admin = true
    ));

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Request not found or you do not have permission to approve it'
    );
  END IF;

  v_submitter_id := v_request_data.submitted_by;

  -- Update request status
  UPDATE requests
  SET
    internal_approval_status = 'approved',
    internal_approval_notes = p_notes,
    internal_approved_at = NOW(),
    status = 'open',  -- Make it available to vendors
    updated_at = NOW()
  WHERE id = p_request_id;

  -- Log the approval in history
  INSERT INTO request_approval_history (request_id, action, actor_id, notes)
  VALUES (p_request_id, 'approved', auth.uid(), p_notes);

  -- Notify the submitter
  INSERT INTO notifications (user_id, title, message, type, priority, reference_id, reference_type)
  VALUES (
    v_submitter_id,
    'RFQ Approved',
    'Your RFQ "' || v_request_data.title || '" has been approved and is now live on the marketplace.',
    'approval_response',
    'medium',
    p_request_id,
    'request'
  );

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Request approved successfully'
  );
END;
$$;

-- Function to reject internal request
CREATE OR REPLACE FUNCTION reject_internal_request(
  p_request_id UUID,
  p_notes TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_request_data RECORD;
  v_submitter_id UUID;
BEGIN
  -- Validate that notes are provided for rejection
  IF p_notes IS NULL OR LENGTH(TRIM(p_notes)) = 0 THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Rejection reason is required'
    );
  END IF;

  -- Get request data and verify approver permissions
  SELECT r.*, up.company_name, r.submitted_by
  INTO v_request_data
  FROM requests r
  JOIN user_profiles up ON r.client_id = up.id
  WHERE r.id = p_request_id
    AND r.internal_approval_status = 'pending'
    AND (r.internal_approver_id = auth.uid() OR auth.uid() IN (
      SELECT id FROM user_profiles
      WHERE company_name = up.company_name
        AND role = 'client'
        AND client_admin = true
    ));

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Request not found or you do not have permission to reject it'
    );
  END IF;

  v_submitter_id := v_request_data.submitted_by;

  -- Update request status
  UPDATE requests
  SET
    internal_approval_status = 'rejected',
    internal_approval_notes = p_notes,
    internal_rejected_at = NOW(),
    updated_at = NOW()
  WHERE id = p_request_id;

  -- Log the rejection in history
  INSERT INTO request_approval_history (request_id, action, actor_id, notes)
  VALUES (p_request_id, 'rejected', auth.uid(), p_notes);

  -- Notify the submitter
  INSERT INTO notifications (user_id, title, message, type, priority, reference_id, reference_type)
  VALUES (
    v_submitter_id,
    'RFQ Rejected',
    'Your RFQ "' || v_request_data.title || '" has been rejected. Reason: ' || p_notes,
    'approval_response',
    'high',
    p_request_id,
    'request'
  );

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Request rejected'
  );
END;
$$;

-- Function to request changes on internal request
CREATE OR REPLACE FUNCTION request_changes_internal_request(
  p_request_id UUID,
  p_notes TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_request_data RECORD;
  v_submitter_id UUID;
BEGIN
  -- Validate that notes are provided
  IF p_notes IS NULL OR LENGTH(TRIM(p_notes)) = 0 THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Change request notes are required'
    );
  END IF;

  -- Get request data and verify approver permissions
  SELECT r.*, up.company_name, r.submitted_by
  INTO v_request_data
  FROM requests r
  JOIN user_profiles up ON r.client_id = up.id
  WHERE r.id = p_request_id
    AND r.internal_approval_status = 'pending'
    AND (r.internal_approver_id = auth.uid() OR auth.uid() IN (
      SELECT id FROM user_profiles
      WHERE company_name = up.company_name
        AND role = 'client'
        AND client_admin = true
    ));

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Request not found or you do not have permission'
    );
  END IF;

  v_submitter_id := v_request_data.submitted_by;

  -- Update request status
  UPDATE requests
  SET
    internal_approval_status = 'changes_requested',
    internal_approval_notes = p_notes,
    updated_at = NOW()
  WHERE id = p_request_id;

  -- Log the action in history
  INSERT INTO request_approval_history (request_id, action, actor_id, notes)
  VALUES (p_request_id, 'changes_requested', auth.uid(), p_notes);

  -- Notify the submitter
  INSERT INTO notifications (user_id, title, message, type, priority, reference_id, reference_type)
  VALUES (
    v_submitter_id,
    'Changes Requested for RFQ',
    'Changes have been requested for your RFQ "' || v_request_data.title || '". Please review and resubmit. Notes: ' || p_notes,
    'approval_response',
    'high',
    p_request_id,
    'request'
  );

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Changes requested successfully'
  );
END;
$$;

-- Function to get pending approvals for a user
CREATE OR REPLACE FUNCTION get_pending_approvals_for_user(p_user_id UUID)
RETURNS TABLE (
  request_id UUID,
  title TEXT,
  description TEXT,
  budget NUMERIC,
  submitted_by UUID,
  submitter_name TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE,
  category TEXT,
  urgency TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    r.id as request_id,
    r.title,
    r.description,
    r.budget,
    r.submitted_by,
    up.full_name as submitter_name,
    r.created_at as submitted_at,
    r.category,
    r.urgency
  FROM requests r
  JOIN user_profiles up ON r.submitted_by = up.id
  WHERE r.internal_approval_status = 'pending'
    AND (
      r.internal_approver_id = p_user_id
      OR p_user_id IN (
        SELECT id FROM user_profiles
        WHERE company_name = (SELECT company_name FROM user_profiles WHERE id = r.client_id)
          AND role = 'client'
          AND client_admin = true
      )
    )
  ORDER BY r.created_at DESC;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION submit_request_for_internal_approval(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION approve_internal_request(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION reject_internal_request(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION request_changes_internal_request(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_pending_approvals_for_user(UUID) TO authenticated;

-- Add comments
COMMENT ON FUNCTION submit_request_for_internal_approval IS
'Submits an RFQ for internal approval by a Client-Admin before it goes to the marketplace. Part of PRD Section 4.1 Team Collaboration & Approval Workflows.';

COMMENT ON FUNCTION approve_internal_request IS
'Approves an RFQ and makes it available on the marketplace. Can only be called by designated approvers.';

COMMENT ON FUNCTION reject_internal_request IS
'Rejects an RFQ with a reason. The submitter can then revise and resubmit.';

COMMENT ON FUNCTION request_changes_internal_request IS
'Requests changes to an RFQ without outright rejection. Returns the RFQ to the submitter for revisions.';

COMMENT ON TABLE request_approval_history IS
'Audit trail of all approval actions on requests. Provides complete history for compliance and transparency.';
