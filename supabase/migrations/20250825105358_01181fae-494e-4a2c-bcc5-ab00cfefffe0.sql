
-- Add foreign key constraint to enable verification_requests to user_profiles relationship
ALTER TABLE verification_requests 
ADD CONSTRAINT fk_verification_requests_user_id 
FOREIGN KEY (user_id) REFERENCES user_profiles(user_id);
