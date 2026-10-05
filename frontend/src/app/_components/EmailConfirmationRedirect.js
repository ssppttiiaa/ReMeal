"use client";

import { useEffect } from "react";

export default function EmailConfirmationRedirect() {
  useEffect(() => {
    const fragment = new URLSearchParams(window.location.hash.slice(1));

    if (fragment.has("access_token") && fragment.has("refresh_token")) {
      window.location.replace(`/auth/callback${window.location.hash}`);
    }
  }, []);

  return null;
}
