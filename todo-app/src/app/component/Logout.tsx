"use client";

import { handleLogout } from "../actions";

export default function LogoutButton() {
  return (
    <button
      onClick={async () => {
        await handleLogout();
        window.location.href = "/login?refresh=true";
      }}
      className="w-full text-left px-4 py-2 bg-teal-500 text-white rounded-lg shadow hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-300"
    >
      Logout
    </button>
  );
}
