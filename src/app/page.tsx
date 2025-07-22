'use client'

import { useState } from 'react'

export default function HomePage() {
  const [message, setMessage] = useState('')

  const suggestions = [
    {
      icon: '🏠',
      title: 'Analyze Property',
      description: 'Paste Zillow, Redfin or Realtor link',
      action: () => setMessage('I want to analyze a property listing')
    },
    {
      icon: '💰',
      title: 'Down Payment Help',
      description: 'Find assistance programs',
      action: () => setMessage('Help me find down payment assistance programs')
    },
    {
      icon: '📊',
      title: 'Mortgage Scenarios',
      description: 'Compare payment options',
      action: () => setMessage('Show me different mortgage scenarios')
    },
    {
      icon: '📄',
      title: 'Generate Report',
      description: 'Get detailed analysis PDF',
      action: () => setMessage('I need a detailed home buying report')
    }
  ]

  return (
    <main className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6">
        <div className="flex items-center gap-3">
          <div className="ai-avatar">
            <div className="w-6 h-6 bg-slate-900 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">🚀</span>
            </div>
          </div>
          <span className="text-gray-100 font-medium">Aid Rocket</span>
        </div>
        <button className="icon-button">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </header>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          {/* AI Avatar */}
          <div className="ai-avatar w-20 h-20 mx-auto mb-8">
            <div className="w-full h-full bg-slate-900 rounded-2xl flex items-center justify-center">
              <span className="text-3xl">🚀</span>
            </div>
          </div>

          {/* Welcome Message */}
          <h1 className="text-3xl font-semibold text-gray-100 mb-4">
            Hi, I&apos;m your Home Buying Advisor
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Can I help you with anything?
          </p>
          <p className="text-sm text-gray-500 mb-12">
            Ready to assist you with anything you need? From property analysis to down payment assistance programs. Let&apos;s get started!
          </p>
        </div>

        {/* Suggestion Cards */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={suggestion.action}
              className="suggestion-card text-left group"
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">{suggestion.icon}</div>
                <div>
                  <div className="font-medium text-gray-200 mb-1 group-hover:text-blue-400 transition-colors">
                    {suggestion.title}
                  </div>
                  <div className="text-sm text-gray-400">
                    {suggestion.description}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Chat Input */}
        <div className="chat-container p-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Paste a property link or ask me anything..."
              className="chat-input flex-1"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && message.trim()) {
                  console.log('Sending message:', message)
                  setMessage('')
                }
              }}
            />
            <div className="flex gap-2">
              <button className="icon-button">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>
              <button className="icon-button">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>
              <button className="icon-button">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}