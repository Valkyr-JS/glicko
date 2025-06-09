import { Player } from "glicko2";

// Add missing types
interface GlickoPlayer extends Player {
  outcomes: (0 | 0.5 | 1)[];
}

interface PlayerData {
  /** The performer profile image in Stash */
  coverImg: string;
  /** The player's Stash App performer ID. */
  id: string;
  /** Dictates whether alternative images featuring the performer can be
   * sourced. */
  imagesAvailable: boolean;
  /** The Stash ID of the image currently displayed for the performer. If
   * undefined, the cover image should be displayed instead. */
  imageID?: string;
  /** The player's name. */
  name: string;
  /** The player's glicko player data. */
  glicko: GlickoPlayer;
  /** The players' rating before the start of the tournament. */
  initialRating: number;
}

type Match =
  | [playerAIndex: number, playerBIndex: number]
  | [playerAIndex: number, playerBIndex: number, result: 1 | 0.5 | 0];
