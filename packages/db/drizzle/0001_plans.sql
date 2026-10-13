CREATE TABLE `plans` (
	`teacher_id` text PRIMARY KEY NOT NULL,
	`kind` text NOT NULL,
	`pilot_ends_at` integer,
	`paid_at` integer
);
