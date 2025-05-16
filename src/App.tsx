import { graphql, useLazyLoadQuery } from "react-relay";
import { Suspense } from "react";
import FilmList from "./components/FilmsList";
import type { AppQuery } from "./__generated__/AppQuery.graphql";
import { SyncLoader } from "react-spinners";

export default function App() {
  const data = useLazyLoadQuery<AppQuery>(
    graphql`
      query AppQuery($count: Int!, $cursor: String) {
        ...FilmsList @arguments(count: $count, cursor: $cursor)
      }
    `,
    { count: 3, cursor: null },
  );

  return (
    <div className="relative flex flex-1 min-h-screen items-center justify-center w-screen flex-col gap-4">
      <h1 className="font-bold w-[400px] tracking-tight text-xl">
        Star Wars Films
      </h1>
      <Suspense
        fallback={
          <div className="flex flex-col h-[128px] gap-1 justify-center items-center">
            <SyncLoader color="#000" size={4} className="flex " />
          </div>
        }
      >
        <FilmList data={data} />
      </Suspense>
    </div>
  );
}
