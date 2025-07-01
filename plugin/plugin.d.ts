export interface PerformerSessionRecord {
  /** The ISO datetime of the session. */
  d: string;
  /** The Glicko rating of the performer at the end of the session. */
  g: number;
  /** The rank of the performer at the end of the session. */
  n: number;
}
