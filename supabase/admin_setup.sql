-- ==============================================================================
-- ADMIN ACCOUNT REGISTRATION HELPER
-- ==============================================================================
-- Step 1: Sign up your user in Supabase Auth (or via your web app at /admin/login)
-- Or in Supabase Dashboard -> Authentication -> Users -> "Add User"
-- Example: email = 'dhipashhari@gmail.com'

-- Step 2: Run this query to grant Admin privileges to that email:
INSERT INTO public.admin_users (user_id, email, role, is_active)
SELECT 
    id, 
    email, 
    'admin', 
    true 
FROM auth.users 
WHERE email = 'dhipashhari@gmail.com'
ON CONFLICT (email) DO UPDATE 
SET role = 'admin', is_active = true;

-- Verification query:
SELECT * FROM public.admin_users;
