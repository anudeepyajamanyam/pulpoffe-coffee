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
