"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Users, Play, Plus, Trophy, Target, History, BarChart3, Zap, Star } from "lucide-react"
import { useRouter } from "next/navigation"

interface Profile {
  id: string
  username: string
  display_name: string
  total_games: number
  total_wins: number
  total_score: number
}

interface Match {
  id: string
  room_code: string
  status: string
  max_players: number
  created_at: string
  match_participants: Array<{
    id: string
    user_id: string
    profiles: {
      username: string
      display_name: string
    }
  }>
}

interface LobbyClientProps {
  user: { id: string; email: string }
  profile: Profile | null
  initialMatches: Match[]
}

export function LobbyClient({ user, profile, initialMatches }: LobbyClientProps) {
  const [matches, setMatches] = useState<Match[]>(initialMatches)
  const [roomCode, setRoomCode] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [isJoining, setIsJoining] = useState(false)
  const router = useRouter()

  const createGame = async () => {
    setIsCreating(true)
    try {
      const roomCodeGenerated = Math.random().toString(36).substr(2, 6).toUpperCase()

      // Go directly to quiz with generated room code
      router.push(`/quiz/${roomCodeGenerated}`)
    } catch (error) {
      console.error("Error creating game:", error)
    } finally {
      setIsCreating(false)
    }
  }

  const joinGame = async (matchId: string) => {
    setIsJoining(true)
    try {
      router.push(`/quiz/${matchId}`)
    } catch (error) {
      console.error("Error joining game:", error)
    } finally {
      setIsJoining(false)
    }
  }

  const joinByRoomCode = async () => {
    if (!roomCode.trim()) return

    setIsJoining(true)
    try {
      router.push(`/quiz/${roomCode.toUpperCase()}`)
    } catch (error) {
      console.error("Error joining by room code:", error)
      alert("Error joining game!")
    } finally {
      setIsJoining(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "waiting":
        return <Badge variant="secondary">Waiting</Badge>
      case "in_progress":
        return <Badge variant="default">In Progress</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5"></div>
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-accent/5 rounded-full blur-2xl animate-pulse delay-1000"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex justify-between items-center mb-8 animate-fade-in-up">
          <div>
            <h1 className="text-5xl font-bold text-foreground mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Game Lobby
            </h1>
            <p className="text-xl text-muted-foreground flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary animate-pulse" />
              Welcome, {profile?.display_name || profile?.username || "Player"}!
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => router.push("/leaderboard")}
              variant="outline"
              size="sm"
              className="hover:scale-105 transition-transform"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Leaderboard
            </Button>
            <Button
              onClick={() => router.push("/history")}
              variant="outline"
              size="sm"
              className="hover:scale-105 transition-transform"
            >
              <History className="w-4 h-4 mr-2" />
              History
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="animate-slide-in-right border-border/50 bg-card/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <Trophy className="w-5 h-5 text-primary animate-pulse" />
                Your Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-2 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                <span className="text-muted-foreground">Games Played:</span>
                <span className="font-bold text-primary text-lg">{profile?.total_games || 0}</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                <span className="text-muted-foreground">Games Won:</span>
                <span className="font-bold text-accent text-lg">{profile?.total_wins || 0}</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                <span className="text-muted-foreground">Total Score:</span>
                <span className="font-bold text-primary text-lg">{profile?.total_score || 0}</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                <span className="text-muted-foreground">Win Rate:</span>
                <span className="font-bold text-accent text-lg flex items-center gap-1">
                  {profile?.total_games ? Math.round((profile.total_wins / profile.total_games) * 100) : 0}%
                  <Star className="w-4 h-4" />
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-slide-in-right delay-200 border-border/50 bg-card/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <Target className="w-5 h-5 text-primary animate-pulse" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={createGame}
                disabled={isCreating}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:scale-105 animate-pulse-glow"
                size="lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                {isCreating ? "Creating..." : "Create New Game"}
              </Button>

              <div className="space-y-2">
                <Label htmlFor="room-code" className="text-card-foreground">
                  Join by Room Code
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="room-code"
                    placeholder="Enter room code"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    maxLength={6}
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-primary"
                  />
                  <Button
                    onClick={joinByRoomCode}
                    disabled={isJoining || !roomCode.trim()}
                    className="hover:scale-105 transition-transform"
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-slide-in-right delay-400 border-border/50 bg-card/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <Users className="w-5 h-5 text-primary animate-pulse" />
                Active Games
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-center text-primary animate-bounce-in">{matches.length}</div>
              <p className="text-center text-muted-foreground mt-2">Games available to join</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 animate-fade-in-up delay-600">
          <h2 className="text-3xl font-bold mb-6 text-foreground flex items-center gap-2">
            <Zap className="w-6 h-6 text-primary" />
            Active Matches
          </h2>
          {matches.length === 0 ? (
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm shadow-xl">
              <CardContent className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-muted/20 rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-lg">No active games right now. Create one to get started!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {matches.map((match, index) => (
                <Card
                  key={match.id}
                  className="border-border/50 bg-card/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-slide-in-right"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg text-card-foreground">Room: {match.room_code}</CardTitle>
                        <CardDescription>{new Date(match.created_at).toLocaleTimeString()}</CardDescription>
                      </div>
                      {getStatusBadge(match.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-2 rounded-lg bg-muted/20">
                        <span className="text-sm text-muted-foreground">Players:</span>
                        <span className="font-bold text-primary">
                          {match.match_participants.length}/{match.max_players}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Participants:</span>
                        <div className="flex flex-wrap gap-1">
                          {match.match_participants.map((participant) => (
                            <Badge
                              key={participant.id}
                              variant="outline"
                              className="text-xs border-primary/20 text-primary"
                            >
                              {participant.profiles.display_name || participant.profiles.username}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Button
                        onClick={() => joinGame(match.id)}
                        disabled={
                          isJoining ||
                          match.status !== "waiting" ||
                          match.match_participants.length >= match.max_players
                        }
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:scale-105"
                      >
                        {match.status !== "waiting"
                          ? "Game Started"
                          : match.match_participants.length >= match.max_players
                            ? "Game Full"
                            : "Join Game"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
