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
    batch = false,
  }: Omit<AuthzProviderProps, "opaClient" | "queryClient" | "retry"> = {}) => {
    return {
      wrapper: ({ children }) => (
        <AuthzProvider
          opaClient={opa}
          defaultPath={defaultPath}
          defaultInput={defaultInput}
          defaultFromResult={defaultFromResult}
          retry={false}
          batch={batch}
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

      it("caches requests with the same input/path (disregarding fromResult)", async () => {
        // NOTE(sr): We're mocking the call to evaluate which handles the `fromResult`
        // application. So, it never really is called. However, we check that it was
        // passed as expected in the assertions below.
        const evaluateSpy = vi.spyOn(opa, "evaluate").mockResolvedValue(false);

        const fromResult1 = (res?: Result) => (res as any).foo;
        const fromResult2 = (res?: Result) => (res as any).bar;

        const { result } = renderHook(() => {
          return {
            first: useAuthz("path/allow", "foo", fromResult1),
            second: useAuthz(
              "path/allow",
              "foo",
              fromResult2, // Not part of the cache key!
            ),
          };
        }, wrapper());

        await waitFor(() =>
          Promise.all([
            expect(result.current.first).toMatchObject({
              isLoading: false,
              error: undefined,
              result: false,
            }),
            expect(result.current.second).toMatchObject({
              isLoading: false,
              error: undefined,
              result: false,
            }),
          ]),
        );

        expect(evaluateSpy).toHaveBeenCalledOnce();
        expect(evaluateSpy).toHaveBeenCalledWith("path/allow", "foo", {
          fetchOptions: expect.anything(),
          fromResult: fromResult1,
        });
      });
    });

    describe("with multiple queries", () => {
      describe("on error", () => {
        it("sets the error accordingly", async () => {
          const error = new Error("error");
          const evaluateSpy = vi
            .spyOn(opa, "evaluateDefault")
            .mockRejectedValueOnce(error)
            .mockResolvedValueOnce(false);

          const in1 = { a: "foo" };
          const in2 = { b: "bar" };
          const { result } = renderHook(
            () => useAuthz([{ input: in1 }, { input: in2 }]),
            wrapper(),
          );
          await waitFor(() =>
            expect(result.current).toMatchObject([
              {
                isLoading: false,
                error,
                result: undefined,
              },
              {
                isLoading: false,
                error: undefined,
                result: false,
              },
            ]),
          );
          expect(evaluateSpy).toHaveBeenCalledTimes(2);
          expect(evaluateSpy).toHaveBeenNthCalledWith(
            1,
            in1,
            expect.anything(),
          );
          expect(evaluateSpy).toHaveBeenNthCalledWith(
            2,
            in2,
            expect.anything(),
          );
        });
      });

      describe("on success", () => {
        it("works with default path+input from provider", async () => {
          const evaluateSpy = vi
            .spyOn(opa, "evaluate")
            .mockResolvedValue(false);

          const in1 = { a: "foo" };
          const in2 = { b: "bar" };
          const { result } = renderHook(
            () => useAuthz([{ input: in1 }, { input: in2 }]),
            wrapper({
              defaultPath: "def/ault",
              defaultInput: { user: "alice" },
            }),
          );
          await waitFor(() =>
            expect(result.current).toMatchObject([
              {
                isLoading: false,
                error: undefined,
                result: false,
              },
              {
                isLoading: false,
                error: undefined,
                result: false,
              },
            ]),
          );
          expect(evaluateSpy).toHaveBeenCalledTimes(2);
          expect(evaluateSpy).toHaveBeenNthCalledWith(
            1,
            "def/ault",
            { user: "alice", ...in1 },
            expect.anything(),
          );
          expect(evaluateSpy).toHaveBeenNthCalledWith(
            2,
            "def/ault",
            { user: "alice", ...in2 },
            expect.anything(),
          );
        });
      });
    });
  });

  describe("with batching", () => {
    const batch = true;

    it("works without input, without fromResult", async () => {
      let hash: string;
      const evaluateSpy = vi
        .spyOn(opa, "evaluateBatch")
        .mockImplementationOnce((_path, inputs, _opts) => {
          [hash] = Object.keys(inputs);
          return Promise.resolve({ [hash]: false });
        });

      const { result } = renderHook(
        () => useAuthz("path/allow"),
        wrapper({ batch }),
      );
      await waitFor(() =>
        expect(result.current).toMatchObject({
          isLoading: false,
          error: undefined,
          result: false,
        }),
      );
      expect(evaluateSpy).toHaveBeenCalledWith(
        "path/allow",
        { [hash]: undefined },
        { rejectMixed: true },
      );
    });

    it("works without input, with fromResult", async () => {
      let hash: string;
      const evaluateSpy = vi
        .spyOn(opa, "evaluateBatch")
        .mockImplementationOnce((_path, inputs, _opts) => {
          [hash] = Object.keys(inputs);
          return Promise.resolve({ [hash]: { foo: false } });
        });

      const { result } = renderHook(
        () => useAuthz("path/allow", undefined, (x?: Result) => (x as any).foo),
        wrapper({ batch }),
      );
      await waitFor(() =>
        expect(result.current).toMatchObject({
          isLoading: false,
          error: undefined,
          result: false,
        }),
      );
      expect(evaluateSpy).toHaveBeenCalledWith(
        "path/allow",
        { [hash]: undefined },
        { rejectMixed: true },
      );
    });

    it("rejects evals without path", async () => {
      const evaluateSpy = vi.spyOn(opa, "evaluateBatch");

      const { result } = renderHook(
        () => useAuthz(undefined, "some input"),
        wrapper({ batch }),
      );
      await waitFor(() =>
        expect(result.current).toMatchObject({
          isLoading: false,
          error: new Error("batch requests need to have a defined query path"),
          result: undefined,
        }),
      );
      expect(evaluateSpy).not.toHaveBeenCalled();
    });

    it("works with input, with fromResult", async () => {
      let hash: string;
      const evaluateSpy = vi
        .spyOn(opa, "evaluateBatch")
        .mockImplementationOnce((_path, inputs, _opts) => {
          [hash] = Object.keys(inputs);
          return Promise.resolve({ [hash]: { foo: false } });
        });

      const { result } = renderHook(
        () => useAuthz("path/allow", "foo", (x?: Result) => (x as any).foo),
        wrapper({ batch }),
      );
      await waitFor(() =>
        expect(result.current).toMatchObject({
          isLoading: false,
          error: undefined,
          result: false,
        }),
      );
      expect(evaluateSpy).toHaveBeenCalledWith(
        "path/allow",
        { [hash]: "foo" },
        { rejectMixed: true },
      );
    });

    it("batches multiple requests with different inputs", async () => {
      let hash1: string;
      let hash2: string;
      const evaluateSpy = vi
        .spyOn(opa, "evaluateBatch")
        .mockImplementationOnce((_path, inputs, _opts) => {
          const res = Object.fromEntries(
            Object.entries(inputs).map(([k, inp]) => {
              if (inp === "foo") {
                hash1 = k;
              } else {
                hash2 = k;
              }
              return [k, inp != "foo"];
            }),
          );
          return Promise.resolve({ [hash1]: false, [hash2]: true });
        });

      const { result } = renderHook(() => {
        return {
          first: useAuthz("path/allow", "foo"),
          second: useAuthz("path/allow", "bar"),
        };
      }, wrapper({ batch }));

      await waitFor(() =>
        Promise.all([
          expect(result.current.first).toMatchObject({
            isLoading: false,
            error: undefined,
            result: false,
          }),
          expect(result.current.second).toMatchObject({
            isLoading: false,
            error: undefined,
            result: true,
          }),
        ]),
      );

      expect(evaluateSpy).toHaveBeenCalledWith(
        "path/allow",
        { [hash1]: "foo", [hash2]: "bar" },
        { rejectMixed: true },
      );
    });

    it("batches multiple requests with different paths+fromResults, too", async () => {
      let hash1: string;
      let hash2: string;
      const evaluateSpy = vi
        .spyOn(opa, "evaluateBatch")
        .mockImplementationOnce((_path, inputs, _opts) => {
          [hash1] = Object.keys(inputs);
          return Promise.resolve({ [hash1]: { a: false } });
        })
        .mockImplementationOnce((_path, inputs, _opts) => {
          [hash2] = Object.keys(inputs);
          return Promise.resolve({ [hash2]: { b: true } });
        });

      const { result } = renderHook(() => {
        return {
          first: useAuthz("path/foo", "foo", (x?: Result) => (x as any).a),
          second: useAuthz("path/bar", "bar", (x?: Result) => (x as any).b),
        };
      }, wrapper({ batch }));

      await waitFor(() =>
        Promise.all([
          expect(result.current.first).toMatchObject({
            isLoading: false,
            error: undefined,
            result: false,
          }),
          expect(result.current.second).toMatchObject({
            isLoading: false,
            error: undefined,
            result: true,
          }),
        ]),
      );

      expect(evaluateSpy).toHaveBeenCalledWith(
        "path/foo",
        { [hash1]: "foo" },
        { rejectMixed: true },
      );
      expect(evaluateSpy).toHaveBeenCalledWith(
        "path/bar",
        { [hash2]: "bar" },
        { rejectMixed: true },
      );
    });

    it("coalesces multiple requests with the same path input (disregarding fromResult)", async () => {
      let hash: string;
      // NOTE(sr): Unlike the non-batching case, we're handling the application of `fromResult`
      // in the code of opa-react. So the functions that are passed are evaluated on the mocked
      // result returned here.
      const evaluateSpy = vi
        .spyOn(opa, "evaluateBatch")
        .mockImplementationOnce((_path, inputs, _opts) => {
          [hash] = Object.keys(inputs);
          return Promise.resolve({ [hash]: { foo: false } });
        });

      const { result } = renderHook(() => {
        return {
          first: useAuthz(
            "path/allow",
            "foo",
            (res?: Result) => (res as any).foo,
          ),
          second: useAuthz(
            "path/allow",
            "foo",
            (res?: Result) => (res as any).bar,
          ),
        };
      }, wrapper({ batch }));

      await waitFor(() =>
        Promise.all([
          expect(result.current.first).toMatchObject({
            isLoading: false,
            error: undefined,
            result: false,
          }),
          expect(result.current.second).toMatchObject({
            isLoading: false,
            error: undefined,
            result: false,
          }),
        ]),
      );

      expect(evaluateSpy).toHaveBeenCalledWith(
        "path/allow",
        { [hash]: "foo" },
        { rejectMixed: true },
      );
    });

    describe("with multiple queries", () => {
      it("works with default path+input from provider, per-query fromResult", async () => {
        let hash1: string;
        let hash2: string;
        const evaluateSpy = vi
          .spyOn(opa, "evaluateBatch")
          .mockImplementationOnce((_path, inputs, _opts) => {
            Object.entries(inputs).forEach(([k, inp]) => {
              if ((inp as any).a === "foo") {
                hash1 = k;
              } else {
                hash2 = k;
              }
            });
            return Promise.resolve({
              [hash1]: { foo: false },
              [hash2]: { bar: true },
            });
          });

        const in1 = { a: "foo" };
        const in2 = { b: "bar" };
        const { result } = renderHook(
          () =>
            useAuthz([
              { input: in1, fromResult: (x?: Result) => (x as any).foo },
              { input: in2, fromResult: (x?: Result) => (x as any).bar },
            ]),
          wrapper({
            defaultPath: "def/ault",
            defaultInput: { user: "alice" },
            batch: true,
          }),
        );
        await waitFor(() =>
          expect(result.current).toMatchObject([
            {
              isLoading: false,
              error: undefined,
              result: false,
            },
            {
              isLoading: false,
              error: undefined,
              result: true,
            },
          ]),
        );
        expect(evaluateSpy).toHaveBeenCalledTimes(1);
        expect(evaluateSpy).toHaveBeenCalledWith(
          "def/ault",
          {
            [hash1]: { user: "alice", ...in1 },
            [hash2]: { user: "alice", ...in2 },
          },
          expect.anything(),
        );
      });
      it("rejects evals without path", async () => {
        const evaluateSpy = vi.spyOn(opa, "evaluateBatch");

        const { result } = renderHook(
          () => useAuthz([{ input: "some input" }]),
          wrapper({ batch }),
        );
        await waitFor(() =>
          expect(result.current).toMatchObject([
            {
              isLoading: false,
              error: new Error(
                "batch requests need to have a defined query path",
              ),
              result: undefined,
            },
          ]),
        );
        expect(evaluateSpy).not.toHaveBeenCalled();
      });
    });
  });
});
