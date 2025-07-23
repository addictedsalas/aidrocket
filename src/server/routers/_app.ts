import { createTRPCRouter } from '../trpc'
import { propertyRouter } from './property'
import { analysisRouter } from './analysis'

export const appRouter = createTRPCRouter({
  property: propertyRouter,
  analysis: analysisRouter,
})

export type AppRouter = typeof appRouter