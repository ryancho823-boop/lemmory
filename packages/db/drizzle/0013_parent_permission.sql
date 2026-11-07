CREATE TABLE `parent_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`first_name` text NOT NULL,
	`parent_email` text NOT NULL,
	`class_id` text,
	`timezone` text,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `parent_requests_email` ON `parent_requests` (`parent_email`);--> statement-breakpoint
ALTER TABLE `classes` ADD `school_approved_at` integer;--> statement-breakpoint
ALTER TABLE `users` ADD `consent` text;--> statement-breakpoint
ALTER TABLE `users` ADD `parent_follow_up_at` integer;