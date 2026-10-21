CREATE TABLE `attempts` (
	`id` text PRIMARY KEY NOT NULL,
	`key` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `attempts_key` ON `attempts` (`key`,`created_at`);