-- Add new columns to follow_ups table
ALTER TABLE public.follow_ups
ADD COLUMN updated_by TEXT,
ADD COLUMN follow_up_date DATE NOT NULL DEFAULT CURRENT_DATE,
ADD COLUMN work_status TEXT,
ADD COLUMN next_step TEXT;