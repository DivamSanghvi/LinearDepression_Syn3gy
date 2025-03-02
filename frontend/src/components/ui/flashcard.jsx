import React from 'react'
import { Button } from './button'

function FlashCard() {
  return (
    <div className="max-w-5xl mx-auto bg-white dark:bg-slate-900 rounded-xl shadow-md overflow-hidden relative z-10">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-6">Study Flashcards</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg h-40 flex items-center justify-center text-center">
                      <div>
                        <h3 className="font-medium mb-2">What is supervised learning?</h3>
                        <Button variant="outline" size="sm" className="mt-2">Reveal Answer</Button>
                      </div>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-lg h-40 flex items-center justify-center text-center">
                      <div>
                        <h3 className="font-medium mb-2">Name three types of neural networks</h3>
                        <Button variant="outline" size="sm" className="mt-2">Reveal Answer</Button>
                      </div>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg h-40 flex items-center justify-center text-center">
                      <div>
                        <h3 className="font-medium mb-2">What is the purpose of regularization?</h3>
                        <Button variant="outline" size="sm" className="mt-2">Reveal Answer</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
  )
}

export { FlashCard }