"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Award,
  Clock,
  BookOpen,
  Target,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";

export default function QuizReportPage() {
  const searchParams = useSearchParams();
  const quizData = searchParams.get("quizData");
  const [quizReport, setQuizReport] = useState(null);

  useEffect(() => {
    if (quizData) {
      const parsedQuizData = JSON.parse(decodeURIComponent(quizData));
      setQuizReport(parsedQuizData);
    }
  }, [quizData]);

  // Performance analysis
  const calculatePerformance = () => {
    if (!quizReport) return null;

    const correctQuestions = quizReport.attempts.filter((q) => q.isCorrect);
    const incorrectQuestions = quizReport.attempts.filter((q) => !q.isCorrect);

    return {
      overallScore: (quizReport.score / quizReport.attempts.length) * 100,
      correctQuestions,
      incorrectQuestions,
      averageTimeTaken:
        quizReport.attempts.reduce((sum, q) => sum + q.timeTaken, 0) /
        quizReport.attempts.length,
    };
  };

  const performance = calculatePerformance();

  if (!quizReport || !performance) return <div>Loading...</div>;

  const cardColors = [
    "bg-pink-100",
    "bg-blue-100",
    "bg-green-100",
    "bg-yellow-100",
  ];

  const timeData = quizReport.attempts.map((q, index) => ({
    name: `Q${index + 1}`,
    time: q.timeTaken,
  }));

  const topicData = Array.from(
    new Set(quizReport.attempts.map((q) => q.questionId))
  ).map((questionId) => ({
    name: `Q${questionId}`,
    value: quizReport.attempts
      .filter((q) => q.questionId === questionId)
      .reduce((sum, q) => sum + q.score, 0),
  }));

  return (
    <div className="container mx-auto p-6 bg-purple-50">
      {/* Header Section */}
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-purple-800">Quiz Report</h1>
        <p className="text-gray-600">
          Attempted on {new Date().toLocaleDateString()}
        </p>
      </header>

      {/* Performance Overview */}
      <section className="grid md:grid-cols-4 gap-6 mb-8">
        {[
          {
            title: "Score",
            icon: Award,
            value: `${performance?.overallScore?.toFixed(1)}%`,
            subtext: `${quizReport?.score} / ${quizReport?.attempts?.length} Points`,
          },
          {
            title: "Time Taken",
            icon: Clock,
            value: `${(
              quizReport?.attempts?.reduce((sum, q) => sum + q.timeTaken, 0) /
              60
            )?.toFixed(1)} mins`,
            subtext: "Total Time",
          },
          {
            title: "Questions",
            icon: BookOpen,
            value: quizReport?.attempts?.length,
            subtext: "Total Questions",
          },
          {
            title: "Avg. Time per Question",
            icon: Target,
            value: `${performance?.averageTimeTaken?.toFixed(1)} s`,
            subtext: "Per Question",
          },
        ].map((item, index) => (
          <div
            key={item.title}
            className={`${cardColors[index]} p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300`}
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {item.title}
            </h2>
            <div className="flex items-center">
              <item.icon className="mr-4 text-gray-700" size={48} />
              <div>
                <p className="text-3xl font-bold text-gray-900">{item.value}</p>
                <p className="text-gray-700">{item.subtext}</p>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Charts Section */}
      <section className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-purple-700">
            Time Taken per Question
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={timeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis
                label={{
                  value: "Time (seconds)",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip />
              <Bar dataKey="time" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-purple-700">
            Topic Performance
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={topicData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {topicData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"][index % 4]
                    }
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Detailed Question Analysis */}
      <section className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-6 text-purple-700">
          Question Analysis
        </h2>
        {quizReport?.questions?.map((question, index) => {
          const attempt = quizReport.attempts.find(
            (a) => a.questionId === question.id
          );
          return (
            <div
              key={index}
              className={`mb-6 p-4 rounded-lg ${
                attempt?.score === 1
                  ? "bg-green-100 border-l-4 border-green-500"
                  : attempt?.score === 0.5
                  ? "bg-yellow-100 border-l-4 border-yellow-500"
                  : "bg-red-100 border-l-4 border-red-500"
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <p className="font-bold text-xl text-gray-800">
                  Question {index + 1}
                </p>
                <div className="flex items-center">
                  {attempt?.score === 1 ? (
                    <CheckCircle className="text-green-500 mr-2" size={24} />
                  ) : attempt?.score === 0.5 ? (
                    <AlertTriangle className="text-yellow-500 mr-2" size={24} />
                  ) : (
                    <XCircle className="text-red-500 mr-2" size={24} />
                  )}
                  <span
                    className={
                      attempt?.score === 1
                        ? "text-green-600 font-bold text-lg"
                        : attempt?.score === 0.5
                        ? "text-yellow-600 font-bold text-lg"
                        : "text-red-600 font-bold text-lg"
                    }
                  >
                    {attempt?.score} / 1
                  </span>
                </div>
              </div>
              <p className="mb-4 text-gray-800 text-lg font-semibold">
                {question?.text}
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-md">
                <div>
                  <p className="font-semibold text-gray-700">Your Answer:</p>
                  <p
                    className={
                      attempt?.score === 1
                        ? "text-green-600 font-semibold"
                        : attempt?.score === 0.5
                        ? "text-yellow-600 font-semibold"
                        : "text-red-600 font-semibold"
                    }
                  >
                    {attempt?.userAnswer || "Not answered"}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700">Correct Answer:</p>
                  <p className="text-green-600 font-semibold">
                    {question?.correctAnswer}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700">Time Taken:</p>
                  <p className="text-purple-600 font-semibold">
                    {attempt?.timeTaken} seconds
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Improvement Insights */}
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6 text-purple-700">
          Improvement Insights
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center text-red-600">
              <XCircle className="mr-2" size={24} />
              Areas to Improve
            </h3>
            <ul className="space-y-2">
              {performance?.incorrectQuestions?.map((question, index) => (
                <li key={index} className="flex items-center">
                  <XCircle className="text-red-500 mr-2" size={16} />
                  <span className="text-gray-700">
                    Question ID: {question.questionId}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center text-green-600">
              <CheckCircle className="mr-2" size={24} />
              Strengths
            </h3>
            <ul className="space-y-2">
              {performance?.correctQuestions?.map((question, index) => (
                <li key={index} className="flex items-center">
                  <CheckCircle className="text-green-500 mr-2" size={16} />
                  <span className="text-gray-700">
                    Question ID: {question.questionId}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
