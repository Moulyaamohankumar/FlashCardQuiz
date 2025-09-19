import { LobbyClient } from "@/components/lobby-client"

export default async function LobbyPage() {
  // Create anonymous user experience without authentication
  const anonymousUser = {
    id: `anonymous-${Date.now()}`,
    email: `player-${Math.random().toString(36).substr(2, 9)}@anonymous.com`,
  }

  const anonymousProfile = {
    id: anonymousUser.id,
    username: `Player${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
    display_name: `Anonymous Player`,
    total_games: 0,
    total_wins: 0,
    total_score: 0,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <LobbyClient user={anonymousUser} profile={anonymousProfile} initialMatches={[]} />
    </div>
  )
}
