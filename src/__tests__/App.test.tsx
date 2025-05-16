import { describe, beforeEach, expect, it } from "vitest";
import { act, Suspense } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils";
import {
  RelayEnvironmentProvider,
  type OperationDescriptor,
} from "react-relay";
import App from "../App";

describe("App", () => {
  let environment: ReturnType<typeof createMockEnvironment>;
  beforeEach(() => {
    environment = createMockEnvironment();
  });

  function renderApp() {
    return render(
      <RelayEnvironmentProvider environment={environment}>
        <Suspense fallback={<div>Loading films...</div>}>
          <App />
        </Suspense>
      </RelayEnvironmentProvider>,
    );
  }

  it("renders initial films and loads more", async () => {
    renderApp();

    // initial loading state
    expect(screen.getByText("Loading films...")).toBeInTheDocument();

    act(() => {
      environment.mock.resolveMostRecentOperation((op: OperationDescriptor) =>
        MockPayloadGenerator.generate(op, {
          FilmsConnection() {
            return {
              edges: [
                { node: { id: "1", title: "Film 1", director: "Dir 1" } },
                { node: { id: "2", title: "Film 2", director: "Dir 2" } },
              ],
              pageInfo: { endCursor: "cursor2", hasNextPage: true },
            };
          },
        }),
      );
    });

    // assert rendered list
    await waitFor(() =>
      expect(screen.getAllByTestId("film-list-item")).toHaveLength(2),
    );
    // load more button
    expect(screen.getByTestId("load-more-button")).toBeInTheDocument();

    // click load more
    fireEvent.click(screen.getByTestId("load-more-button"));

    // mock pagination query response
    act(() =>
      environment.mock.resolveMostRecentOperation((op: OperationDescriptor) =>
        MockPayloadGenerator.generate(op, {
          FilmsConnection() {
            return {
              edges: [
                { node: { id: "3", title: "Film 3", director: "Dir 3" } },
                { node: { id: "4", title: "Film 4", director: "Dir 4" } },
              ],
              pageInfo: { endCursor: "cursor4", hasNextPage: false },
            };
          },
        }),
      ),
    );

    // assert updated list
    await waitFor(() =>
      expect(screen.getAllByTestId("film-list-item")).toHaveLength(4),
    );
    expect(screen.queryByTestId("load-more-button")).toBeNull();
  });

  it("", async () => {
    renderApp();

    // initial loading state
    expect(screen.getByText("Loading films...")).toBeInTheDocument();

    act(() => {
      environment.mock.resolveMostRecentOperation((op: OperationDescriptor) =>
        MockPayloadGenerator.generate(op, {
          FilmsConnection() {
            return {
              edges: [{ node: null }, { node: null }],
              pageInfo: { endCursor: "cursor2", hasNextPage: false },
            };
          },
        }),
      );
    });

    // assert rendered list
    await waitFor(() =>
      expect(screen.getAllByTestId("film-list")).toHaveLength(1),
    );
  });
});
