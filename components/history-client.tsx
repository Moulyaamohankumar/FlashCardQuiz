"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trophy, Medal, Award, ArrowLeft, History, BarChart3, CheckCircle, XCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"

interface HistoryClientProps {
  user: User
  userMatches: any[]
  userResponses: any[]
}

export function HistoryClient({ user, userMatches, userResponses }: HistoryClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const router = useRouter()

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />
      case 3:
        return <Award className="w-5 h-5 text-orange-600" />
      default:
        return (
          <div className="w-5 h-5 bg-muted rounded-full flex items-center justify-center font-bold text-xs">{rank}</div>
        )
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="default">Completed</Badge>
      case "in_progress":
        return <Badge variant="secondary">In Progress</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Calculate statistics
  const totalGames = userMatches.length
  const completedGames = userMatches.filter((m) => m.game_matches.status === "completed").length
  const wins = userMatches.filter((m) => {
    if (m.game_matches.status !== "completed") return false
    const sortedParticipants = [...m.game_matches.match_participants].sort((a, b) => b.score - a.score)
    return sortedParticipants[0]?.user_id === user.id
  }).length
  const totalScore = userMatches.reduce((sum, m) => sum + (m.score || 0), 0)
  const totalCorrect = userResponses.filter((r) => r.is_correct).length
  const totalAnswered = userResponses.length

  // Category analysis
  const categories = [...new Set(userResponses.map((r) => r.quiz_questions.category))]
  const categoryStats = categories.map((category) => {
    const categoryResponses = userResponses.filter((r) => r.quiz_questions.category === category)
    const correct = categoryResponses.filter((r) => r.is_correct).length
    return {
      category,
      total: categoryResponses.length,
      correct,
      accuracy: categoryResponses.length > 0 ? Math.round((correct / categoryResponses.length) * 100) : 0,
    }
  })

  const filteredResponses =
    selectedCategory === "all"
      ? userResponses
      : userResponses.filter((r) => r.quiz_questions.category === selectedCategory)

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Match History</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">Your quiz game statistics and performance</p>
          </div>
          <Button onClick={() => router.push("/lobby")} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Lobby
          </Button>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{totalGames}</div>
              <div className="text-sm text-muted-foreground">Total Games</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{wins}</div>
              <div className="text-sm text-muted-foreground">Wins</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{totalScore.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Score</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">
                {totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0}%
              </div>
              <div className="text-sm text-muted-foreground">Accuracy</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="matches" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="matches" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              Match History
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="questions" className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Question History
            </TabsTrigger>
          </TabsList>

          {/* Match History Tab */}
          <TabsContent value="matches">
            <Card>
              <CardHeader>
                <CardTitle>Your Match History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userMatches.map((match) => {
                    const gameMatch = match.game_matches
                    const sortedParticipants = [...gameMatch.match_participants].sort((a, b) => b.score - a.score)
                    const userRank = sortedParticipants.findIndex((p) => p.user_id === user.id) + 1

                    return (
                      <div key={match.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold flex items-center gap-2">
                              Room: {gameMatch.room_code}
                              {getRankIcon(userRank)}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {gameMatch.completed_at
                                ? new Date(gameMatch.completed_at).toLocaleString()
                                : new Date(gameMatch.created_at).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            {getStatusBadge(gameMatch.status)}
                            <Badge variant="outline">Rank #{userRank}</Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="font-semibold">{match.score}</div>
                            <div className="text-muted-foreground">Your Score</div>
                          </div>
                          <div>
                            <div className="font-semibold">
                              {match.correct_answers}/{match.total_answers}
                            </div>
                            <div className="text-muted-foreground">Correct</div>
                          </div>
                          <div>
                            <div className="font-semibold">
                              {match.total_answers > 0
                                ? Math.round((match.correct_answers / match.total_answers) * 100)
                                : 0}
                              %
                            </div>
                            <div className="text-muted-foreground">Accuracy</div>
                          </div>
                          <div>
                            <div className="font-semibold">{gameMatch.match_participants.length}</div>
                            <div className="text-muted-foreground">Players</div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <CardTitle>Performance by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryStats.map((stat) => (
                    <div key={stat.category} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{stat.category}</h3>
                        <p className="text-sm text-muted-foreground">
                          {stat.correct}/{stat.total} questions answered correctly
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{stat.accuracy}%</div>
                        <div className="text-sm text-muted-foreground">accuracy</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Question History Tab */}
          <TabsContent value="questions">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Question History</CardTitle>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredResponses.slice(0, 50).map((response) => (
                    <div
                      key={response.id}
                      className={`p-3 rounded-lg border ${
                        response.is_correct ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-medium">{response.quiz_questions.question}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {response.quiz_questions.category}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {response.quiz_questions.difficulty}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{response.game_matches.room_code}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {response.is_correct ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-500" />
                          )}
                          <div className="text-right text-sm">
                            <div className="font-semibold">+{response.points_earned}</div>
                            <div className="text-muted-foreground">
                              {(response.response_time_ms / 1000).toFixed(1)}s
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Your answer: <strong>{response.selected_answer}</strong> • Correct answer:{" "}
                        <strong>{response.quiz_questions.correct_answer}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
