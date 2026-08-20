-- Intencional: la columna rewards_granted se declaró en la migración original
-- 202608190001_loyalty_system.sql pero esa migración ya se había aplicado a la
-- BD live, así que la columna nunca llegó a existir en producción.
ALTER TABLE public.loyalty_logs
    ADD COLUMN IF NOT EXISTS rewards_granted INT DEFAULT 0;

COMMENT ON COLUMN public.loyalty_logs.rewards_granted
    IS 'nº de recompensas ganadas/canjeadas en la transacción';