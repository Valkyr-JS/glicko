import { Player } from "glicko2";

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
