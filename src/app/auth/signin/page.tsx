'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await signIn('credentials', {
      email,
      password,
      callbackUrl: '/'
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="glass-container max-w-md w-full mx-4 p-8">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Sign In to Aid Rocket
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="chat-input w-full"
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="chat-input w-full"
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button
            type="submit"
            className="glass-button w-full py-3 text-white font-medium"
          >
            Sign In
          </button>
        </form>
        
        <p className="text-gray-400 text-sm text-center mt-4">
          Demo: Use any email/password combination
        </p>
      </div>
    </div>
  )
}