import type { Metadata } from "next";
import { fontNexa } from "../utils/fonts";
import { ThemeWrapper } from "@/providers/ThemeProvider";
import { Header } from "../components/Header/Header";
import { Toaster } from "sonner";

import "./styles/styles.scss";

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
    <html lang="en" className={`${fontNexa.variable}`}>
      <body>
        <ThemeWrapper>
          <Header />
          <main>
            {children}
            <Toaster />
          </main>
        </ThemeWrapper>    
      </body>
    </html>
  );
}
