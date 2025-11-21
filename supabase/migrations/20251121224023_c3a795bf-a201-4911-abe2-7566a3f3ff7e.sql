-- Create payment statistics function
CREATE OR REPLACE FUNCTION get_payment_statistics(
  p_user_id UUID DEFAULT NULL,
  p_start_date TIMESTAMPTZ DEFAULT NULL,
  p_end_date TIMESTAMPTZ DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result JSON;
BEGIN
  SELECT json_build_object(
    'total_transactions', COUNT(*),
    'total_amount', COALESCE(SUM(amount), 0),
    'successful_transactions', COUNT(*) FILTER (WHERE status = 'completed'),
    'failed_transactions', COUNT(*) FILTER (WHERE status = 'failed'),
    'pending_transactions', COUNT(*) FILTER (WHERE status = 'pending')
  )
  INTO v_result
  FROM payment_transactions
  WHERE (p_user_id IS NULL OR user_id = p_user_id)
    AND (p_start_date IS NULL OR created_at >= p_start_date)
    AND (p_end_date IS NULL OR created_at <= p_end_date);

  RETURN v_result;
END;
$$;

-- Create refund processing function
CREATE OR REPLACE FUNCTION process_refund(
  p_transaction_id UUID,
  p_amount NUMERIC,
  p_reason TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_transaction payment_transactions;
BEGIN
  -- Get transaction
  SELECT * INTO v_transaction
  FROM payment_transactions
  WHERE id = p_transaction_id;

  IF v_transaction IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Transaction not found'
    );
  END IF;

  -- Check if already refunded
  IF v_transaction.status = 'refunded' THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Transaction already refunded'
    );
  END IF;

  -- Update transaction status
  UPDATE payment_transactions
  SET status = 'refunded',
      updated_at = now()
  WHERE id = p_transaction_id;

  RETURN json_build_object(
    'success', true,
    'refund_amount', p_amount,
    'transaction_id', p_transaction_id
  );
END;
$$;