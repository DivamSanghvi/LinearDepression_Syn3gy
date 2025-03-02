import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import { Button } from './button'

function StudyGroup() {
  return (
    <div className="max-w-5xl mx-auto bg-white dark:bg-slate-900 rounded-xl shadow-md overflow-hidden">
    <div className="p-6">
      <h2 className="text-xl font-bold mb-6">Study Groups</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <Avatar key={i} className="border-2 border-white dark:border-slate-900">
                  <AvatarImage src={`/placeholder.svg?height=32&width=32&text=${i}`} />
                  <AvatarFallback>U{i}</AvatarFallback>
                </Avatar>
              ))}
            </div>
            <div>
              <h3 className="font-medium">Machine Learning Basics</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">8 members</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Weekly discussions on fundamental ML concepts and algorithms.
          </p>
          <Button variant="outline" size="sm" className="w-full">Join Group</Button>
        </div>
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex -space-x-2">
              {[4, 5, 6].map((i) => (
                <Avatar key={i} className="border-2 border-white dark:border-slate-900">
                  <AvatarImage src={`/placeholder.svg?height=32&width=32&text=${i}`} />
                  <AvatarFallback>U{i}</AvatarFallback>
                </Avatar>
              ))}
            </div>
            <div>
              <h3 className="font-medium">Data Science Projects</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">12 members</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Collaborative work on real-world data science challenges.
          </p>
          <Button variant="outline" size="sm" className="w-full">Join Group</Button>
        </div>
      </div>
    </div>
  </div>
  )
}

export { StudyGroup }