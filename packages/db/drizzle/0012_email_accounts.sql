CREATE TABLE `email_tokens` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`kind` text NOT NULL,
	`email` text,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `email_tokens_user` ON `email_tokens` (`user_id`,`kind`);--> statement-breakpoint
CREATE TABLE `teacher_settings` (
	`teacher_id` text PRIMARY KEY NOT NULL,
	`weekly_report` integer DEFAULT true NOT NULL,
	`last_weekly_report_at` integer,
	`unsubscribe_token` text NOT NULL,
	FOREIGN KEY (`teacher_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `teacher_settings_unsubscribe_token_unique` ON `teacher_settings` (`unsubscribe_token`);--> statement-breakpoint
ALTER TABLE `users` ADD `recovery_email` text;--> statement-breakpoint
ALTER TABLE `users` ADD `email_confirmed_at` integer;--> statement-breakpoint
ALTER TABLE `users` ADD `email_added_at` integer;--> statement-breakpoint
-- Teachers signed up with these emails before confirming existed, so they're treated as confirmed.
UPDATE `users` SET `email_confirmed_at` = unixepoch() * 1000, `email_added_at` = unixepoch() * 1000 WHERE `role` = 'teacher' AND `email` IS NOT NULL;
