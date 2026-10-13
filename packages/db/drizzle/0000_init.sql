CREATE TABLE `assignments` (
	`class_id` text NOT NULL,
	`formula_id` text NOT NULL,
	`week` integer NOT NULL,
	`day` integer NOT NULL,
	PRIMARY KEY(`class_id`, `formula_id`)
);
--> statement-breakpoint
CREATE TABLE `cards` (
	`student_id` text NOT NULL,
	`formula_id` text NOT NULL,
	`source` text NOT NULL,
	`stage` text NOT NULL,
	`memory` text NOT NULL,
	`added_day` integer NOT NULL,
	`last_problem_id` text,
	PRIMARY KEY(`student_id`, `formula_id`)
);
--> statement-breakpoint
CREATE TABLE `classes` (
	`id` text PRIMARY KEY NOT NULL,
	`teacher_id` text NOT NULL,
	`name` text NOT NULL,
	`contest_name` text,
	`contest_day` integer,
	`timezone` text NOT NULL,
	`join_code` text NOT NULL,
	`current_week` integer DEFAULT 1 NOT NULL,
	`game_day` integer NOT NULL,
	`game_baseline` text DEFAULT '{}' NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `classes_join_code_unique` ON `classes` (`join_code`);--> statement-breakpoint
CREATE INDEX `classes_teacher` ON `classes` (`teacher_id`);--> statement-breakpoint
CREATE TABLE `days` (
	`student_id` text NOT NULL,
	`day` integer NOT NULL,
	`done` integer NOT NULL,
	`missed` integer NOT NULL,
	PRIMARY KEY(`student_id`, `day`)
);
--> statement-breakpoint
CREATE TABLE `enrollments` (
	`student_id` text PRIMARY KEY NOT NULL,
	`class_id` text NOT NULL,
	`joined_day` integer NOT NULL,
	`settled_through` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `enrollments_class` ON `enrollments` (`class_id`);--> statement-breakpoint
CREATE TABLE `review_sessions` (
	`student_id` text PRIMARY KEY NOT NULL,
	`data` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`student_id` text NOT NULL,
	`day` integer NOT NULL,
	`formula_id` text NOT NULL,
	`stage` text NOT NULL,
	`first_try` integer NOT NULL,
	`confused_with` text,
	`extra` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE INDEX `reviews_student_day` ON `reviews` (`student_id`,`day`);--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `sessions_user` ON `sessions` (`user_id`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`role` text NOT NULL,
	`name` text NOT NULL,
	`email` text,
	`username` text,
	`password_hash` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);