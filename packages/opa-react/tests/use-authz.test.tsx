import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { OPAClient } from "@styra/opa";
import AuthzProvider from "../src/opa-provider";
import useAuthz from "../src/use-authz";

describe("useAuthz Hook", () => {
  const opa: OPAClient = Object.assign(new OPAClient(""), {
    evaluate: vi.fn(),
    evaluateDefault: vi.fn(),
  });
  const wrapper = (path?: string, input?: { [k: string]: any }) => ({
    wrapper: ({ children }) => (
      <AuthzProvider sdk={opa} defaultPath={path} defaultInput={input}>
        {children}
      </AuthzProvider>
    ),
  });

  describe("on error", () => {
    it("sets the error", async () => {
      const error = new Error("error");
      const evaluateSpy = vi
        .spyOn(opa, "evaluateDefault")
        .mockRejectedValue(error);

      const { result } = renderHook(() => useAuthz(), wrapper());
      await waitFor(() =>
        expect(result.current).toMatchObject({
          isLoading: false,
          error,
          result: undefined,
        }),
      );
      expect(evaluateSpy).toHaveBeenCalledWith(undefined, expect.anything());
    });
  });

  describe("on success", () => {
    it("works without any path and input", async () => {
      const evaluateSpy = vi
        .spyOn(opa, "evaluateDefault")
        .mockResolvedValue(false);

      const { result } = renderHook(() => useAuthz(), wrapper());
      await waitFor(() =>
        expect(result.current).toMatchObject({
          isLoading: false,
          error: undefined,
          result: false,
        }),
      );
      expect(evaluateSpy).toHaveBeenCalledWith(undefined, expect.anything());
    });

    it("works with provider path and without input", async () => {
      const evaluateSpy = vi.spyOn(opa, "evaluate").mockResolvedValue(false);

      const { result } = renderHook(() => useAuthz(), wrapper("some/rule"));
      await waitFor(() =>
        expect(result.current).toMatchObject({
          isLoading: false,
          error: undefined,
          result: false,
        }),
      );
      expect(evaluateSpy).toHaveBeenCalledWith(
        "some/rule",
        undefined /* input */,
        expect.anything(),
      );
    });

    it("works with provider and call path (call path overrides provider path)", async () => {
      const evaluateSpy = vi.spyOn(opa, "evaluate").mockResolvedValue(false);

      const { result } = renderHook(
        () => useAuthz("some/other/path"),
        wrapper("some/provider/path"),
      );
      await waitFor(() =>
        expect(result.current).toMatchObject({
          isLoading: false,
          error: undefined,
          result: false,
        }),
      );
      expect(evaluateSpy).toHaveBeenCalledWith(
        "some/other/path",
        undefined /* input */,
        expect.anything(),
      );
    });

    it("works with provider path and default input", async () => {
      const evaluateSpy = vi.spyOn(opa, "evaluate").mockResolvedValue(false);

      const { result } = renderHook(
        () => useAuthz(),
        wrapper("some/rule", { x: "default" }),
      );
      await waitFor(() =>
        expect(result.current).toMatchObject({
          isLoading: false,
          error: undefined,
          result: false,
        }),
      );
      expect(evaluateSpy).toHaveBeenCalledWith(
        "some/rule",
        { x: "default" },
        expect.anything(),
      );
    });

    it("works with provider path and call input", async () => {
      const evaluateSpy = vi.spyOn(opa, "evaluate").mockResolvedValue(false);

      const { result } = renderHook(
        () => useAuthz("some/other/path", { other: "input" }),
        wrapper("some/provider/path"),
      );
      await waitFor(() =>
        expect(result.current).toMatchObject({
          isLoading: false,
          error: undefined,
          result: false,
        }),
      );
      expect(evaluateSpy).toHaveBeenCalledWith(
        "some/other/path",
        { other: "input" },
        expect.anything(),
      );
    });

    it("works with provider path and default+call input (merging)", async () => {
      const evaluateSpy = vi.spyOn(opa, "evaluate").mockResolvedValue(false);

      const { result } = renderHook(
        () => useAuthz("some/other/path", { other: "input" }),
        wrapper("some/provider/path", { x: "default" }),
      );
      await waitFor(() =>
        expect(result.current).toMatchObject({
          isLoading: false,
          error: undefined,
          result: false,
        }),
      );
      expect(evaluateSpy).toHaveBeenCalledWith(
        "some/other/path",
        { x: "default", other: "input" },
        expect.anything(),
      );
    });
  });
});
