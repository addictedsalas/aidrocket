'use client'

import { useState } from 'react'
import BuyerQuestionnaire from '@/components/BuyerQuestionnaire'

export default function TestQuestionnaire() {
  const [showQuestionnaire, setShowQuestionnaire] = useState(true)
  const [analysis, setAnalysis] = useState<Record<string, unknown> | null>(null)

  if (analysis) {
    return (
      <div className="min-h-screen bg-slate-900 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Analysis Complete!</h1>
          <div className="glass-container p-6">
            <pre className="text-gray-300 text-sm overflow-x-auto">
              {JSON.stringify(analysis, null, 2)}
            </pre>
            <button
              onClick={() => {
                setAnalysis(null)
                setShowQuestionnaire(true)
              }}
              className="glass-button px-4 py-2 text-white mt-4"
            >
              Test Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Buyer Questionnaire Test
        </h1>
        
        {showQuestionnaire ? (
          <BuyerQuestionnaire
            propertyId="550e8400-e29b-41d4-a716-446655440000" // Mock property ID
            onComplete={(analysisData) => {
              setAnalysis(analysisData as Record<string, unknown>)
              setShowQuestionnaire(false)
            }}
            onClose={() => setShowQuestionnaire(false)}
          />
        ) : (
          <div className="glass-container p-6 text-center">
            <p className="text-gray-300 mb-4">Questionnaire closed</p>
            <button
              onClick={() => setShowQuestionnaire(true)}
              className="glass-button px-4 py-2 text-white"
            >
              Restart Questionnaire
            </button>
          </div>
        )}
      </div>
    </div>
  )
}