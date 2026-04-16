import type { Metadata } from "next";
import { fontNexa } from "./utils/fonts";

import "./styles/base.scss";

export const metadata: Metadata = {
  title: "Planora",
  description: "Recipe & Meal Planner",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`overflow-x-hidden ${fontNexa.variable}`}>
      <body>{children}</body>
    </html>
  );
}
