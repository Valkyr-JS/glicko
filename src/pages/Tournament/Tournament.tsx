import React from "react";

interface TournamentPageProps {
  /** The zero-based index of the current match in the match list. */
  matchIndex: number;
}

const TournamentPage: React.FC<TournamentPageProps> = (props) => {
  console.log(props);
  return <main>Tournament page</main>;
};

export default TournamentPage;
