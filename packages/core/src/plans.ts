// Prices and the pilot length. The main site's pricing page and the apps' billing both read
// these, so changing a price here changes it everywhere.

export const PILOT_DAYS = 14;

export const PRICES = {
  /** Academies pay per student, counting a student in two of their classes once. */
  academy: { perStudent: 3 },
  /** Verified school clubs pay per student, but never more than `classCap` a month per class. */
  club: { perStudent: 3, classCap: 20 },
  /** Students on their own, not in a class. */
  student: { monthly: 2 },
} as const;
