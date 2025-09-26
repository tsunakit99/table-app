import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// ============== テーブル定義 ==============

// 1. users（ユーザー情報）
export const users = sqliteTable('users', {
  id: text('id').primaryKey(), // Auth.jsのユーザーID
  email: text('email').notNull().unique(),
  role: text('role', { enum: ['member', 'admin'] }).notNull().default('member'),
  birthDate: integer('birth_date', { mode: 'timestamp' }).notNull(),
  favoriteDrink: text('favorite_drink').references(() => drinks.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
});

// 2. drinks（ドリンクマスタ）
export const drinks = sqliteTable('drinks', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
});

// 3. stamp_cards（スタンプカード）
export const stampCards = sqliteTable('stamp_cards', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  currentStamps: integer('current_stamps').notNull().default(0),
  status: text('status', { enum: ['active', 'completed', 'used', 'expired'] }).notNull().default('active'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  completedAt: integer('completed_at', { mode: 'timestamp' }),
  usedAt: integer('used_at', { mode: 'timestamp' }),
  expiryDate: integer('expiry_date', { mode: 'timestamp' }).notNull()
});

// 4. stamp_transactions（スタンプ獲得履歴）
export const stampTransactions = sqliteTable('stamp_transactions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  cardId: text('card_id').notNull().references(() => stampCards.id, { onDelete: 'cascade' }),
  amount: integer('amount').notNull(),
  timestamp: integer('timestamp', { mode: 'timestamp' }).notNull()
});

// 5. announcements（アプリ内お知らせ）
export const announcements = sqliteTable('announcements', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  publishDate: integer('publish_date', { mode: 'timestamp' }).notNull(),
  expiryDate: integer('expiry_date', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
});

// 6. calendar（営業カレンダー - 休業日のみ）
export const calendar = sqliteTable('calendar', {
    id: text('id').primaryKey(),
    month: text('month').notNull().unique(), // '2025-01' format
    closedDates: text('closed_dates').notNull(), // JSON文字列 '["2025-01-01", "2025-01-15"]'
    updatedBy: text('updated_by').references(() => users.id),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
  });

// 7. menu_categories（メニューカテゴリ）
export const menuCategories = sqliteTable('menu_categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true)
});

// 8. menu（メニュー）
export const menu = sqliteTable('menu', {
  id: text('id').primaryKey(),
  categoryId: text('category_id').notNull().references(() => menuCategories.id),
  name: text('name').notNull(),
  description: text('description'),
  price: integer('price').notNull(), // 円単位
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
});

// 9. coupons（クーポン）
export const coupons = sqliteTable('coupons', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  targetRole: text('target_role', { enum: ['all', 'birthday', 'drink_preference'] }).notNull(),
  targetDrinkId: text('target_drink_id').references(() => drinks.id),
  validFrom: integer('valid_from', { mode: 'timestamp' }).notNull(),
  validUntil: integer('valid_until', { mode: 'timestamp' }).notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdBy: text('created_by').notNull().references(() => users.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
});

// 10. user_coupons（ユーザー別クーポン）
export const userCoupons = sqliteTable('user_coupons', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  couponId: text('coupon_id').notNull().references(() => coupons.id, { onDelete: 'cascade' }),
  isUsed: integer('is_used', { mode: 'boolean' }).notNull().default(false),
  usedAt: integer('used_at', { mode: 'timestamp' }),
  distributedAt: integer('distributed_at', { mode: 'timestamp' }).notNull()
});

// ============== リレーション定義 ==============

export const usersRelations = relations(users, ({ one, many }) => ({
  favoriteDrinkInfo: one(drinks, {
    fields: [users.favoriteDrink],
    references: [drinks.id]
  }),
  stampCards: many(stampCards),
  stampTransactions: many(stampTransactions),
  userCoupons: many(userCoupons)
}));

export const stampCardsRelations = relations(stampCards, ({ one, many }) => ({
  user: one(users, {
    fields: [stampCards.userId],
    references: [users.id]
  }),
  transactions: many(stampTransactions)
}));

export const stampTransactionsRelations = relations(stampTransactions, ({ one }) => ({
  user: one(users, {
    fields: [stampTransactions.userId],
    references: [users.id]
  }),
  card: one(stampCards, {
    fields: [stampTransactions.cardId],
    references: [stampCards.id]
  })
}));

export const menuRelations = relations(menu, ({ one }) => ({
  category: one(menuCategories, {
    fields: [menu.categoryId],
    references: [menuCategories.id]
  })
}));

export const userCouponsRelations = relations(userCoupons, ({ one }) => ({
  user: one(users, {
    fields: [userCoupons.userId],
    references: [users.id]
  }),
  coupon: one(coupons, {
    fields: [userCoupons.couponId],
    references: [coupons.id]
  })
}));
