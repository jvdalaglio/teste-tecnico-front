'use client';

import { useLoading } from "@/contexts/LoadingContext";
import Loading from "@/app/loading";

export default function LoadingWrapper() {
  const { isLoading } = useLoading();

  return isLoading ? <Loading /> : null;
}