import { graphql, usePaginationFragment } from "react-relay";
import FilmListItem from "./Film";
import type { FilmsList$key } from "./__generated__/FilmsList.graphql";
import type { AppQuery } from "../__generated__/AppQuery.graphql";

type FilmListProps = {
  data: FilmsList$key;
  pageSize?: number;
};

export default function FilmList({ data, pageSize = 3 }: FilmListProps) {
  const {
    data: fragmentData,
    loadNext,
    hasNext,
    isLoadingNext,
  } = usePaginationFragment<AppQuery, FilmsList$key>(
    graphql`
      fragment FilmsList on Root
      @refetchable(queryName: "FilmListPaginationQuery")
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 2 }
        cursor: { type: "String" }
      ) {
        allFilms(first: $count, after: $cursor)
          @connection(key: "FilmList_allFilms") {
          edges {
            node {
              id
              ...Film_item
            }
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    `,
    data,
  );

  // Render the list of films
  return (
    <div data-testid="film-list" className="flex flex-col">
      {fragmentData.allFilms?.edges!.map((edge) => {
        const filmNode = edge!.node;

        return filmNode ? (
          <FilmListItem key={filmNode.id} film={filmNode} />
        ) : null;
      })}

      {/* "Load More" button for pagination */}
      {hasNext /* if there's another page available */ && (
        <button
          className="flex flex-row px-4 py-2 mt-4  bg-neutral-500 text-white rounded-xl justify-center disabled:cursor-progress disabled:opacity-50"
          onClick={() => loadNext(pageSize)} // load 5 more items
          disabled={isLoadingNext}
          data-testid="load-more-button"
          aria-disabled={isLoadingNext}
        >
          Load More
        </button>
      )}
    </div>
  );
}
