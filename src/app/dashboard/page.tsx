'use client'

import { useRouter } from "next/navigation"
import { useEffect } from "react";
import cookieService from '@/app/api/cookie'

export default function Dashboard() {
  const router = useRouter();
  useEffect(() => {
    const token = cookieService.getAccessToken('authToken');
    // if(!token) {
    //   router.push('/auth/login')
    // }
  }, [router]);
  
  return (
    <div>Teste</div>
  )
}