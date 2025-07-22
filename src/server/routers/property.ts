import { z } from 'zod'
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc'
import { properties } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

const createPropertySchema = z.object({
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().length(2),
  zipCode: z.string().min(5),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/),
  bedrooms: z.number().int().min(0).optional(),
  bathrooms: z.number().min(0).optional(),
  hoa: z.string().regex(/^\d+(\.\d{1,2})?$/).optional(),
  sourceUrl: z.string().url().optional(),
  sourceLogo: z.enum(['zillow', 'redfin', 'realtor']).optional(),
})

export const propertyRouter = createTRPCRouter({
  create: publicProcedure
    .input(createPropertySchema)
    .mutation(async ({ ctx, input }) => {
      const [property] = await ctx.db
        .insert(properties)
        .values({
          address: input.address,
          city: input.city,
          state: input.state,
          zipCode: input.zipCode,
          price: input.price,
          bedrooms: input.bedrooms,
          bathrooms: input.bathrooms?.toString(),
          hoa: input.hoa,
          sourceUrl: input.sourceUrl,
          sourceLogo: input.sourceLogo,
          userId: ctx.userId || null,
        })
        .returning()

      return property
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const property = await ctx.db
        .select()
        .from(properties)
        .where(eq(properties.id, input.id))
        .limit(1)

      return property[0] || null
    }),

  getUserProperties: protectedProcedure
    .query(async ({ ctx }) => {
      return await ctx.db
        .select()
        .from(properties)
        .where(eq(properties.userId, ctx.userId))
        .orderBy(properties.createdAt)
    }),

  parseUrl: publicProcedure
    .input(z.object({ url: z.string().url() }))
    .mutation(async ({ input }) => {
      // This will be implemented to parse listing URLs
      // For now, return a placeholder
      const hostname = new URL(input.url).hostname.toLowerCase()
      
      let sourceLogo: 'zillow' | 'redfin' | 'realtor' | undefined
      if (hostname.includes('zillow')) sourceLogo = 'zillow'
      else if (hostname.includes('redfin')) sourceLogo = 'redfin'  
      else if (hostname.includes('realtor')) sourceLogo = 'realtor'

      return {
        address: '123 Main St', // Placeholder
        city: 'Denver',
        state: 'CO',
        zipCode: '80205',
        price: '625000',
        bedrooms: 3,
        bathrooms: 2.5,
        hoa: '0',
        sourceUrl: input.url,
        sourceLogo,
      }
    }),
})