import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '../trpc'
import { analyses } from '@/lib/db/schema'

const createAnalysisSchema = z.object({
  propertyId: z.string().uuid(),
  firstTimeHome: z.boolean(),
  annualIncome: z.number().min(1000),
  householdSize: z.number().int().min(1).max(20),
  creditBand: z.enum(['excellent', 'good', 'fair', 'poor']),
  isVeteran: z.boolean(),
  isFrontline: z.boolean(),
  cashOnHand: z.number().min(0),
  occupation: z.string().min(1),
})

export const analysisRouter = createTRPCRouter({
  create: publicProcedure
    .input(createAnalysisSchema)
    .mutation(async ({ ctx, input }) => {
      // For now, create empty scenarios and programs arrays
      // These will be populated by the AI Down-Payment Guru
      const scenarios = [
        {
          name: 'MIN_CASH',
          downPayment: Math.min(input.cashOnHand * 0.8, input.cashOnHand),
          monthlyPayment: 0, // Will be calculated
          programs: []
        },
        {
          name: 'BALANCED_10',
          downPayment: Math.min(input.cashOnHand * 0.6, input.cashOnHand),
          monthlyPayment: 0, // Will be calculated
          programs: []
        },
        {
          name: 'AGGRESSIVE_15',
          downPayment: Math.min(input.cashOnHand * 0.9, input.cashOnHand),
          monthlyPayment: 0, // Will be calculated
          programs: []
        }
      ]

      const programs: unknown[] = [] // Will be populated by AI Guru

      const [analysis] = await ctx.db
        .insert(analyses)
        .values({
          propertyId: input.propertyId,
          userId: ctx.userId || null,
          firstTimeHome: input.firstTimeHome,
          annualIncome: input.annualIncome.toString(),
          householdSize: input.householdSize,
          creditBand: input.creditBand,
          isVeteran: input.isVeteran,
          isFrontline: input.isFrontline,
          cashOnHand: input.cashOnHand.toString(),
          occupation: input.occupation,
          scenarios: JSON.stringify(scenarios),
          programs: JSON.stringify(programs),
        })
        .returning()

      return analysis
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const analysis = await ctx.db
        .query.analyses
        .findFirst({
          where: (analyses, { eq }) => eq(analyses.id, input.id),
          with: {
            property: true
          }
        })

      return analysis
    }),
})