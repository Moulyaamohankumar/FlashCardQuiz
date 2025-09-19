"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Medal, Award, ArrowLeft, Crown, Clock } from "lucide-react"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"

interface Profile {
  id: string
  username: string
  display_name: string
  total_games: number
  total_wins: number
  total_score: number
}

interface LeaderboardClientProps {
  user: User
  topPlayers: Profile[]
  topWinners: Profile[]
  recentMatches: any[]
}

export function LeaderboardClient({ user, topPlayers, topWinners, recentMatches }: LeaderboardClientProps) {
  const router = useRouter()

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 3:
        return <Award className="w-6 h-6 text-orange-600" />
      default:
        return (
          <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center font-bold text-sm">{rank}</div>
        )
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-100 to-yellow-200 dark:from-yellow-900 dark:to-yellow-800 border-yellow-300"
      case 2:
        return "bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 border-gray-300"
      case 3:
        return "bg-gradient-to-r from-orange-100 to-orange-200 dark:from-orange-900 dark:to-orange-800 border-orange-300"
      default:
        return "bg-muted/50"
    }
  }

  const getWinRate = (wins: number, games: number) => {
    return games > 0 ? Math.round((wins / games) * 100) : 0
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Leaderboard</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">Top players and recent activity</p>
          </div>
          <Button onClick={() => router.push("/lobby")} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Lobby
          </Button>
        </div>

        <Tabs defaultValue="score" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="score" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Top Scores
            </TabsTrigger>
            <TabsTrigger value="wins" className="flex items-center gap-2">
              <Crown className="w-4 h-4" />
              Most Wins
            </TabsTrigger>
            <TabsTrigger value="recent" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Recent Games
            </TabsTrigger>
          </TabsList>

          {/* Top Scores Tab */}
          <TabsContent value="score">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Highest Total Scores
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topPlayers.map((player, index) => (
                    <div
                      key={player.id}
                      className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                        player.id === user.id ? "bg-primary/10 border-primary" : getRankColor(index + 1)
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {getRankIcon(index + 1)}
                        <div>
                          <p className="font-semibold text-lg">
                            {player.display_name || player.username}
                            {player.id === user.id && " (You)"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {player.total_games} games • {getWinRate(player.total_wins, player.total_games)}% win rate
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-2xl">{player.total_score.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">total points</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Most Wins Tab */}
          <TabsContent value="wins">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5" />
                  Most Wins (Min. 5 games)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topWinners.map((player, index) => (
                    <div
                      key={player.id}
                      className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                        player.id === user.id ? "bg-primary/10 border-primary" : getRankColor(index + 1)
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {getRankIcon(index + 1)}
                        <div>
                          <p className="font-semibold text-lg">
                            {player.display_name || player.username}
                            {player.id === user.id && " (You)"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {player.total_games} games • {player.total_score.toLocaleString()} total points
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-2xl">{player.total_wins}</div>
                        <div className="text-sm text-muted-foreground">
                          wins ({getWinRate(player.total_wins, player.total_games)}%)
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recent Games Tab */}
          <TabsContent value="recent">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Recent Completed Games
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentMatches.map((match) => {
                    const sortedParticipants = [...match.match_participants].sort((a, b) => b.score - a.score)
                    const winner = sortedParticipants[0]

                    return (
                      <div key={match.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold">Room: {match.room_code}</h3>
                            <p className="text-sm text-muted-foreground">
                              {new Date(match.completed_at).toLocaleString()}
                            </p>
                          </div>
                          <Badge variant="outline">{match.match_participants.length} players</Badge>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 mb-2">
                            <Trophy className="w-4 h-4 text-yellow-500" />
                            <span className="font-semibold">
                              {winner.profiles.display_name || winner.profiles.username}
                            </span>
                            <span className="text-muted-foreground">won with {winner.score} points</span>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {sortedParticipants.map((participant, index) => (
                              <div
                                key={participant.id}
                                className={`text-xs p-2 rounded ${
                                  participant.user_id === user.id ? "bg-primary/10" : "bg-muted"
                                }`}
                              >
                                <div className="font-semibold">
                                  #{index + 1} {participant.profiles.display_name || participant.profiles.username}
                                  {participant.user_id === user.id && " (You)"}
                                </div>
                                <div className="text-muted-foreground">
                                  {participant.score} pts • {participant.correct_answers}/{participant.total_answers}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
