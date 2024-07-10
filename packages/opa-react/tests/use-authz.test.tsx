import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { OPAClient, type Result } from "@styra/opa";
import {
  default as AuthzProvider,
  AuthzProviderProps,
} from "../src/authz-provider";
import useAuthz from "../src/use-authz";

describe("useAuthz Hook", () => {
  const opa: OPAClient = Object.assign(new OPAClient(""), {
    evaluate: vi.fn(),
    evaluateDefault: vi.fn(),
  });
  const wrapper = ({
    defaultPath,
    defaultInput,
    defaultFromResult,
  }: Omit<AuthzProviderProps, "opaClient" | "queryClient" | "retry"> = {}) => {
    return {
      wrapper: ({ children }) => (
        <AuthzProvider
          opaClient={opa}
          defaultPath={defaultPath}
          defaultInput={defaultInput}
          defaultFromResult={defaultFromResult}
          retry={false}
        >
          {children}
        </AuthzProvider>
      ),
    };
  };

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

      const { result } = renderHook(
        () => useAuthz(),
        wrapper({ defaultPath: "some/rule" }),
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
        undefined /* input */,
        expect.anything(),
      );
    });

    it("works without any path and input, with fromResult from provider prop", async () => {
      const evaluateSpy = vi
        .spyOn(opa, "evaluateDefault")
        .mockResolvedValue(false);

      const defaultFromResult = (r?: Result): boolean =>
        ((r as Record<string, any>)["foobar"] as boolean) ?? false;

      const { result } = renderHook(
        () => useAuthz(),
        wrapper({ defaultFromResult }),
      );
      await waitFor(() =>
        expect(result.current).toMatchObject({
          isLoading: false,
          error: undefined,
          result: false,
        }),
      );
      expect(evaluateSpy).toHaveBeenCalledWith(undefined, {
        fetchOptions: expect.anything(),
        fromResult: defaultFromResult,
      });
    });

    it("works with path and input, with fromResult from provider prop", async () => {
      const evaluateSpy = vi.spyOn(opa, "evaluate").mockResolvedValue(false);

      const defaultFromResult = (r?: Result): boolean =>
        ((r as Record<string, any>)["foobar"] as boolean) ?? false;

      const { result } = renderHook(
        () => useAuthz(),
        wrapper({
          defaultFromResult,
          defaultPath: "some/thing",
          defaultInput: { x: true },
        }),
      );
      await waitFor(() =>
        expect(result.current).toMatchObject({
          isLoading: false,
          error: undefined,
          result: false,
        }),
      );
      expect(evaluateSpy).toHaveBeenCalledWith(
        "some/thing",
        { x: true },
        {
          fetchOptions: expect.anything(),
          fromResult: defaultFromResult,
        },
      );
    });

    it("works with path and input, with authz fromResult overriding provider props", async () => {
      const evaluateSpy = vi.spyOn(opa, "evaluate").mockResolvedValue(false);

      const defaultFromResult = (r?: Result): boolean =>
        ((r as Record<string, any>)["foobar"] as boolean) ?? false;
      const defaultFromResult2 = (r?: Result): boolean => true;

      const { result } = renderHook(
        () => useAuthz("some/thing/else", { y: "z" }, defaultFromResult2),
        wrapper({
          defaultFromResult,
          defaultPath: "some/thing",
          defaultInput: { x: true },
        }),
      );
      await waitFor(() =>
        expect(result.current).toMatchObject({
          isLoading: false,
          error: undefined,
          result: false,
        }),
      );
      expect(evaluateSpy).toHaveBeenCalledWith(
        "some/thing/else",
        { x: true, y: "z" },
        {
          fetchOptions: expect.anything(),
          fromResult: defaultFromResult2,
        },
      );
    });

    it("works with provider and call path (call path overrides provider path)", async () => {
      const evaluateSpy = vi.spyOn(opa, "evaluate").mockResolvedValue(false);

      const { result } = renderHook(
        () => useAuthz("some/other/path"),
        wrapper({ defaultPath: "some/provider/path" }),
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
        wrapper({ defaultPath: "some/rule", defaultInput: { x: "default" } }),
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
        wrapper({ defaultPath: "some/provider/path" }),
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
        wrapper({
          defaultPath: "some/provider/path",
          defaultInput: { x: "default" },
        }),
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
