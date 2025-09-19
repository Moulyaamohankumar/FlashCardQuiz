import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5"></div>
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent/10 rounded-full blur-2xl animate-pulse delay-1000"></div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center animate-fade-in-up">
          <h1 className="text-5xl font-bold text-foreground mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            QuizMaster
          </h1>
          <p className="text-xl text-muted-foreground">Real-time multiplayer quiz battles</p>
        </div>

        <Card className="animate-slide-in-right border-border/50 bg-card/80 backdrop-blur-sm shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl text-card-foreground">Join the Competition</CardTitle>
            <CardDescription className="text-muted-foreground">
              Test your knowledge against players worldwide in real-time quiz battles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              asChild
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:scale-105"
              size="lg"
            >
              <Link href="/lobby">Start Playing</Link>
            </Button>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground space-y-2 animate-fade-in-up delay-300">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <p>Real-time multiplayer gameplay</p>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse delay-200"></div>
            <p>Instant scoring and leaderboards</p>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-400"></div>
            <p>Match history and statistics</p>
          </div>
        </div>
      </div>
    </div>
  )
}
