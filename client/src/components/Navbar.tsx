import Link from "next/link"
import { Button } from "./ui/button"
import { Menu } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { ThemeToggle } from "./ui/theme-toggle"

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-12">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold sm:text-3xl">SocketChess</span>
          </Link>
          <nav className="hidden space-x-6 md:flex">
            <Link
              href="/game"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Play
            </Link>
            <Link
              href="/current-games"
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
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuItem asChild>
                <Link href="/game" className="w-full">
                  Play
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/current" className="w-full">
                  Current Games
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/about" className="w-full">
                  About
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}