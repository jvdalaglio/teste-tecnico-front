"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "../components/sidebar/sidebar";
import { getAccessTokenFromCookie } from "@/app/api/cookieService";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

export default function Home() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    async function fetchToken() {
      try {
        const data = await getAccessTokenFromCookie();
        if (!data?.success) {
          router.push("/");
        } else {
          setToken(data.token);
        }
      } catch (err) {
        console.error("Error fetching token:", err);
        router.push("/");
      }
    }

    fetchToken();
  }, [router]);

  const toggleSidebar = () => setIsSidebarCollapsed((prev) => !prev);

  return (
    <div className="flex h-full">
      {token ? (
        <>
          <div
            className={`transition-all duration-300 bg-ft-tertiary ${
              isSidebarCollapsed ? "w-20" : "w-48"
            }`}
          >
            <Sidebar isCollapsed={isSidebarCollapsed} />
          </div>
          <button
            type="button"
            onClick={toggleSidebar}
            className={`fixed top-2 transition-all duration-300 
            ${isSidebarCollapsed ? "left-[3.5rem]" : "left-[10.5rem]"} 
            bg-ft-secondary text-ft-platinum rounded-full p-2 shadow-lg z-50`}
          >
            {isSidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>
          <div className="flex-1 bg-ft-primary">
            <div className="mx-auto h-full">
              <div className="container">
                Teste
              </div>
            </div>
          </div>
        </>
      ) : (
        <div>"Redirecionando..."</div>
      )}
    </div>
  );
}
