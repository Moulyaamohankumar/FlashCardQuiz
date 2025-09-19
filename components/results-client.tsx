"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Medal, Award, Home, RotateCcw, Star } from "lucide-react"
import { useRouter } from "next/navigation"

interface ResultsClientProps {
  results: {
    roomCode: string
    score: number
    correctAnswers: number
    totalQuestions: number
  }
}

export function ResultsClient({ results }: ResultsClientProps) {
  const router = useRouter()

  const { roomCode, score, correctAnswers, totalQuestions } = results
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0

  const getPerformanceMessage = () => {
    if (accuracy >= 90) return { message: "Outstanding!", color: "text-yellow-600", icon: Trophy }
    if (accuracy >= 75) return { message: "Great Job!", color: "text-green-600", icon: Medal }
    if (accuracy >= 60) return { message: "Good Work!", color: "text-blue-600", icon: Award }
    return { message: "Keep Practicing!", color: "text-purple-600", icon: Star }
  }

  const performance = getPerformanceMessage()
  const PerformanceIcon = performance.icon

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Quiz Complete!</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">Room: {roomCode}</p>
        </div>

        {/* Main Results Card */}
        <Card className="mb-8 bg-gradient-to-br from-blue-50 to-purple-100 dark:from-blue-900 dark:to-purple-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-center justify-center text-2xl">
              <PerformanceIcon className={`w-8 h-8 ${performance.color}`} />
              {performance.message}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">{score}</div>
                <div className="text-muted-foreground">Total Score</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {correctAnswers}/{totalQuestions}
                </div>
                <div className="text-muted-foreground">Correct Answers</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                <div className="text-3xl font-bold text-purple-600 mb-2">{accuracy}%</div>
                <div className="text-muted-foreground">Accuracy</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Breakdown */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Performance Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Questions Answered Correctly:</span>
                <span className="font-semibold text-green-600">{correctAnswers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Questions Answered Incorrectly:</span>
                <span className="font-semibold text-red-600">{totalQuestions - correctAnswers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Average Points per Question:</span>
                <span className="font-semibold">{totalQuestions > 0 ? Math.round(score / totalQuestions) : 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Overall Performance:</span>
                <span className={`font-semibold ${performance.color}`}>{performance.message}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <Button onClick={() => router.push("/lobby")} size="lg">
            <Home className="w-4 h-4 mr-2" />
            Back to Lobby
          </Button>
          <Button onClick={() => router.push("/lobby")} variant="outline" size="lg">
            <RotateCcw className="w-4 h-4 mr-2" />
            Play Again
          </Button>
        </div>
      </div>
    </div>
  )
}
