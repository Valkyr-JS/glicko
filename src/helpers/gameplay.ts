import type { StashPerformer } from "@/apollo/schema";
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

/** Convert an array of StashPerformer entries to an array of RankedPerformer
 * entries. */
export const formatPerformersToRanked = (
  performers: StashPerformer[]
): RankedPerformer[] => {
  // Convert performer data to RankedPerformer
  const rankedPerformers: RankedPerformer[] = performers.map((p) => {
    const losses = p.custom_fields?.glicko_losses ?? 0;
    const ties = p.custom_fields?.glicko_ties ?? 0;
    const wins = p.custom_fields?.glicko_wins ?? 0;

    const matchHistory = JSON.parse(
      p.custom_fields?.glicko_match_history ?? "[]"
    ) as PerformerMatchRecord[];
    const lastMatch = matchHistory[matchHistory.length - 1];

    const sessionHistory = JSON.parse(
      p.custom_fields?.glicko_session_history ?? "[]"
    ) as PerformerSessionRecord[];
    const lastSession = sessionHistory[sessionHistory.length - 1];

    const opponent = performers.find((p) => p.id === lastMatch.id)?.name;

    return {
      id: p.id,
      losses,
      matches: losses + ties + wins,
      name: p.name,
      rank: lastSession.n,
      rating: p.custom_fields?.glicko_rating ?? 0,
      recentOpponent: {
        date: new Date(lastMatch.s),
        id: lastMatch.id,
        name: opponent ?? "",
        outcome: lastMatch.r,
      },
      ties,
      wins,
    };
  });

  return rankedPerformers;
};

/** Get the result of a match as it relates to the given performer. */
export const getPerformerOutcomeFromRecord = (
  id: StashPerformer["id"],
  match: GlickoMatchResult
): 0 | 1 | 0.5 => {
  // If the performer is player 1, return the result.
  if (id === +match[0]) return match[2];

  // If the performer is player 2, translate the result as it relates to them
  return match[2] === 0 ? 1 : match[2] === 1 ? 0 : 0.5;
};
