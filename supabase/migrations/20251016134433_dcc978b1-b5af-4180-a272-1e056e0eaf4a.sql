-- Create roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Grant admin role to existing user
INSERT INTO public.user_roles (user_id, role)
VALUES ('0bde3f94-877f-4628-9764-f80218e322a1', 'admin');

-- Update RLS policies on highlighted_links to require admin role
DROP POLICY IF EXISTS "Authenticated users can insert highlighted links" ON public.highlighted_links;
DROP POLICY IF EXISTS "Authenticated users can update highlighted links" ON public.highlighted_links;
DROP POLICY IF EXISTS "Authenticated users can delete highlighted links" ON public.highlighted_links;

CREATE POLICY "Only admins can insert links"
ON public.highlighted_links FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update links"
ON public.highlighted_links FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete links"
ON public.highlighted_links FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Add RLS policy so users can view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (user_id = auth.uid());