-- Add image_urls column to store array of image URLs
ALTER TABLE cards ADD COLUMN image_urls text[];

-- Migrate existing image_url data to image_urls array
UPDATE cards 
SET image_urls = ARRAY[image_url]
WHERE image_url IS NOT NULL;

-- Drop the old image_url column
ALTER TABLE cards DROP COLUMN image_url;