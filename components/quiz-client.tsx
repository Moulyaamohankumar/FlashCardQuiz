"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, Trophy, CheckCircle, XCircle, Zap, Target, Star } from "lucide-react"
import { useRouter } from "next/navigation"

// Sample quiz questions
const SAMPLE_QUESTIONS = [
  {
    id: 1,
    question: "What is the capital of France?",
    option_a: "London",
    option_b: "Berlin",
    option_c: "Paris",
    option_d: "Madrid",
    correct_answer: "C",
    category: "Geography",
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    option_a: "Venus",
    option_b: "Mars",
    option_c: "Jupiter",
    option_d: "Saturn",
    correct_answer: "B",
    category: "Science",
  },
  {
    id: 3,
    question: "Who painted the Mona Lisa?",
    option_a: "Vincent van Gogh",
    option_b: "Pablo Picasso",
    option_c: "Leonardo da Vinci",
    option_d: "Michelangelo",
    correct_answer: "C",
    category: "Art",
  },
  {
    id: 4,
    question: "What is the largest mammal in the world?",
    option_a: "African Elephant",
    option_b: "Blue Whale",
    option_c: "Giraffe",
    option_d: "Polar Bear",
    correct_answer: "B",
    category: "Nature",
  },
  {
    id: 5,
    question: "In which year did World War II end?",
    option_a: "1944",
    option_b: "1945",
    option_c: "1946",
    option_d: "1947",
    correct_answer: "B",
    category: "History",
  },
]

interface QuizClientProps {
  roomCode: string
}

export function QuizClient({ roomCode }: QuizClientProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [hasAnswered, setHasAnswered] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)
  const [score, setScore] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)
  const [questionStartTime, setQuestionStartTime] = useState<Date>(new Date())
  const router = useRouter()

  const currentQuestion = SAMPLE_QUESTIONS[currentQuestionIndex]
  const totalQuestions = SAMPLE_QUESTIONS.length

  // Timer countdown
  useEffect(() => {
    if (gameComplete || showResults) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (!hasAnswered) {
            handleTimeUp()
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [hasAnswered, gameComplete, showResults])

  // Reset for new question
  useEffect(() => {
    setSelectedAnswer(null)
    setHasAnswered(false)
    setTimeLeft(30)
    setShowResults(false)
    setQuestionStartTime(new Date())
  }, [currentQuestionIndex])

  const handleAnswerSelect = (answer: string) => {
    if (hasAnswered || timeLeft === 0) return

    setSelectedAnswer(answer)
    setHasAnswered(true)

    const responseTime = new Date().getTime() - questionStartTime.getTime()
    const isCorrect = answer === currentQuestion.correct_answer

    // Calculate points based on speed and correctness
    const points = isCorrect ? Math.max(100, 1000 - Math.floor(responseTime / 30)) : 0

    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1)
      setScore((prev) => prev + points)
    }

    // Show results after a brief delay
    setTimeout(() => {
      setShowResults(true)

      // Auto-advance after showing results
      setTimeout(() => {
        advanceToNextQuestion()
      }, 3000)
    }, 1000)
  }

  const handleTimeUp = () => {
    if (hasAnswered) return
    setHasAnswered(true)

    // Show results after time up
    setTimeout(() => {
      setShowResults(true)

      // Auto-advance after showing results
      setTimeout(() => {
        advanceToNextQuestion()
      }, 3000)
    }, 1000)
  }

  const advanceToNextQuestion = () => {
    if (currentQuestionIndex + 1 >= totalQuestions) {
      // Game complete
      setGameComplete(true)
      router.push(`/results/${roomCode}?score=${score}&correct=${correctAnswers}&total=${totalQuestions}`)
    } else {
      // Next question
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  if (gameComplete) {
    return null // Will redirect to results
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-background p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent/10 rounded-full blur-2xl animate-pulse delay-1000"></div>

        <div className="max-w-4xl mx-auto relative z-10">
          <Card className="animate-bounce-in border-border/50 bg-card/90 backdrop-blur-sm shadow-2xl">
            <CardHeader>
              <CardTitle className="text-center text-2xl text-card-foreground">Question Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-4 text-card-foreground">{currentQuestion.question}</h3>
                <div className="flex justify-center items-center gap-2 p-3 rounded-lg bg-primary/10">
                  <CheckCircle className="w-6 h-6 text-primary animate-pulse" />
                  <span className="font-semibold text-primary">Correct Answer: {currentQuestion.correct_answer}</span>
                </div>
              </div>

              <div className="text-center">
                {selectedAnswer === currentQuestion.correct_answer ? (
                  <div className="text-primary text-2xl font-bold mb-6 animate-bounce-in">
                    <div className="w-16 h-16 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center animate-pulse-glow">
                      <CheckCircle className="w-10 h-10 text-primary" />
                    </div>
                    <div className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      Correct! +
                      {Math.max(100, 1000 - Math.floor((new Date().getTime() - questionStartTime.getTime()) / 30))}{" "}
                      points
                    </div>
                  </div>
                ) : (
                  <div className="text-destructive text-2xl font-bold mb-6 animate-bounce-in">
                    <div className="w-16 h-16 mx-auto mb-4 bg-destructive/20 rounded-full flex items-center justify-center">
                      <XCircle className="w-10 h-10 text-destructive" />
                    </div>
                    {selectedAnswer ? `Wrong! You selected ${selectedAnswer}` : "Time's up!"}
                  </div>
                )}

                <div className="p-4 rounded-lg bg-muted/20 animate-fade-in-up">
                  <p className="text-muted-foreground text-lg">
                    Next question in {Math.max(0, 3 - Math.floor((Date.now() - questionStartTime.getTime()) / 1000))}{" "}
                    seconds...
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5"></div>
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-accent/5 rounded-full blur-2xl animate-pulse delay-1000"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex justify-between items-center mb-6 animate-fade-in-up">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Target className="w-8 h-8 text-primary animate-pulse" />
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </h1>
            <Progress
              value={((currentQuestionIndex + 1) / totalQuestions) * 100}
              className="w-64 mt-3 h-3 bg-muted/20"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-card/80 backdrop-blur-sm shadow-lg">
              <Clock className={`w-6 h-6 ${timeLeft <= 10 ? "text-destructive animate-pulse" : "text-primary"}`} />
              <span
                className={`text-3xl font-bold ${timeLeft <= 10 ? "text-destructive animate-pulse" : "text-primary"}`}
              >
                {timeLeft}s
              </span>
            </div>
            <Badge variant="outline" className="text-lg px-4 py-2 border-primary/20 text-primary">
              Room: {roomCode}
            </Badge>
          </div>
        </div>

        <Card className="mb-6 animate-slide-in-right border-border/50 bg-card/90 backdrop-blur-sm shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-card-foreground mb-4">{currentQuestion.question}</CardTitle>
            <div className="text-center">
              <Badge variant="secondary" className="text-lg px-4 py-2 bg-primary/20 text-primary border-primary/30">
                <Star className="w-4 h-4 mr-2" />
                {currentQuestion.category}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: "A", text: currentQuestion.option_a },
                { key: "B", text: currentQuestion.option_b },
                { key: "C", text: currentQuestion.option_c },
                { key: "D", text: currentQuestion.option_d },
              ].map((option, index) => (
                <Button
                  key={option.key}
                  variant={selectedAnswer === option.key ? "default" : "outline"}
                  className={`h-auto p-6 text-left justify-start text-lg font-medium transition-all duration-300 hover:scale-105 animate-fade-in-up border-border/50 ${
                    hasAnswered && selectedAnswer === option.key
                      ? selectedAnswer === currentQuestion.correct_answer
                        ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 animate-pulse-glow"
                        : "bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-lg shadow-destructive/25"
                      : "bg-card/80 hover:bg-card text-card-foreground hover:shadow-lg hover:shadow-primary/10"
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => handleAnswerSelect(option.key)}
                  disabled={hasAnswered || timeLeft === 0}
                >
                  <span className="font-bold mr-4 text-xl bg-primary/20 w-8 h-8 rounded-full flex items-center justify-center">
                    {option.key}
                  </span>
                  <span>{option.text}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="animate-slide-in-right delay-200 border-border/50 bg-card/90 backdrop-blur-sm shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <Trophy className="w-6 h-6 text-primary animate-pulse" />
              Your Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div className="p-4 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors">
                <div className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
                  <Zap className="w-6 h-6" />
                  {score}
                </div>
                <div className="text-sm text-muted-foreground mt-2">Total Score</div>
              </div>
              <div className="p-4 rounded-lg bg-accent/10 hover:bg-accent/20 transition-colors">
                <div className="text-3xl font-bold text-accent flex items-center justify-center gap-2">
                  <CheckCircle className="w-6 h-6" />
                  {correctAnswers}
                </div>
                <div className="text-sm text-muted-foreground mt-2">Correct Answers</div>
              </div>
              <div className="p-4 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors">
                <div className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
                  <Star className="w-6 h-6" />
                  {correctAnswers > 0 ? Math.round((correctAnswers / (currentQuestionIndex + 1)) * 100) : 0}%
                </div>
                <div className="text-sm text-muted-foreground mt-2">Accuracy</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
