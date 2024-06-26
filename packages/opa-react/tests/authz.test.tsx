import React from "react";
import { render, screen } from "@testing-library/react";
import Authz from "../src/authz";
import { Result } from "@styra/opa";
import { describe, test, expect, vi } from "vitest";

// vi.mock is hoisted--even before the imports (https://vitest.dev/api/vi.html#vi-mock)
vi.mock("../src/use-authz");

const useAuthzMock = await import("../src/use-authz");

describe("Authz component", () => {
  function setUseAuthzMockResult(result: Result, isLoading: boolean = false) {
    useAuthzMock.default = vi.fn(() =>
      !isLoading
        ? {
            result,
            isLoading,
            error: undefined,
          }
        : {
            result: undefined,
            isLoading,
            error: undefined,
          },
    );
    return useAuthzMock;
  }

  describe("outputs are rendered appropriately", () => {
    const input = { user: "alice" };
    const path = "tickets/allow";

    describe("when loading", () => {
      test("renders loading prop", async () => {
        setUseAuthzMockResult(true, true); // isLoading
        render(
          <Authz path={path} input={input} loading={<div>loading</div>}>
            {(result) => <button disabled={!result}>Press Here</button>}
          </Authz>,
        );
        expect(screen.queryByRole("button")).not.toBeInTheDocument();
        expect(screen.getByText("loading")).toBeInTheDocument();
      });
    });

    describe("when allowed", () => {
      test("renders children that depend on result (disabled)", async () => {
        setUseAuthzMockResult(true);
        render(
          <Authz path={path} input={input}>
            {(result) => <button disabled={!result}>Press Here</button>}
          </Authz>,
        );
        const button = screen.getByRole("button");
        expect(button).toBeInTheDocument();
        expect(button).not.toHaveAttribute("hidden");
        expect(button).not.toHaveAttribute("disabled");
      });

      test("renders children that depend on result (hidden)", async () => {
        setUseAuthzMockResult(true);
        render(
          <Authz path={path} input={input}>
            {(result) => <button hidden={!result}>Press Here</button>}
          </Authz>,
        );
        const button = screen.getByRole("button");
        expect(button).toBeInTheDocument();
        expect(button).not.toHaveAttribute("hidden");
        expect(button).not.toHaveAttribute("disabled");
      });

      test("renders children when result is truthy, ignores fallback", async () => {
        setUseAuthzMockResult(true);
        render(
          <Authz path={path} input={input} fallback={<div>unauthorized</div>}>
            <button>Press Here</button>
          </Authz>,
        );
        const button = screen.getByRole("button");
        expect(button).toBeInTheDocument();
        expect(button).not.toHaveAttribute("hidden");
        expect(button).not.toHaveAttribute("disabled");
        expect(screen.queryByText("unauthorized")).not.toBeInTheDocument();
      });

      test("renders unmodified text node", async () => {
        setUseAuthzMockResult(true);
        render(
          <p data-testid="container">
            <Authz path={path} input={input}>
              hello
            </Authz>
          </p>,
        );
        const container = screen.getByTestId("container");
        expect(container.childElementCount).toBe(0);
        expect(container).toHaveTextContent("hello");
        expect(container).not.toHaveAttribute("hidden");
      });
    });

    describe("when denied", () => {
      test("hides children that depend on result (hidden)", async () => {
        setUseAuthzMockResult(false);
        render(
          <Authz path={path} input={input}>
            {(result) => <button hidden={!result}>Press Here</button>}
          </Authz>,
        );
        const button = screen.getByText("Press Here"); // hidden elements can't be access "by role"
        expect(button).toBeInTheDocument();
        expect(button).toHaveAttribute("hidden");
        expect(button).not.toHaveAttribute("disabled");
      });

      test("disables children depending on result (disabled)", async () => {
        setUseAuthzMockResult(false);
        render(
          <Authz path={path} input={input}>
            {(result) => <button disabled={!result}>Press Here</button>}
          </Authz>,
        );
        const button = screen.getByText("Press Here");
        expect(button).toBeInTheDocument();
        expect(button).not.toHaveAttribute("hidden");
        expect(button).toHaveAttribute("disabled");
      });

      test("renders fallback when not given function", async () => {
        setUseAuthzMockResult(false);
        render(
          <Authz path={path} input={input} fallback={<div>unauthorized</div>}>
            <button>Press Here</button>
          </Authz>,
        );
        const button = screen.queryByText("Press Here");
        expect(button).not.toBeInTheDocument();
        expect(screen.getByText("unauthorized")).toBeInTheDocument();
      });

      test("ignores fallback when given function", async () => {
        setUseAuthzMockResult(false);
        render(
          <Authz path={path} input={input} fallback={<div>unauthorized</div>}>
            {(result) => <button disabled={!result}>Press Here</button>}
          </Authz>,
        );
        const button = screen.queryByText("Press Here");
        expect(button).toBeInTheDocument();
        expect(screen.queryByText("unauthorized")).not.toBeInTheDocument();
      });

      test("combines disabled and hidden siblings", async () => {
        setUseAuthzMockResult(false);
        render(
          <Authz path={path} input={input}>
            {(result) => [
              <button key="start" data-testid="start" hidden={!result}>
                Start
              </button>,
              <button key="stop" data-testid="stop" disabled={!result}>
                Stop
              </button>,
            ]}
          </Authz>,
        );
        const start = screen.getByTestId("start");
        const stop = screen.getByTestId("stop");
        expect(start).not.toHaveAttribute("disabled");
        expect(start).toHaveAttribute("hidden");
        expect(stop).toHaveAttribute("disabled");
        expect(stop).not.toHaveAttribute("hidden");
      });
    });
  });
});
