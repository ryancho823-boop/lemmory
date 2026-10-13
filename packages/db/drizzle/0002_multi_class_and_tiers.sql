CREATE TABLE `student_plans` (
	`student_id` text PRIMARY KEY NOT NULL,
	`paid_at` integer NOT NULL
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_enrollments` (
	`student_id` text NOT NULL,
	`class_id` text NOT NULL,
	`joined_day` integer NOT NULL,
	`settled_through` integer NOT NULL,
	PRIMARY KEY(`student_id`, `class_id`)
);
--> statement-breakpoint
INSERT INTO `__new_enrollments`("student_id", "class_id", "joined_day", "settled_through") SELECT "student_id", "class_id", "joined_day", "settled_through" FROM `enrollments`;--> statement-breakpoint
DROP TABLE `enrollments`;--> statement-breakpoint
ALTER TABLE `__new_enrollments` RENAME TO `enrollments`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `enrollments_class` ON `enrollments` (`class_id`);--> statement-breakpoint
ALTER TABLE `plans` ADD `org_name` text;--> statement-breakpoint
ALTER TABLE `plans` ADD `school_email` text;--> statement-breakpoint
ALTER TABLE `plans` ADD `club_status` text;