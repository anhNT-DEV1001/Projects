"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { getApiData, getMe } from "@/lib";
import { useAuthStore } from "@/stores/auth-store";

export default function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const setHydrated = useAuthStore((state) => state.setHydrated);

  useEffect(() => {
    let isMounted = true;

    async function hydrateSession() {
      try {
        const response = await getMe();
        const auth = getApiData(response);

        if (isMounted) {
          setUser(auth?.user ?? null);
        }
      } catch {
        if (isMounted) {
          clearAuth();
        }
      } finally {
        if (isMounted) {
          setHydrated(true);
        }
      }
    }

    function handleAuthExpired() {
      clearAuth();
      router.replace("/login");
      router.refresh();
    }

    hydrateSession();
    window.addEventListener("auth:expired", handleAuthExpired);

    return () => {
      isMounted = false;
      window.removeEventListener("auth:expired", handleAuthExpired);
    };
  }, [clearAuth, router, setHydrated, setUser]);

  return children;
}
