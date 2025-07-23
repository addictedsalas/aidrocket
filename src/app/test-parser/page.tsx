'use client'

import { useState } from 'react'
import { api } from '@/lib/trpc'
import { Send, ExternalLink } from 'lucide-react'

export default function TestParser() {
  const [url, setUrl] = useState('')
  const [result, setResult] = useState<Record<string, unknown> | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const parseUrl = api.property.parseUrl.useMutation({
    onSuccess: (data) => {
      setResult(data as unknown as Record<string, unknown>)
      setIsLoading(false)
    },
    onError: (error) => {
      setResult({ error: error.message })
      setIsLoading(false)
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return
    
    setIsLoading(true)
    setResult(null)
    parseUrl.mutate({ url })
  }

  const testUrls = [
    'https://www.zillow.com/homedetails/2208-W-32nd-Ave-Denver-CO-80211/13048159_zpid/',
    'https://www.redfin.com/CO/Denver/123-Main-St-80205/home/123456789',
    'https://www.realtor.com/realestateandhomes-detail/456-Oak-Ave_Denver_CO_80205_M12345-67890'
  ]

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Property Parser Test</h1>
        
        <div className="glass-container p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-200 mb-2">
                Property Listing URL
              </label>
              <input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="chat-input w-full"
                placeholder="Paste Zillow, Redfin, or Realtor.com URL"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="glass-button px-6 py-3 text-white font-medium disabled:opacity-50 flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              {isLoading ? 'Parsing...' : 'Parse Property'}
            </button>
          </form>

          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-200 mb-3">Test URLs:</h3>
            <div className="space-y-2">
              {testUrls.map((testUrl, index) => (
                <button
                  key={index}
                  onClick={() => setUrl(testUrl)}
                  className="flex items-center gap-2 w-full text-left text-sm text-blue-400 hover:text-blue-300 transition-colors p-2 rounded border border-gray-600 hover:border-gray-500"
                >
                  <ExternalLink className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{testUrl}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {result && (
          <div className="glass-container p-6">
            <h2 className="text-xl font-bold text-white mb-4">Parsed Result</h2>
            
            {(result as Record<string, unknown>)?.error ? (
              <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded">
                <strong>Error:</strong> {String((result as Record<string, unknown>).error)}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-gray-300">
                      <span className="font-medium">Address:</span> {String((result as Record<string, unknown>).address)}
                    </div>
                    <div className="text-gray-300">
                      <span className="font-medium">City:</span> {String((result as Record<string, unknown>).city)}
                    </div>
                    <div className="text-gray-300">
                      <span className="font-medium">State:</span> {String((result as Record<string, unknown>).state)}
                    </div>
                    <div className="text-gray-300">
                      <span className="font-medium">ZIP:</span> {String((result as Record<string, unknown>).zipCode)}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-gray-300">
                      <span className="font-medium">Price:</span> ${parseInt((result as Record<string, unknown>).price as string).toLocaleString()}
                    </div>
                    <div className="text-gray-300">
                      <span className="font-medium">Bedrooms:</span> {String((result as Record<string, unknown>).bedrooms)}
                    </div>
                    <div className="text-gray-300">
                      <span className="font-medium">Bathrooms:</span> {String((result as Record<string, unknown>).bathrooms)}
                    </div>
                    <div className="text-gray-300">
                      <span className="font-medium">Source:</span> {String((result as Record<string, unknown>).sourceLogo)}
                    </div>
                  </div>
                </div>

                <div className="bg-green-900/50 border border-green-500 text-green-200 p-4 rounded">
                  <strong>Success!</strong> Property parsed successfully.
                </div>
              </div>
            )}

            <details className="mt-6">
              <summary className="text-gray-300 cursor-pointer hover:text-white">
                View Raw JSON
              </summary>
              <pre className="mt-2 bg-gray-800 p-4 rounded text-sm text-gray-300 overflow-x-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>
    </div>
  )
}