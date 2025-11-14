-- Create subscriptions table to store Paystack subscription data
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  customer_code text NOT NULL,
  subscription_code text,
  email_token text,
  plan_code text NOT NULL DEFAULT 'PLN_kdq1b5mhyl6bnrb',
  status text NOT NULL DEFAULT 'inactive',
  next_payment_date timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(profile_id)
);

-- Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own subscriptions"
  ON public.subscriptions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = subscriptions.profile_id
      AND (profiles.user_id = auth.uid() OR (auth.uid() IS NULL AND profiles.guest_session_id IS NOT NULL))
    )
  );

CREATE POLICY "Users can create their own subscriptions"
  ON public.subscriptions
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = subscriptions.profile_id
      AND (profiles.user_id = auth.uid() OR (auth.uid() IS NULL AND profiles.guest_session_id IS NOT NULL))
    )
  );

CREATE POLICY "Users can update their own subscriptions"
  ON public.subscriptions
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = subscriptions.profile_id
      AND (profiles.user_id = auth.uid() OR (auth.uid() IS NULL AND profiles.guest_session_id IS NOT NULL))
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();