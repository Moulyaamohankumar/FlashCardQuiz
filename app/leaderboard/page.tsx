import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { LeaderboardClient } from "@/components/leaderboard-client"

export default async function LeaderboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get top players by total score
  const { data: topPlayers } = await supabase
    .from("profiles")
    .select("*")
    .order("total_score", { ascending: false })
    .limit(50)

  // Get top players by win rate (minimum 5 games)
  const { data: topWinners } = await supabase
    .from("profiles")
    .select("*")
    .gte("total_games", 5)
    .order("total_wins", { ascending: false })
    .limit(50)

  // Get recent completed matches for activity
  const { data: recentMatches } = await supabase
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
    .eq("status", "completed")
    .order("completed_at", { ascending: false })
    .limit(10)

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-gray-800">
      <LeaderboardClient
        user={user}
        topPlayers={topPlayers || []}
        topWinners={topWinners || []}
        recentMatches={recentMatches || []}
      />
    </div>
  )
}
