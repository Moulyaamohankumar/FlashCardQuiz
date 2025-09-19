"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Trophy, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"

interface GameClientProps {
  user: User
  match: any
}

export function GameClient({ user, match: initialMatch }: GameClientProps) {
  const [match, setMatch] = useState(initialMatch)
  const [isStarting, setIsStarting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const isCreator = match.created_by === user.id
  const canStart = match.status === "waiting" && match.match_participants.length >= 2

  useEffect(() => {
    // Subscribe to real-time updates
    const channel = supabase
      .channel(`game-${match.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "game_matches",
          filter: `id=eq.${match.id}`,
        },
        (payload) => {
          if (payload.new) {
            setMatch((prev: any) => ({ ...prev, ...payload.new }))
          }
        },
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "match_participants",
          filter: `match_id=eq.${match.id}`,
        },
        () => {
          // Refresh match data when participants change
          refreshMatch()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [match.id])

  const refreshMatch = async () => {
    const { data } = await supabase
      .from("game_matches")
      .select(`
        *,
        match_participants (
          id,
          user_id,
          score,
          correct_answers,
          total_answers,
          profiles (username, display_name)
        )
      `)
      .eq("id", match.id)
      .single()

    if (data) {
      setMatch(data)
    }
  }

  const startGame = async () => {
    if (!canStart || !isCreator) return

    setIsStarting(true)
    try {
      // Get random questions for the match
      const { data: questions, error: questionsError } = await supabase
        .from("quiz_questions")
        .select("id")
        .order("random()")
        .limit(10)

      if (questionsError) throw questionsError

      // Insert match questions
      const matchQuestions = questions.map((q, index) => ({
        match_id: match.id,
        question_id: q.id,
        question_order: index + 1,
      }))

      const { error: matchQuestionsError } = await supabase.from("match_questions").insert(matchQuestions)

      if (matchQuestionsError) throw matchQuestionsError

      // Update match status and set first question
      const { error: updateError } = await supabase
        .from("game_matches")
        .update({
          status: "in_progress",
          started_at: new Date().toISOString(),
          current_question_index: 1,
          current_question_id: questions[0].id,
          question_start_time: new Date().toISOString(),
        })
        .eq("id", match.id)

      if (updateError) throw updateError
    } catch (error) {
      console.error("Error starting game:", error)
      alert("Failed to start game!")
    } finally {
      setIsStarting(false)
    }
  }

  const leaveGame = async () => {
    try {
      await supabase.from("match_participants").delete().eq("match_id", match.id).eq("user_id", user.id)

      router.push("/lobby")
    } catch (error) {
      console.error("Error leaving game:", error)
    }
  }

  if (match.status === "in_progress") {
    // Redirect to quiz interface (will be implemented in next task)
    router.push(`/quiz/${match.id}`)
    return null
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Room: {match.room_code}</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {match.status === "waiting" ? "Waiting for players..." : "Game in progress"}
            </p>
          </div>
          <Button onClick={() => router.push("/lobby")} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Lobby
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Game Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Game Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Badge variant={match.status === "waiting" ? "secondary" : "default"}>
                  {match.status === "waiting" ? "Waiting" : "In Progress"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Players:</span>
                <span className="font-semibold">
                  {match.match_participants.length}/{match.max_players}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Room Code:</span>
                <span className="font-mono font-bold text-lg">{match.room_code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created:</span>
                <span>{new Date(match.created_at).toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Players */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Players ({match.match_participants.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {match.match_participants.map((participant: any) => (
                  <div key={participant.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                        {(participant.profiles.display_name || participant.profiles.username)[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold">
                          {participant.profiles.display_name || participant.profiles.username}
                        </p>
                        {participant.user_id === match.created_by && (
                          <Badge variant="outline" className="text-xs">
                            Host
                          </Badge>
                        )}
                      </div>
                    </div>
                    {participant.user_id === user.id && <Badge variant="secondary">You</Badge>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-center gap-4">
          {isCreator && match.status === "waiting" && (
            <Button onClick={startGame} disabled={!canStart || isStarting} size="lg" className="px-8">
              {isStarting ? "Starting..." : canStart ? "Start Game" : "Need 2+ Players"}
            </Button>
          )}

          <Button onClick={leaveGame} variant="outline" size="lg">
            Leave Game
          </Button>
        </div>

        {!canStart && match.status === "waiting" && (
          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              Waiting for more players to join. Share the room code: <strong>{match.room_code}</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
