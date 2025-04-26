// app/page.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/register"); // Redirect otomatis ke /register
  }, [router]);

  return null; // Tidak ada tampilan di halaman utama
}
