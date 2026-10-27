-- Undoes 0003_password_resets_kick_out_prefs, a migration from the reverted PR #1 that ran on the
-- live database before its file was deleted. No code uses these tables.
DROP TABLE IF EXISTS `class_bans`;--> statement-breakpoint
DROP TABLE IF EXISTS `password_resets`;--> statement-breakpoint
DROP TABLE IF EXISTS `teacher_prefs`;
