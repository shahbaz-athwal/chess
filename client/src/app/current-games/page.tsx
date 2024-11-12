'use client'

import { useSocket } from "@/hooks/useSocket"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, EyeIcon } from "lucide-react"
import Link from "next/link"

export default function SpectatorGameList() {
  const { socket } = useSocket()
  const [games, setGames] = useState<string[]>([])
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  useEffect(() => {
    if (socket) {
      const fetchGames = () => {
        socket.emit("get_all_games")
      }

      const handleAllGames = (data: string[]) => {
        setGames(data)
        setIsInitialLoading(false)
      }

      socket.on("allGames", handleAllGames)

      // Fetch games immediately
      fetchGames()

      // Fetch games every 3 seconds
      const interval = setInterval(fetchGames, 3000)

      return () => {
        clearInterval(interval)
        socket.off("allGames", handleAllGames)
      }
    }
  }, [socket])

  return (
    <Card className="my-12 w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <EyeIcon className="w-6 h-6" />
          Games to Spectate
        </CardTitle>
        <CardDescription>Watch ongoing games in real-time</CardDescription>
      </CardHeader>
      <CardContent>
        {isInitialLoading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : games.length > 0 ? (
          <ul className="space-y-2">
            {games.map((game, index) => (
              <li key={index}>
                <Link href={`/spectate/${game}`} passHref>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <EyeIcon className="w-4 h-4 mr-2" />
                    {game}
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No games available to spectate at the moment</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}