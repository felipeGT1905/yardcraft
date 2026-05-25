import { Suspense } from "react";

import { AdminLoginClient } from "@/components/admin/AdminLoginClient";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <AdminLoginClient />
    </Suspense>
  );
}

