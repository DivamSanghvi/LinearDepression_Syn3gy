"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

export default function TakeQuizPage() {
  const router = useRouter();
  const params = useParams();

  const decodedQuizId = decodeURIComponent(params.quizId);

  // State Management
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [quizAttempts, setQuizAttempts] = useState([]);
  const [questionsToRepeat, setQuestionsToRepeat] = useState([]);
  const [score, setScore] = useState(0); // Added score state
  const [startTime, setStartTime] = useState(Date.now()); // Track start time

  console.log(decodedQuizId);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.post(
          `http://localhost:5001/quiz`,
          {
            topic: `${decodedQuizId}`,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Transform response data into the required format
        const fetchedQuestions = response.data.quiz_questions.map((q) => ({
          id: Math.random().toString(), // generate a unique id
          text: q.question,
          topic: `${decodedQuizId}`, // you might want to dynamically set this
          subTopic: "", // you might want to add this
          options: Object.values(q.all_4_options), // Convert options object to array
          correctAnswer: q.correct_answer,
          hint: q.hint,
          attempts: 0,
          showHint: false,
          score: 0,
        }));

        setQuestions(fetchedQuestions);
      } catch (error) {
        console.error("Failed to fetch quiz", error);
      }
    };

    fetchQuiz();
  }, [params.quizId]);

  // Initialize questions on component mount
  useEffect(() => {
    // Shuffle questions for randomness
    const shuffledQuestions = questions
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);

    setQuestions(shuffledQuestions);
    setStartTime(Date.now()); // Initialize start time
  }, []);

  // Get current question, prioritizing repeated questions
  const currentQuestion = useMemo(() => {
    if (questionsToRepeat.length > 0) {
      const repeatQuestionId = questionsToRepeat[0];
      return (
        questions.find((q) => q.id === repeatQuestionId) ||
        questions[currentQuestionIndex]
      );
    }
    return questions[currentQuestionIndex];
  }, [currentQuestionIndex, questions, questionsToRepeat]);

  const handleAnswerSubmit = () => {
    if (!currentQuestion || !selectedAnswer) return;

    // Calculate time taken for the current question
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);

    // Determine the score for the current attempt
    let attemptScore = 0;
    if (selectedAnswer === currentQuestion.correctAnswer) {
      if (currentQuestion.attempts === 0) {
        attemptScore = 1; // First attempt correct
      } else if (currentQuestion.attempts === 1) {
        attemptScore = 0.5; // Second attempt correct
      }
    }

    // Create a new attempt record
    const newAttempt = {
      questionId: currentQuestion.id,
      userAnswer: selectedAnswer,
      isCorrect: selectedAnswer === currentQuestion.correctAnswer,
      hintUsed: currentQuestion.showHint,
      score: attemptScore, // Include the score for this attempt
      timeTaken, // Include the time taken for this attempt
    };

    // Update quiz attempts
    setQuizAttempts((prev) => [...prev, newAttempt]);

    // Update questions state
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === currentQuestion.id
          ? {
              ...q,
              attempts: q.attempts + 1,
              showHint: q.attempts === 0 && selectedAnswer !== q.correctAnswer,
            }
          : q
      )
    );

    // Manage question repetition
    if (selectedAnswer !== currentQuestion.correctAnswer) {
      if (currentQuestion.attempts === 0) {
        // First wrong attempt - add to repeat queue
        setQuestionsToRepeat((prev) => [...prev, currentQuestion.id]);
      }
    } else {
      // Correct answer
      setScore((prevScore) => prevScore + attemptScore);
    }

    // Move to next question or end quiz
    if (questionsToRepeat.length > 0) {
      // Remove the first repeated question from the queue
      setQuestionsToRepeat((prev) => prev.slice(1));
    } else if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Check if there are any repeated questions left
      if (questionsToRepeat.length > 0) {
        // Move to the next repeated question
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        // Quiz completed - send data to backend
        console.log(score, quizAttempts);
        /*
        axios.post('/api/quizzes/submit', {
          quizId: params.quizId,
          attempts: quizAttempts,
          score: score
        })
        .then(response => {
          console.log('Quiz submitted successfully', response.data);
          // Handle successful submission (e.g., show a success message, redirect, etc.)
        })
        .catch(error => {
          console.error('Failed to submit quiz', error);
          // Handle submission error (e.g., show an error message)
        });
        */

        // Redirect to report page
        handleQuizCompletion();
      }
    }

    // Reset selected answer and start time for the next question
    setSelectedAnswer("");
    setStartTime(Date.now());
  };

  const handleQuizCompletion = () => {
    const quizReport = {
      score,
      attempts: quizAttempts,
      questions,
    };
    const encodedQuizData = encodeURIComponent(JSON.stringify(quizReport));
    router.push(`/test/quiz/report?quizData=${encodedQuizData}`);
  };

  return (
    <div className="container mx-auto p-6">
      {currentQuestion && (
        <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">
            {currentQuestion.topic} - {currentQuestion.subTopic}
          </h2>

          <p className="text-lg mb-6">{currentQuestion.text}</p>

          {currentQuestion.showHint && (
            <div className="bg-pink-100 border-l-4 border-pink-500 p-4 mb-4">
              <p className="font-semibold">Hint: {currentQuestion.hint}</p>
            </div>
          )}

          <div className="space-y-4">
            {currentQuestion.options.map((option) => (
              <button
                key={option}
                onClick={() => setSelectedAnswer(option)}
                className={`w-full p-3 text-left rounded-lg transition-colors 
                  ${
                    selectedAnswer === option
                      ? "bg-blue-300 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
              >
                {option}
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
            {questions.length}
          </div>
        </div>
      )}
    </div>
  );
}
