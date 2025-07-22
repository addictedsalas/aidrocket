import { pgTable, text, timestamp, integer, decimal, boolean, jsonb, uuid } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const properties = pgTable('properties', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').references(() => users.id),
  address: text('address').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  zipCode: text('zip_code').notNull(),
  price: decimal('price', { precision: 12, scale: 2 }).notNull(),
  bedrooms: integer('bedrooms'),
  bathrooms: decimal('bathrooms', { precision: 3, scale: 1 }),
  hoa: decimal('hoa', { precision: 8, scale: 2 }),
  sourceUrl: text('source_url'),
  sourceLogo: text('source_logo'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const analyses = pgTable('analyses', {
  id: uuid('id').defaultRandom().primaryKey(),
  propertyId: uuid('property_id').references(() => properties.id).notNull(),
  userId: text('user_id').references(() => users.id),
  
  // Buyer profile
  firstTimeHome: boolean('first_time_home').notNull(),
  annualIncome: decimal('annual_income', { precision: 12, scale: 2 }).notNull(),
  householdSize: integer('household_size').notNull(),
  creditBand: text('credit_band').notNull(), // excellent, good, fair, poor
  isVeteran: boolean('is_veteran').notNull().default(false),
  isFrontline: boolean('is_frontline').notNull().default(false),
  cashOnHand: decimal('cash_on_hand', { precision: 12, scale: 2 }).notNull(),
  occupation: text('occupation'),
  
  // Calculated scenarios
  scenarios: jsonb('scenarios').notNull(), // Array of scenario objects
  programs: jsonb('programs').notNull(), // Array of applicable programs
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const shareLinks = pgTable('share_links', {
  id: uuid('id').defaultRandom().primaryKey(),
  hash: text('hash').notNull().unique(),
  analysisId: uuid('analysis_id').references(() => analyses.id).notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Type exports for use in components
export type User = typeof users.$inferSelect
export type Property = typeof properties.$inferSelect
export type Analysis = typeof analyses.$inferSelect
export type ShareLink = typeof shareLinks.$inferSelect

export type NewUser = typeof users.$inferInsert
export type NewProperty = typeof properties.$inferInsert
export type NewAnalysis = typeof analyses.$inferInsert
export type NewShareLink = typeof shareLinks.$inferInsert