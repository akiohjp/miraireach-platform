import { Suspense } from "react";
import { GamLoginForm } from "@/components/GamLoginForm";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-neutral-100 text-sm font-bold text-neutral-600">
          …
        </div>
      }
    >
      <GamLoginForm />
    </Suspense>
  );
}
