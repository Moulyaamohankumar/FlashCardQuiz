import { ResultsClient } from "@/components/results-client"

interface ResultsPageProps {
  params: Promise<{ matchId: string }>
  searchParams: Promise<{ score?: string; correct?: string; total?: string }>
}

export default async function ResultsPage({ params, searchParams }: ResultsPageProps) {
  const { matchId } = await params
  const { score, correct, total } = await searchParams

  const results = {
    roomCode: matchId,
    score: Number.parseInt(score || "0"),
    correctAnswers: Number.parseInt(correct || "0"),
    totalQuestions: Number.parseInt(total || "5"),
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <ResultsClient results={results} />
    </div>
  )
}
