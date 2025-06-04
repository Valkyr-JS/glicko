import { shuffle } from "@/utils/math";

/** Creates an array of player index tuples from the given number of players in
 * the round robin. */
export const createRoundRobinMatchList = (
  playerCount: number
): [playerAIndex: number, playerBIndex: number][] => {
  const matchups: [number, number][] = [];
  for (let i = 0; i < playerCount; i++) {
    for (let j = 1; j < playerCount; j++) {
      // Check if the indices match, or the match is already listed in the
      // opposite order.
      const sameIndex = i === j;
      const alreadyExists = matchups.find((m) => `${m}` === `${[j, i]}`);
      if (!sameIndex && !alreadyExists) matchups.push([i, j]);
    }
  }

  // 50:50 chance that the indexes should swap over
  const mixedMatchups: [number, number][] = matchups.map((m) =>
    Math.round(Math.random()) === 0 ? m : [m[1], m[0]]
  );

  // Randomise the matchups before returning
  return shuffle(mixedMatchups);
};
