CREATE TABLE `enquiries` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` text NOT NULL,
  `account_email` text NOT NULL,
  `type` text NOT NULL,
  `name` text NOT NULL,
  `email` text NOT NULL,
  `company` text NOT NULL DEFAULT '',
  `phone` text NOT NULL DEFAULT '',
  `interest` text NOT NULL DEFAULT '',
  `volume` text NOT NULL DEFAULT '',
  `message` text NOT NULL,
  `consent` integer NOT NULL DEFAULT 0,
  `status` text NOT NULL DEFAULT 'new',
  `created_at` text NOT NULL,
  `updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `enquiries_user_created_idx` ON `enquiries` (`user_id`,`created_at`);
--> statement-breakpoint
CREATE INDEX `enquiries_created_idx` ON `enquiries` (`created_at`);
--> statement-breakpoint
CREATE TABLE `site_settings` (
  `key` text PRIMARY KEY NOT NULL,
  `value` text NOT NULL,
  `updated_at` text NOT NULL
);
