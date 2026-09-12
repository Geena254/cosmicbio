CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

SELECT cron.schedule(
  'daily-nasa-publication-sync',
  '15 3 * * *',
  $$
  SELECT net.http_post(
    url := 'https://jukuykcydniqvbpzvedq.supabase.co/functions/v1/sync-publications',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);