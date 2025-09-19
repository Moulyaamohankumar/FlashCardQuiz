import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { GameClient } from "@/components/game-client"

interface GamePageProps {
  params: Promise<{ matchId: string }>
}

export default async function GamePage({ params }: GamePageProps) {
  const { matchId } = await params
  const supabase = await createClient()

  let user = null
  try {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()
    user = authUser
  } catch (error) {
    // No authentication required - will handle anonymous users
  }

  // Get match details
  const { data: match, error: matchError } = await supabase
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
    .eq("id", matchId)
    .single()

  if (matchError || !match) {
    redirect("/lobby")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
      <GameClient user={user} match={match} />
    </div>
  )
}
