-- Add total_budget column to trips table
-- Run in: Supabase Dashboard → SQL Editor → New query

ALTER TABLE public.trips
ADD COLUMN IF NOT EXISTS total_budget numeric DEFAULT 0;
