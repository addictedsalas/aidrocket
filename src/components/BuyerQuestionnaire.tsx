'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ChevronLeft, ChevronRight, User, DollarSign, Home, Shield } from 'lucide-react'
import { api } from '@/lib/trpc'

const buyerProfileSchema = z.object({
  firstTimeHome: z.boolean(),
  annualIncome: z.number().min(1000, 'Annual income must be at least $1,000'),
  householdSize: z.number().int().min(1).max(20),
  creditBand: z.enum(['excellent', 'good', 'fair', 'poor']),
  isVeteran: z.boolean(),
  isFrontline: z.boolean(),
  cashOnHand: z.number().min(0, 'Cash amount must be positive'),
  occupation: z.string().min(1, 'Occupation is required'),
})

type BuyerProfile = z.infer<typeof buyerProfileSchema>

interface BuyerQuestionnaireProps {
  propertyId?: string
  onComplete: (analysis: unknown) => void
  onClose: () => void
}

export default function BuyerQuestionnaire({ propertyId, onComplete, onClose }: BuyerQuestionnaireProps) {
  const [currentStep, setCurrentStep] = useState(0)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BuyerProfile>({
    resolver: zodResolver(buyerProfileSchema),
    defaultValues: {
      firstTimeHome: false,
      isVeteran: false,
      isFrontline: false,
      householdSize: 1,
      creditBand: 'good',
      annualIncome: 75000,
      cashOnHand: 25000,
      occupation: '',
    },
  })

  const createAnalysis = api.analysis.create.useMutation({
    onSuccess: (data) => {
      onComplete(data)
    },
    onError: (error) => {
      console.error('Failed to create analysis:', error)
    }
  })

  const steps = [
    {
      id: 'basics',
      title: 'Basic Information',
      icon: User,
      fields: ['firstTimeHome', 'householdSize', 'occupation']
    },
    {
      id: 'finances',
      title: 'Financial Details',
      icon: DollarSign,
      fields: ['annualIncome', 'cashOnHand', 'creditBand']
    },
    {
      id: 'status',
      title: 'Special Status',
      icon: Shield,
      fields: ['isVeteran', 'isFrontline']
    }
  ]

  const currentStepData = steps[currentStep]
  const isLastStep = currentStep === steps.length - 1
  const isFirstStep = currentStep === 0

  const onSubmit = (data: BuyerProfile) => {
    if (!propertyId) {
      console.error('No property ID provided')
      return
    }

    createAnalysis.mutate({
      propertyId,
      ...data,
    })
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  // const watchedValues = watch()

  return (
    <div className="glass-container p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Buyer Profile</h2>
          <p className="text-gray-400">Help us find the best financing options for you</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {steps.map((step, index) => {
            const StepIcon = step.icon
            const isActive = index === currentStep
            const isCompleted = index < currentStep
            
            return (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                    isActive
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : isCompleted
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-gray-600 text-gray-400'
                  }`}
                >
                  <StepIcon className="w-5 h-5" />
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-20 h-0.5 mx-4 transition-colors ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-600'
                    }`}
                  />
                )}
              </div>
            )
          })}
        </div>
        <div className="text-center">
          <span className="text-sm text-gray-400">
            Step {currentStep + 1} of {steps.length}: {currentStepData.title}
          </span>
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="min-h-[300px]">
          {/* Step 1: Basic Information */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-3 p-4 border border-gray-600 rounded-lg cursor-pointer hover:border-gray-500 transition-colors">
                  <input
                    {...register('firstTimeHome')}
                    type="checkbox"
                    className="w-5 h-5 text-blue-500 rounded focus:ring-blue-400"
                  />
                  <div>
                    <div className="font-medium text-white">First-time homebuyer</div>
                    <div className="text-sm text-gray-400">I haven&apos;t owned a home in the past 3 years</div>
                  </div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Household Size
                </label>
                <select
                  {...register('householdSize', { valueAsNumber: true })}
                  className="chat-input w-full"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(size => (
                    <option key={size} value={size}>
                      {size} {size === 1 ? 'person' : 'people'}
                    </option>
                  ))}
                </select>
                {errors.householdSize && (
                  <p className="text-red-400 text-sm mt-1">{errors.householdSize.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Occupation
                </label>
                <input
                  {...register('occupation')}
                  type="text"
                  className="chat-input w-full"
                  placeholder="e.g., Software Engineer, Teacher, Nurse"
                />
                {errors.occupation && (
                  <p className="text-red-400 text-sm mt-1">{errors.occupation.message}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Financial Details */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Annual Household Income
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                  <input
                    {...register('annualIncome', { valueAsNumber: true })}
                    type="number"
                    className="chat-input w-full pl-8"
                    placeholder="75000"
                  />
                </div>
                {errors.annualIncome && (
                  <p className="text-red-400 text-sm mt-1">{errors.annualIncome.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Cash Available for Down Payment
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                  <input
                    {...register('cashOnHand', { valueAsNumber: true })}
                    type="number"
                    className="chat-input w-full pl-8"
                    placeholder="25000"
                  />
                </div>
                {errors.cashOnHand && (
                  <p className="text-red-400 text-sm mt-1">{errors.cashOnHand.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Credit Score Range
                </label>
                <select
                  {...register('creditBand')}
                  className="chat-input w-full"
                >
                  <option value="excellent">Excellent (750+)</option>
                  <option value="good">Good (700-749)</option>
                  <option value="fair">Fair (650-699)</option>
                  <option value="poor">Poor (Below 650)</option>
                </select>
                {errors.creditBand && (
                  <p className="text-red-400 text-sm mt-1">{errors.creditBand.message}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Special Status */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Shield className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-white mb-2">Special Programs</h3>
                <p className="text-gray-400">Check if you qualify for additional assistance programs</p>
              </div>

              <div className="space-y-4">
                <label className="flex items-center gap-3 p-4 border border-gray-600 rounded-lg cursor-pointer hover:border-gray-500 transition-colors">
                  <input
                    {...register('isVeteran')}
                    type="checkbox"
                    className="w-5 h-5 text-blue-500 rounded focus:ring-blue-400"
                  />
                  <div>
                    <div className="font-medium text-white">Military Veteran</div>
                    <div className="text-sm text-gray-400">Access to VA loans and veteran-specific programs</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 border border-gray-600 rounded-lg cursor-pointer hover:border-gray-500 transition-colors">
                  <input
                    {...register('isFrontline')}
                    type="checkbox"
                    className="w-5 h-5 text-blue-500 rounded focus:ring-blue-400"
                  />
                  <div>
                    <div className="font-medium text-white">Essential/Frontline Worker</div>
                    <div className="text-sm text-gray-400">Teacher, nurse, first responder, or other essential worker</div>
                  </div>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-700">
          <button
            type="button"
            onClick={prevStep}
            disabled={isFirstStep}
            className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          {isLastStep ? (
            <button
              type="submit"
              disabled={createAnalysis.isPending}
              className="flex items-center gap-2 glass-button px-6 py-3 text-white font-medium disabled:opacity-50"
            >
              {createAnalysis.isPending ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Home className="w-4 h-4" />
                  Find My Programs
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center gap-2 glass-button px-6 py-3 text-white font-medium"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>
    </div>
  )
}