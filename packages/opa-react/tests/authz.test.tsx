import { cleanup, render, screen } from "@testing-library/react";
import Authz from "../src/authz";
import { Result } from "@styra/opa";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";

// vi.mock is hoisted--even before the imports (https://vitest.dev/api/vi.html#vi-mock)
vi.mock("../src/use-authz");

let useAuthzMock: { default: unknown };

describe("Authz component", () => {
  beforeEach(async () => {
    useAuthzMock = await import("../src/use-authz");
  });

  afterEach(() => {
    cleanup(); // cleanup DOM after each test
  });

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
            <button>Press Here</button>
          </Authz>,
        );
        expect(screen.queryByRole("button")).not.toBeInTheDocument();
        expect(screen.getByText("loading")).toBeInTheDocument();
      });
    });

    describe("when allowed", () => {
      test("renders children", async () => {
        setUseAuthzMockResult(true);
        render(
          <Authz path={path} input={input}>
            <button>Press Here</button>
          </Authz>,
        );
        const button = screen.getByRole("button");
        expect(button).toBeInTheDocument();
        expect(button).not.toHaveAttribute("hidden");
        expect(button).not.toHaveAttribute("disabled");
      });

      test("renders children when result is truthy, ignores fallback", async () => {
        setUseAuthzMockResult({ allowed: "yes" });
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
      test("hides children", async () => {
        setUseAuthzMockResult(false);
        render(
          <Authz path={path} input={input}>
            <button>Press Here</button>
          </Authz>,
        );
        const button = screen.queryByText("Press Here"); // hidden elements can't be access "by role"
        expect(button).not.toBeInTheDocument();
      });

      test("renders fallback when given", async () => {
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
    });
  });
});
