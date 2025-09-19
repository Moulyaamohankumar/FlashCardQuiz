import { QuizClient } from "@/components/quiz-client"

interface QuizPageProps {
  params: Promise<{ matchId: string }>
}

export default async function QuizPage({ params }: QuizPageProps) {
  const { matchId } = await params

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
      <QuizClient roomCode={matchId} />
    </div>
  )
}
