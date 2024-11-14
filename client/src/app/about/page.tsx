import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GithubIcon, LinkedinIcon, Globe } from 'lucide-react'

export default function About() {
  return (
    <div className="container max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6">About Our Chess Game</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>♟️ Chess Game with WebSockets</CardTitle>
          <CardDescription>
            A real-time chess application built using Next.js and Socket.io. Developed as part of the COMP3343 - Data Communication and Computer Networks course.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <h2 className="text-2xl font-semibold mb-4">✨ Features</h2>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>🎮 <span className="font-medium">Multiplayer:</span> Multiple users can connect and play against each other.</li>
            <li>💬 <span className="font-medium">Chat Feature:</span> Players can communicate with each other through a real-time chat feature.</li>
            <li>👀 <span className="font-medium">Spectate Mode:</span> Allows additional users to join as spectators and watch ongoing games.</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mb-4">🛠️ Technologies Used</h2>
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge variant="secondary">Next.js</Badge>
            <Badge variant="secondary">Socket.io</Badge>
            <Badge variant="secondary">Chess.js</Badge>
            <Badge variant="secondary">Docker</Badge>
            <Badge variant="secondary">Zustand</Badge>
            <Badge variant="secondary">Tailwind</Badge>
            <Badge variant="secondary">ShadCN</Badge>
          </div>
        </CardContent>
      </Card>
      
      <h2 className="text-3xl font-semibold mb-4">Our Team</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Shahbaz Singh</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-start space-x-4">
            <Link href="https://www.linkedin.com/in/shahbaz-athwal/" className="text-blue-500 hover:text-blue-700">
              <LinkedinIcon size={24} />
            </Link>
            <Link href="https://shahcodes.in" className="text-green-500 hover:text-green-700">
              <Globe size={24} />
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Rashel Ahmed</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="https://www.linkedin.com/in/rashel-ahmed-77a4a82b3/" className="text-blue-500 hover:text-blue-700">
              <LinkedinIcon size={24} />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}