import { Player } from "glicko2";

enum GendersEnum {
  "MALE" = MALE,
  "FEMALE" = FEMALE,
  "TRANSGENDER_MALE" = TRANSGENDER_MALE,
  "TRANSGENDER_FEMALE" = TRANSGENDER_MALE,
  "INTERSEX" = INTERSEX,
  "NON_BINARY" = NON_BINARY,
}

interface PlayerData {
  /** The player's Stash App performer ID. */
  id: string;
  /** The player image. */
  imageSrc: string;
  /** The player's name. */
  name: string;
  /** The player's glicko player data. */
  glicko: Player;
}

interface PlayerFilters {
  /** The genders that qualify for the tournament. */
  genders?: GendersEnum[];
  /** The maximum number of performers that will be pulled from Stash. */
  limit?: number;
}
