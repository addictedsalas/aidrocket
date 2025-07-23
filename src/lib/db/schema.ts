import { pgTable, text, timestamp, integer, decimal, boolean, jsonb, uuid } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// NextAuth.js required tables
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const accounts = pgTable('accounts', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('providerAccountId').notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: text('token_type'),
  scope: text('scope'),
  id_token: text('id_token'),
  session_state: text('session_state'),
})

export const sessions = pgTable('sessions', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
})

export const verificationTokens = pgTable('verificationTokens', {
  identifier: text('identifier').notNull(),
  token: text('token').notNull().unique(),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
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
  // New fields for enhanced property data
  sqft: integer('sqft'),
  yearBuilt: integer('year_built'),
  lotSize: text('lot_size'),
  propertyType: text('property_type'),
  description: text('description'),
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

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  properties: many(properties),
  analyses: many(analyses),
}))

export const propertiesRelations = relations(properties, ({ one, many }) => ({
  user: one(users, {
    fields: [properties.userId],
    references: [users.id],
  }),
  analyses: many(analyses),
}))

export const analysesRelations = relations(analyses, ({ one, many }) => ({
  user: one(users, {
    fields: [analyses.userId],
    references: [users.id],
  }),
  property: one(properties, {
    fields: [analyses.propertyId],
    references: [properties.id],
  }),
  shareLinks: many(shareLinks),
}))

export const shareLinksRelations = relations(shareLinks, ({ one }) => ({
  analysis: one(analyses, {
    fields: [shareLinks.analysisId],
    references: [analyses.id],
  }),
}))

// Type exports for use in components
export type User = typeof users.$inferSelect
export type Property = typeof properties.$inferSelect
export type Analysis = typeof analyses.$inferSelect
export type ShareLink = typeof shareLinks.$inferSelect

export type NewUser = typeof users.$inferInsert
export type NewProperty = typeof properties.$inferInsert
export type NewAnalysis = typeof analyses.$inferInsert
export type NewShareLink = typeof shareLinks.$inferInsert