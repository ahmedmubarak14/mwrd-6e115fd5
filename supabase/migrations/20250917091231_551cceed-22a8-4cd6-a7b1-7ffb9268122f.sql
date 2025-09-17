-- Attach trigger to notify vendors/admins when a request is created
-- Safely replace existing trigger if present
DROP TRIGGER IF EXISTS trg_requests_notify_insert ON public.requests;

-- Create trigger to call the enhanced workflow-aware notification function
CREATE TRIGGER trg_requests_notify_insert
AFTER INSERT ON public.requests
FOR EACH ROW
EXECUTE FUNCTION public.notify_request_created_with_workflow();
