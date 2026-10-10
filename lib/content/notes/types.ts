/** The longer write-up shown on a formula's page. Text uses inline $...$ math. */
export interface Note {
  /** What the formula says and how to use it, in plain words. */
  explain: string;
  /** A short proof or derivation, shown in an expandable section. */
  proof: string;
}

export type Notes = Record<string, Note>;
