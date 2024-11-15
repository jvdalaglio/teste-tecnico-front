"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    async function fetchToken() {
      const response = await fetch("/api/auth/get-cookie");
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        !data.success ? router.push("/") : setToken(data.token);
      }
    }

    fetchToken();
  }, [router]);

  return <div>{token ? "Conteúdo do Dashboard" : "Redirecionando..."}</div>;
}