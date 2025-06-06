import { Player } from "glicko2";

enum GendersEnum {
  MALE = "MALE",
  FEMALE = "FEMALE",
  TRANSGENDER_MALE = "TRANSGENDER_MALE",
  TRANSGENDER_MALE = "TRANSGENDER_FEMALE",
  INTERSEX = "INTERSEX",
  NON_BINARY = "NON_BINARY",
}

interface PlayerData {
  /** The performer profile image in Stash */
  coverImg: string;
  /** The player's Stash App performer ID. */
  id: string;
  /** The Stash ID of the image currently displayed for the performer. If
   * undefined, the cover image should be displayed instead. */
  imageID?: string;
  /** The player's name. */
  name: string;
  /** The player's glicko player data. */
  glicko: Player;
}

type PlayerGenders = `${GendersEnum}`;

interface PlayerFilters {
  /** The genders that qualify for the tournament. */
  genders: PlayerGenders[];
  /** The maximum number of performers that will be pulled from Stash. */
  limit: number;
}

type Match =
  | [playerAIndex: number, playerBIndex: number]
  | [playerAIndex: number, playerBIndex: number, result: 1 | 0.5 | 0];
