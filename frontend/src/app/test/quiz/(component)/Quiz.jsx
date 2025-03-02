import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

// Updated interface to match the new quiz question structure
export const Quiz = ({
  questions,
  onQuizComplete,
  redirectPath = "/dashboard/student/quizes/report",
}) => {
  const router = useRouter();

  // State Management
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [quizAttempts, setQuizAttempts] = useState([]);
  const [questionsToRepeat, setQuestionsToRepeat] = useState([]);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());

  // Shuffle and initialize questions
  useEffect(() => {
    const shuffled = questions
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);

    setShuffledQuestions(shuffled);
    setStartTime(Date.now());
  }, [questions]);

  // Get current question, prioritizing repeated questions
  const currentQuestion = useMemo(() => {
    if (questionsToRepeat.length > 0) {
      const repeatQuestionIndex = questionsToRepeat[0];
      return shuffledQuestions[repeatQuestionIndex];
    }
    return shuffledQuestions[currentQuestionIndex];
  }, [currentQuestionIndex, shuffledQuestions, questionsToRepeat]);

  // Convert options to an array for rendering
  const getCurrentQuestionOptions = () => {
    if (!currentQuestion) return [];
    return [
      { key: "a", value: currentQuestion.all_4_options.a },
      { key: "b", value: currentQuestion.all_4_options.b },
      { key: "c", value: currentQuestion.all_4_options.c },
      { key: "d", value: currentQuestion.all_4_options.d },
    ];
  };

  const handleAnswerSubmit = () => {
    if (!currentQuestion || !selectedAnswer) return;

    // Calculate time taken for the current question
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);

    // Determine correctness and score
    const isCorrect = selectedAnswer === currentQuestion.correct_answer_option;
    const attemptScore = isCorrect ? 1 : 0;

    // Create a new attempt record
    const newAttempt = {
      questionId: `${currentQuestionIndex}`, // Use index as ID
      userAnswer: selectedAnswer,
      isCorrect: isCorrect,
      hintUsed: false, // No hint tracking in this version
      score: attemptScore,
      timeTaken,
    };

    // Update quiz attempts
    setQuizAttempts((prev) => [...prev, newAttempt]);

    // Update score if correct
    if (isCorrect) {
      setScore((prevScore) => prevScore + attemptScore);
    } else {
      // Add to repeat questions if incorrect
      setQuestionsToRepeat((prev) => [...prev, currentQuestionIndex]);
    }

    // Move to next question or end quiz
    if (questionsToRepeat.length > 0) {
      // Remove the first repeated question from the queue
      setQuestionsToRepeat((prev) => prev.slice(1));
      setCurrentQuestionIndex(questionsToRepeat[0]);
    } else if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Quiz completed
      if (onQuizComplete) {
        onQuizComplete(score, quizAttempts);
      }

      // Redirect if a path is provided
      if (redirectPath) {
        const quizData = {
          score,
          attempts: quizAttempts,
          questions: shuffledQuestions,
        };
        const serializedQuizData = encodeURIComponent(JSON.stringify(quizData));
        router.push(`${redirectPath}?quizData=${serializedQuizData}`);
      }
    }

    // Reset selected answer and start time for the next question
    setSelectedAnswer("");
    setStartTime(Date.now());
  };
  if (!currentQuestion) return null;

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">
          {currentQuestion.name ? currentQuestion.name : "Mathematics Quiz"}
        </h2>

        <p className="text-lg mb-6">{currentQuestion.question}</p>

        {currentQuestion.hint && (
          <div className="bg-pink-100 border-l-4 border-pink-500 p-4 mb-4">
            <p className="font-semibold">Hint: {currentQuestion.hint}</p>
          </div>
        )}

        <div className="space-y-4">
          {getCurrentQuestionOptions().map((option) => (
            <button
              key={option.key}
              onClick={() => setSelectedAnswer(option.key)}
              className={`w-full p-3 text-left rounded-lg transition-colors 
                ${
                  selectedAnswer === option.key
                    ? "bg-blue-300 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
            >
              {option.value}
            </button>
          ))}
        </div>

        <button
          onClick={handleAnswerSubmit}
          disabled={!selectedAnswer}
          className="mt-6 w-full p-3 bg-green-300 text-slate-700 rounded-lg 
            disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Next
        </button>

        <div className="mt-4 text-center">
          Question {currentQuestionIndex + 1 - questionsToRepeat.length} of{" "}
          {shuffledQuestions.length}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
