-- Add avatar and goals fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS avatar text DEFAULT '🧠',
ADD COLUMN IF NOT EXISTS goals text[] DEFAULT '{}';