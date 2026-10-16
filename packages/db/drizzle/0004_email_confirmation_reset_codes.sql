CREATE TABLE `email_confirmations` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`email` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `email_confirmations_user` ON `email_confirmations` (`user_id`);--> statement-breakpoint
CREATE TABLE `student_reset_codes` (
	`student_id` text PRIMARY KEY NOT NULL,
	`code_hash` text NOT NULL,
	`created_by` text NOT NULL,
	`expires_at` integer NOT NULL,
	`attempts` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE `users` ADD `email_verified_at` integer;--> statement-breakpoint
ALTER TABLE `users` ADD `recovery_email` text;--> statement-breakpoint
-- Teachers who signed up before email confirmation existed count as confirmed, so nobody is locked out.
UPDATE `users` SET `email_verified_at` = `created_at` WHERE `role` = 'teacher';
