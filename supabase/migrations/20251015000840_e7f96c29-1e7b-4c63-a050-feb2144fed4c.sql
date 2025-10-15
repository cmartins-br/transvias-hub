-- Create storage bucket for link thumbnails
INSERT INTO storage.buckets (id, name, public) 
VALUES ('link-thumbnails', 'link-thumbnails', true);

-- Create highlighted_links table
CREATE TABLE public.highlighted_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  url TEXT NOT NULL,
  icon TEXT DEFAULT 'Link',
  thumbnail_url TEXT,
  is_active BOOLEAN DEFAULT false,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.highlighted_links ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view active links
CREATE POLICY "Anyone can view active highlighted links"
ON public.highlighted_links
FOR SELECT
USING (is_active = true OR auth.role() = 'authenticated');

-- Policy: Only authenticated users can insert
CREATE POLICY "Authenticated users can insert highlighted links"
ON public.highlighted_links
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy: Only authenticated users can update
CREATE POLICY "Authenticated users can update highlighted links"
ON public.highlighted_links
FOR UPDATE
TO authenticated
USING (true);

-- Policy: Only authenticated users can delete
CREATE POLICY "Authenticated users can delete highlighted links"
ON public.highlighted_links
FOR DELETE
TO authenticated
USING (true);

-- Storage policies for thumbnails
CREATE POLICY "Anyone can view thumbnails"
ON storage.objects
FOR SELECT
USING (bucket_id = 'link-thumbnails');

CREATE POLICY "Authenticated users can upload thumbnails"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'link-thumbnails');

CREATE POLICY "Authenticated users can update thumbnails"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'link-thumbnails');

CREATE POLICY "Authenticated users can delete thumbnails"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'link-thumbnails');

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION public.update_highlighted_links_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_highlighted_links_updated_at
BEFORE UPDATE ON public.highlighted_links
FOR EACH ROW
EXECUTE FUNCTION public.update_highlighted_links_updated_at();