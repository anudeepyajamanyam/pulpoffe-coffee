CREATE TABLE IF NOT EXISTS `users` (
  `id` text PRIMARY KEY NOT NULL,
  `name` text NOT NULL,
  `email` text UNIQUE NOT NULL,
  `password_hash` text NOT NULL,
  `role` text NOT NULL DEFAULT 'customer',
  `created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `users_email_idx` ON `users` (`email`);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `sessions` (
  `token` text PRIMARY KEY NOT NULL,
  `user_id` text NOT NULL,
  `expires_at` text NOT NULL,
  `created_at` text NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `sessions_token_expires_idx` ON `sessions` (`token`, `expires_at`);
--> statement-breakpoint
INSERT OR IGNORE INTO `users` (`id`, `name`, `email`, `password_hash`, `role`, `created_at`) VALUES
('user_customer_test', 'Aarav Sharma', 'customer@pulpoffe.com', 'pulpoffe_customer_salt:ea9ac6ed0bf146187e38d7178f99d819aff2d1e85fb20de72bb073f9c2f2d1ed', 'customer', '2026-11-09T00:00:00.000Z'),
('user_admin_test', 'Pulpoffe Admin', 'admin@pulpoffe.com', 'pulpoffe_admin_salt:f5eaeddc0528575570fbeaa5072305d4a2b38478dacb71051019c612296d250d', 'admin', '2026-11-09T00:00:00.000Z');
