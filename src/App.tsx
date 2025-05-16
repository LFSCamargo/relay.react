import { graphql, useLazyLoadQuery } from "react-relay";
import { Suspense } from "react";
import FilmList from "./components/FilmsList";
import type { AppQuery } from "./__generated__/AppQuery.graphql";

export default function App() {
  const data = useLazyLoadQuery<AppQuery>(
    graphql`
      query AppQuery($count: Int!, $cursor: String) {
        ...FilmsList @arguments(count: $count, cursor: $cursor)
      }
    `,
    { count: 2, cursor: null }
  );

  return (
    <div>
      <h1>Star Wars Films</h1>
      <Suspense fallback={<div>Loading films...</div>}>
        <FilmList data={data} />
      </Suspense>
    </div>
  );
}
