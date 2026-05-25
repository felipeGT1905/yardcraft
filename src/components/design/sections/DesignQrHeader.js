import Link from "next/link";
import { Container } from "@/components/ui/Container";
import Image from "next/image";

import { BRAND } from "@/lib/brand";

export function DesignQrHeader() {
  return (
    <header className="relative z-10 pb-2">
      <Container className="flex flex-col items-center gap-0 px-4 text-center">
        <Link href="/" className="inline-flex" aria-label={`${BRAND.name} home`}>
          <Image
            src="/images/YardCraftLogo.png"
            alt={BRAND.name}
            width={260}
            height={260}
            style={{ transform: "scale(2)" }}
            priority
          />
        </Link>
      </Container>
    </header>
  );
}
