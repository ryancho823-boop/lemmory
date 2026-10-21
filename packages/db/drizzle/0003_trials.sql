CREATE TABLE `trial_claims` (
	`id` text PRIMARY KEY NOT NULL,
	`role` text NOT NULL,
	`kind` text NOT NULL,
	`hash` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `trial_claims_hash` ON `trial_claims` (`kind`,`hash`);--> statement-breakpoint
DROP INDEX "classes_join_code_unique";--> statement-breakpoint
DROP INDEX "classes_teacher";--> statement-breakpoint
DROP INDEX "enrollments_class";--> statement-breakpoint
DROP INDEX "reviews_student_day";--> statement-breakpoint
DROP INDEX "sessions_user";--> statement-breakpoint
DROP INDEX "users_email_unique";--> statement-breakpoint
DROP INDEX "users_username_unique";--> statement-breakpoint
ALTER TABLE `student_plans` ALTER COLUMN "paid_at" TO "paid_at" integer;--> statement-breakpoint
CREATE UNIQUE INDEX `classes_join_code_unique` ON `classes` (`join_code`);--> statement-breakpoint
CREATE INDEX `classes_teacher` ON `classes` (`teacher_id`);--> statement-breakpoint
CREATE INDEX `enrollments_class` ON `enrollments` (`class_id`);--> statement-breakpoint
CREATE INDEX `reviews_student_day` ON `reviews` (`student_id`,`day`);--> statement-breakpoint
CREATE INDEX `sessions_user` ON `sessions` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);--> statement-breakpoint
ALTER TABLE `student_plans` ADD `trial_ends_at` integer;--> statement-breakpoint
ALTER TABLE `student_plans` ADD `billing_name` text;--> statement-breakpoint
ALTER TABLE `student_plans` ADD `billing_email` text;--> statement-breakpoint
ALTER TABLE `plans` ADD `org_location` text;--> statement-breakpoint
ALTER TABLE `plans` ADD `billing_name` text;--> statement-breakpoint
ALTER TABLE `plans` ADD `billing_email` text;