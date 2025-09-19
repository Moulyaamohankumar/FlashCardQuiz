import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { HistoryClient } from "@/components/history-client"

export default async function HistoryPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user's match history
  const { data: userMatches } = await supabase
    .from("match_participants")
    .select(`
      *,
      game_matches (
        id,
        room_code,
        status,
        created_at,
        started_at,
        completed_at,
        match_participants (
          id,
          user_id,
          score,
          correct_answers,
          total_answers,
          profiles (username, display_name)
        )
      )
    `)
    .eq("user_id", user.id)
    .order("joined_at", { ascending: false })

  // Get user's detailed responses for analysis
  const { data: userResponses } = await supabase
    .from("question_responses")
    .select(`
      *,
      quiz_questions (question, correct_answer, category, difficulty),
      game_matches (room_code, completed_at)
    `)
    .eq("user_id", user.id)
    .order("responded_at", { ascending: false })
    .limit(100)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <HistoryClient user={user} userMatches={userMatches || []} userResponses={userResponses || []} />
    </div>
  )
}
