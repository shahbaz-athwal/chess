"use client";

import { ThemeProvider } from "@/components/ui/theme-provider";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import "@/styles/globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center space-x-6">
                  <Link href="/" className="flex items-center space-x-2">
                    <span className="sm:text-2xl text-lg font-bold">
                      SocketChess
                    </span>
                  </Link>
                  <nav className="hidden space-x-4 md:flex">
                    <Link
                      href="/game"
                      className="text-sm font-medium transition-colors hover:text-primary"
                    >
                      Play
                    </Link>
                    <Link
                      href="/current"
                      className="text-sm font-medium transition-colors hover:text-primary"
                    >
                      Current Games
                    </Link>
                    <Link
                      href="/about"
                      className="text-sm font-medium transition-colors hover:text-primary"
                    >
                      About
                    </Link>
                  </nav>
                </div>
                <div className="flex items-center">
                  <ThemeToggle />
                </div>
              </div>
            </header>
            <main className="flex-1">{children}</main>
            <footer className="border-t py-[1.32rem]">
              <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                <p>
                  Built by{" "}
                  <Link
                    href="https://www.linkedin.com/in/shahbaz-athwal/"
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium underline underline-offset-4 hover:text-primary"
                  >
                    Shahbaz Athwal
                  </Link>{" "}
                  and{" "}
                  <Link
                    href={"https://www.linkedin.com/in/rashel-ahmed-77a4a82b3/"}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium underline underline-offset-4 hover:text-primary"
                  >
                    Rashel Ahmed
                  </Link>
                  . The source code is available on{" "}
                  <Link
                    href="https://github.com/shahbaz-athwal/chess"
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium underline underline-offset-4 hover:text-primary"
                  >
                    GitHub
                  </Link>
                  .
                </p>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
