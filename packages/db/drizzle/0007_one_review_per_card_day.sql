-- Keep the first review of a card per day if any duplicates exist, so the index can be created.
DELETE FROM `reviews` WHERE `id` NOT IN (SELECT MIN(`id`) FROM `reviews` GROUP BY `student_id`, `day`, `formula_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `reviews_one_per_card_day` ON `reviews` (`student_id`,`day`,`formula_id`);