-- Fix search_path for security
DROP FUNCTION IF EXISTS public.update_highlighted_links_updated_at() CASCADE;

CREATE OR REPLACE FUNCTION public.update_highlighted_links_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate trigger
CREATE TRIGGER update_highlighted_links_updated_at
BEFORE UPDATE ON public.highlighted_links
FOR EACH ROW
EXECUTE FUNCTION public.update_highlighted_links_updated_at();