CREATE TABLE `class_bans` (
	`class_id` text NOT NULL,
	`student_id` text NOT NULL,
	`created_at` integer NOT NULL,
	PRIMARY KEY(`class_id`, `student_id`)
);
--> statement-breakpoint
CREATE TABLE `password_resets` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `password_resets_user` ON `password_resets` (`user_id`);--> statement-breakpoint
CREATE TABLE `teacher_prefs` (
	`teacher_id` text PRIMARY KEY NOT NULL,
	`weekly_report` integer DEFAULT true NOT NULL,
	`last_weekly_report_at` integer
);
