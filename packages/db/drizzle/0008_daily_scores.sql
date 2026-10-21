CREATE TABLE `daily_scores` (
	`student_id` text NOT NULL,
	`day` integer NOT NULL,
	`n` integer NOT NULL,
	PRIMARY KEY(`student_id`, `day`),
	FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);;--> statement-breakpoint
-- Fill it from the existing review log (one row per student per day), once.
INSERT INTO `daily_scores` (`student_id`, `day`, `n`) SELECT `student_id`, `day`, count(*) FROM `reviews` WHERE `extra` = 0 GROUP BY `student_id`, `day`;
