'use client';

import { LogOut } from 'lucide-react';
import { logout } from '../../services/auth';
import { clearSession } from '../../lib/consumer-api';

export default function LogoutButton({ className, iconOnly, label = 'Keluar', iconSize = 18 }) {
  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      // Ignore error to ensure we still clear local session and redirect
    }
    clearSession();
    window.location.href = '/';
  };

  return (
    <button onClick={handleLogout} className={className} type="button" aria-label={label} title={label}>
      {iconOnly ? (
        <LogOut size={iconSize} />
      ) : (
        <div className="flex items-center gap-2">
          <LogOut size={iconSize} />
          <span>{label}</span>
        </div>
      )}
    </button>
  );
}
