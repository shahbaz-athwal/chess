import { Navbar } from "@/components/Navbar";
import { ThemeProvider } from "@/components/ui/theme-provider";
import "@/styles/globals.css";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SocketChess",
  description: "Chess games over WebSockets",
};

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
            <Navbar />
            <main className="flex-1">{children}</main>
            <footer className="border-t py-[1.32rem]">
              <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                <p>
                  Built by{" "}
                  <Link
                    href="https://shahcodes.in"
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
