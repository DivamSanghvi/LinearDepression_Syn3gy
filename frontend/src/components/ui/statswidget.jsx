import React from 'react'

function StatsWidget() {
  return (
    <div className="max-w-5xl mx-auto   bg-white dark:bg-slate-900 rounded-xl shadow-md overflow-hidden">
    <div className="p-6 w-full">
      <h2 className="text-xl font-bold mb-6 text-center">Learning Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex w-fullflex-col items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">87%</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">
            Average Completion Rate
          </div>
        </div>
        <div className="flex flex-col items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">12.5</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">
            Hours Watched This Month
          </div>
        </div>
        <div className="flex flex-col items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">24</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">
            Courses In Progress
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export { StatsWidget }