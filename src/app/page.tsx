'use client'

import { useState } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { api } from '@/lib/trpc'
import { Paperclip, Mic, Send } from 'lucide-react'
import BuyerQuestionnaire from '@/components/BuyerQuestionnaire'

type Analysis = Record<string, unknown>

type ParsedProperty = {
  id: string
  createdAt: Date
  updatedAt: Date
  userId: string | null
  address: string
  city: string
  state: string
  zipCode: string
  price: string
  bedrooms: number | null
  bathrooms: string | null
  sourceLogo: string | null
  sourceUrl: string | null
  propertyType: string | null
  sqft: number | null
  yearBuilt: number | null
  lotSize: string | null
  hoa: string | null
  description: string | null
  error?: string
}

export default function HomePage() {
  const [message, setMessage] = useState('')
  const [parsedProperty, setParsedProperty] = useState<ParsedProperty | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showQuestionnaire, setShowQuestionnaire] = useState(false)
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const { data: session } = useSession()

  const createProperty = api.property.create.useMutation({
    onSuccess: (property) => {
      setParsedProperty(property)
      setIsLoading(false)
    },
    onError: (error) => {
      console.error('Create property error:', error)
      setIsLoading(false)
    }
  })

  const parseUrl = api.property.parseUrl.useMutation({
    onSuccess: (data) => {
      // Save the parsed property to database
      createProperty.mutate({
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        price: data.price,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        hoa: data.hoa || '0',
        sourceUrl: data.sourceUrl,
        sourceLogo: data.sourceLogo,
        sqft: data.sqft,
        yearBuilt: data.yearBuilt,
        lotSize: data.lotSize,
        propertyType: data.propertyType,
        description: data.description,
      })
    },
    onError: (error) => {
      console.error('Parse error:', error)
      setIsLoading(false)
    }
  })

  const handleSubmit = () => {
    if (!message.trim()) return

    // Check if message looks like a URL
    const urlPattern = /(https?:\/\/[^\s]+)/gi
    const urls = message.match(urlPattern)
    
    if (urls && urls.length > 0) {
      const url = urls[0]
      // Check if it's a supported listing site
      if (url.includes('zillow.com') || url.includes('redfin.com') || url.includes('realtor.com')) {
        setIsLoading(true)
        parseUrl.mutate({ url })
        setMessage('')
        return
      }
    }
    
    // For non-URL messages, just log for now
    console.log('Sending message:', message)
    setMessage('')
  }

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
{session ? (
          <div className="flex items-center gap-3">
            <span className="text-gray-300 text-sm">Welcome, {session.user?.name || session.user?.email}</span>
            <button 
              onClick={() => signOut()}
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button 
            onClick={() => signIn()}
            className="glass-button px-4 py-2 text-white"
          >
            Sign In
          </button>
        )}
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

        {/* Property Display */}
        {(isLoading || parsedProperty) && (
          <div className="mb-8">
            {isLoading ? (
              <div className="glass-container p-6 text-center">
                <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-300">AI is analyzing the property listing...</p>
                <p className="text-sm text-gray-400 mt-2">Extracting details with GPT-4o-mini</p>
              </div>
            ) : parsedProperty && (
              <div className="glass-container p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">Property Details</h3>
                  <span className="text-sm text-gray-400 capitalize bg-gray-700 px-3 py-1 rounded-full">
                    {parsedProperty.sourceLogo || 'Unknown'}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="text-gray-300">
                      <span className="text-gray-400">Address:</span> {parsedProperty.address}
                    </div>
                    <div className="text-gray-300">
                      <span className="text-gray-400">Location:</span> {parsedProperty.city}, {parsedProperty.state} {parsedProperty.zipCode}
                    </div>
                    <div className="text-2xl font-bold text-blue-400">
                      ${parseInt(parsedProperty.price).toLocaleString()}
                    </div>
                    {parsedProperty.propertyType && (
                      <div className="text-gray-300">
                        <span className="text-gray-400">Type:</span> {parsedProperty.propertyType}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex gap-4">
                      <div className="text-gray-300">
                        <span className="text-gray-400">Beds:</span> {parsedProperty.bedrooms || 'N/A'}
                      </div>
                      <div className="text-gray-300">
                        <span className="text-gray-400">Baths:</span> {parsedProperty.bathrooms || 'N/A'}
                      </div>
                    </div>
                    {parsedProperty.sqft && (
                      <div className="text-gray-300">
                        <span className="text-gray-400">Square Feet:</span> {parsedProperty.sqft.toLocaleString()} sq ft
                      </div>
                    )}
                    {parsedProperty.yearBuilt && (
                      <div className="text-gray-300">
                        <span className="text-gray-400">Year Built:</span> {parsedProperty.yearBuilt}
                      </div>
                    )}
                    {parsedProperty.lotSize && (
                      <div className="text-gray-300">
                        <span className="text-gray-400">Lot Size:</span> {parsedProperty.lotSize}
                      </div>
                    )}
                    {parsedProperty.hoa && parsedProperty.hoa !== '0' && (
                      <div className="text-gray-300">
                        <span className="text-gray-400">HOA:</span> ${parsedProperty.hoa}/month
                      </div>
                    )}
                  </div>
                </div>

                {parsedProperty.description && (
                  <div className="mt-4 p-4 bg-gray-800/50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Description</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">{parsedProperty.description}</p>
                  </div>
                )}

                {parsedProperty.error && (
                  <div className="mt-4 bg-yellow-900/50 border border-yellow-500 text-yellow-200 p-3 rounded text-sm">
                    <strong>Note:</strong> {parsedProperty.error} (Showing demo data)
                  </div>
                )}

                <div className="mt-6 flex gap-3">
                  <button 
                    onClick={() => setShowQuestionnaire(true)}
                    className="glass-button px-4 py-2 text-white"
                  >
                    Analyze This Property
                  </button>
                  <button 
                    onClick={() => {
                      setParsedProperty(null)
                      setShowQuestionnaire(false)
                      setAnalysis(null)
                    }}
                    className="text-gray-400 hover:text-white transition-colors px-4 py-2"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Buyer Questionnaire */}
        {showQuestionnaire && parsedProperty && (
          <div className="mb-8">
            <BuyerQuestionnaire
              propertyId={parsedProperty.id}
              onComplete={(analysisData) => {
                setAnalysis(analysisData as Analysis)
                setShowQuestionnaire(false)
              }}
              onClose={() => setShowQuestionnaire(false)}
            />
          </div>
        )}

        {/* Analysis Results */}
        {analysis && (
          <div className="mb-8">
            <div className="glass-container p-6">
              <h3 className="text-xl font-bold text-white mb-4">Analysis Complete</h3>
              <p className="text-gray-300">
                Great! We&apos;ve analyzed your buyer profile for this property. 
                Next, our AI Down-Payment Guru will find assistance programs for you.
              </p>
              <div className="mt-4">
                <button className="glass-button px-4 py-2 text-white">
                  Find Down Payment Programs
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Chat Input */}
        <div className="chat-container p-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Paste a property link or ask me anything..."
              className="chat-input flex-1"
              disabled={isLoading}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && message.trim() && !isLoading) {
                  handleSubmit()
                }
              }}
            />
            <div className="flex gap-2">
              <button className="icon-button" title="Attach file">
                <Paperclip className="w-5 h-5 text-gray-400" />
              </button>
              <button className="icon-button" title="Voice input">
                <Mic className="w-5 h-5 text-gray-400" />
              </button>
              <button 
                onClick={handleSubmit}
                disabled={!message.trim() || isLoading}
                className="glass-button px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600/20 transition-colors"
                title={message.trim() ? "Send message" : "Type something to send"}
              >
                <Send className={`w-5 h-5 transition-colors ${message.trim() && !isLoading ? 'text-blue-400' : 'text-gray-400'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}