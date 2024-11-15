import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-opacity-50 bg-black z-50">
      <Loader2 className="mx-auto my-3 animate-spin text-white" size={48} />
    </div>
  );
}