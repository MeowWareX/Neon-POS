"use client"

import { useState, useCallback } from "react";
import type { LoyaltyCustomer, LoyaltyCardResponse } from "@/types/domain";

export function useLoyaltyCard(passToken: string) {
  const [customer, setCustomer] = useState<LoyaltyCustomer | null>(null);
  const [recentLogs, setRecentLogs] = useState<NonNullable<LoyaltyCardResponse["recentLogs"]>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/loyalty/card/${passToken}`);
      if (!res.ok) throw new Error("Failed to load card");
      const data: LoyaltyCardResponse = await res.json();
      setCustomer(data.customer);
      setRecentLogs(data.recentLogs);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [passToken]);

  return { customer, recentLogs, loading, error, load };
}
