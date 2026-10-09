"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { LoaderCircle, LogOut } from "lucide-react";

type Props = {
  redirectTo?: string;
  label?: string;
  className?: string;
};

export function LogoutButton({ redirectTo = "/", label = "Se déconnecter", className }: Props) {
  const [loading, setLoading] = useState(false);

  return (
    <button
      type="button"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        await signOut({ callbackUrl: redirectTo });
      }}
      className={className}
    >
      {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
      {loading ? "Déconnexion…" : label}
    </button>
  );
}
