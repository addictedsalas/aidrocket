import { createTRPCRouter } from '../trpc'
import { propertyRouter } from './property'

export const appRouter = createTRPCRouter({
  property: propertyRouter,
})

export type AppRouter = typeof appRouter