import type { ReactNode } from "react";

export default function FirmLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { firm: string };
}) {
  return <>{children}</>;
}
