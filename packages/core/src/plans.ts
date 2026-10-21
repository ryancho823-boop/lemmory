// Prices and the free trial. The main site's pricing page and the apps' billing both read
// these, so changing a price here changes it everywhere.

export const TRIAL_DAYS = 14;

/** New free trials allowed from one network (IP address) in `days`, so one person can't keep starting them. */
export const TRIALS_PER_NETWORK = { count: 10, days: 30 };

export const PRICES = {
  /** Academies pay per student, counting a student in two of their classes once. */
  academy: { perStudent: 3 },
  /** Verified school clubs pay per student, but never more than `classCap` a month per class. */
  club: { perStudent: 3, classCap: 20 },
  /** Students on their own, not in a class. */
  student: { monthly: 2 },
} as const;
