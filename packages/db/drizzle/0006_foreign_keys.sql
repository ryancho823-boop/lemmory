-- Rows left pointing at a deleted user or class (nothing deleted them before foreign keys existed).
DELETE FROM `sessions` WHERE `user_id` NOT IN (SELECT `id` FROM `users`);
--> statement-breakpoint
DELETE FROM `classes` WHERE `teacher_id` NOT IN (SELECT `id` FROM `users`);
--> statement-breakpoint
DELETE FROM `enrollments` WHERE `student_id` NOT IN (SELECT `id` FROM `users`) OR `class_id` NOT IN (SELECT `id` FROM `classes`);
--> statement-breakpoint
DELETE FROM `assignments` WHERE `class_id` NOT IN (SELECT `id` FROM `classes`);
--> statement-breakpoint
DELETE FROM `cards` WHERE `student_id` NOT IN (SELECT `id` FROM `users`);
--> statement-breakpoint
DELETE FROM `reviews` WHERE `student_id` NOT IN (SELECT `id` FROM `users`);
--> statement-breakpoint
DELETE FROM `days` WHERE `student_id` NOT IN (SELECT `id` FROM `users`);
--> statement-breakpoint
DELETE FROM `review_sessions` WHERE `student_id` NOT IN (SELECT `id` FROM `users`);
--> statement-breakpoint
DELETE FROM `plans` WHERE `teacher_id` NOT IN (SELECT `id` FROM `users`);
--> statement-breakpoint
DELETE FROM `student_plans` WHERE `student_id` NOT IN (SELECT `id` FROM `users`);
--> statement-breakpoint
DROP INDEX `reviews_student_day`;
--> statement-breakpoint
CREATE INDEX `reviews_student_day` ON `reviews` (`student_id`,`day`,`extra`);
--> statement-breakpoint
ALTER TABLE `reviews` ALTER COLUMN "student_id" TO "student_id" text NOT NULL REFERENCES users(id) ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE `assignments` ALTER COLUMN "class_id" TO "class_id" text NOT NULL REFERENCES classes(id) ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE `cards` ALTER COLUMN "student_id" TO "student_id" text NOT NULL REFERENCES users(id) ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE `classes` ALTER COLUMN "teacher_id" TO "teacher_id" text NOT NULL REFERENCES users(id) ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE `days` ALTER COLUMN "student_id" TO "student_id" text NOT NULL REFERENCES users(id) ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE `enrollments` ALTER COLUMN "student_id" TO "student_id" text NOT NULL REFERENCES users(id) ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE `enrollments` ALTER COLUMN "class_id" TO "class_id" text NOT NULL REFERENCES classes(id) ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE `sessions` ALTER COLUMN "user_id" TO "user_id" text NOT NULL REFERENCES users(id) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
-- Primary-key columns can't be altered in place, so these three small tables are rebuilt.
CREATE TABLE `__new_plans` (
	`teacher_id` text PRIMARY KEY NOT NULL REFERENCES users(id) ON DELETE cascade ON UPDATE no action,
	`kind` text NOT NULL,
	`org_name` text,
	`org_location` text,
	`billing_name` text,
	`billing_email` text,
	`school_email` text,
	`club_status` text,
	`pilot_ends_at` integer,
	`paid_at` integer
);
--> statement-breakpoint
INSERT INTO `__new_plans` (`teacher_id`, `kind`, `org_name`, `org_location`, `billing_name`, `billing_email`, `school_email`, `club_status`, `pilot_ends_at`, `paid_at`)
SELECT `teacher_id`, `kind`, `org_name`, `org_location`, `billing_name`, `billing_email`, `school_email`, `club_status`, `pilot_ends_at`, `paid_at` FROM `plans`;--> statement-breakpoint
DROP TABLE `plans`;--> statement-breakpoint
ALTER TABLE `__new_plans` RENAME TO `plans`;--> statement-breakpoint
CREATE TABLE `__new_student_plans` (
	`student_id` text PRIMARY KEY NOT NULL REFERENCES users(id) ON DELETE cascade ON UPDATE no action,
	`trial_ends_at` integer,
	`paid_at` integer,
	`billing_name` text,
	`billing_email` text
);
--> statement-breakpoint
INSERT INTO `__new_student_plans` (`student_id`, `trial_ends_at`, `paid_at`, `billing_name`, `billing_email`)
SELECT `student_id`, `trial_ends_at`, `paid_at`, `billing_name`, `billing_email` FROM `student_plans`;--> statement-breakpoint
DROP TABLE `student_plans`;--> statement-breakpoint
ALTER TABLE `__new_student_plans` RENAME TO `student_plans`;--> statement-breakpoint
CREATE TABLE `__new_review_sessions` (
	`student_id` text PRIMARY KEY NOT NULL REFERENCES users(id) ON DELETE cascade ON UPDATE no action,
	`data` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_review_sessions` (`student_id`, `data`) SELECT `student_id`, `data` FROM `review_sessions`;--> statement-breakpoint
DROP TABLE `review_sessions`;--> statement-breakpoint
ALTER TABLE `__new_review_sessions` RENAME TO `review_sessions`;
