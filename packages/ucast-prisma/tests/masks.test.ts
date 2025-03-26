import { describe, it, expect } from "vitest";
import { project, mask } from "../src";

describe("masking", () => {
  it("works for complete example", () => {
    const tickets = [
      { id: 0, descr: "something wrong", reporter: "John Doe", assignee: null },
      {
        id: 1,
        descr: "something else wrong",
        reporter: "Jane Doe",
        assignee: 12,
      },
      {
        id: 2,
        descr: "everything wrong",
        reporter: "Joanna Doe",
        assignee: 100,
      },
    ];
    const masks = {
      "tickets.reporter": { replace: { value: "<redacted>" } },
      "tickets.assignee": { replace: { value: null } },
      "users.id": { replace: { value: "___" } },
    };
    const act = tickets.map((ticket) => mask(masks, ticket, "tickets"));
    expect(act).toStrictEqual([
      {
        id: 0,
        descr: "something wrong",
        reporter: "<redacted>",
        assignee: null,
      },
      {
        id: 1,
        descr: "something else wrong",
        reporter: "<redacted>",
        assignee: null,
      },
      {
        id: 2,
        descr: "everything wrong",
        reporter: "<redacted>",
        assignee: null,
      },
    ]);
  });

  describe("mask", () => {
    it("replaces according to mask rules", () => {
      const act = mask(
        {
          id: { replace: { value: "***" } },
          phone: { replace: { value: "---" } },
        },
        { id: "agathe", tea: "green", phone: "00347232132341" }
      );
      expect(act).toStrictEqual({ id: "***", tea: "green", phone: "---" });
    });

    it("copes with missing values", () => {
      const act = mask(
        {
          id: { replace: { value: "***" } },
          phone: {},
        },
        { id: "agathe", tea: "green", phone: "00347232132341" }
      );
      expect(act).toStrictEqual({
        id: "***",
        tea: "green",
        phone: "00347232132341",
      });
    });

    it("replaces according to mask rules, with projection and related fields", () => {
      const act = mask(
        {
          "users.id": { replace: { value: "***" } },
          "users.phone": { replace: { value: "---" } },
          "address.street": { replace: { value: "sesame" } },
        },
        {
          id: "agathe",
          tea: "green",
          phone: "00347232132341",
          address: { street: "main" },
        },
        "users"
      );
      expect(act).toStrictEqual({
        id: "***",
        tea: "green",
        phone: "---",
        address: { street: "sesame" },
      });
    });

    it("replaces according to mask rules, also non-strings", () => {
      const act = mask(
        { id: { replace: { value: true } } },
        { id: "agathe", tea: "green" }
      );
      expect(act).toStrictEqual({ id: true, tea: "green" });
    });

    it("ignores unknown mask rules", () => {
      const act = mask(
        {
          id: { prefix: { value: "***" } },
          phone: { suffix: { value: "---" } },
        } as any, // NOTE(sr): "as any" deliberate to check against unknown mask input
        { id: "agathe", tea: "green", phone: "00347232132341" }
      );
      expect(act).toStrictEqual({
        id: "agathe",
        tea: "green",
        phone: "00347232132341",
      });
    });
  });

  describe("project", () => {
    it("drops the prefixes (1)", () => {
      const act = project(
        { "users.id": { replace: { value: "***" } } },
        "users"
      );
      expect(act).toStrictEqual({ id: { replace: { value: "***" } } });
    });

    it("drops the prefixes (n)", () => {
      const act = project(
        {
          "users.id": { replace: { value: "***" } },
          "users.name": { replace: { value: "<name>" } },
        },
        "users"
      );
      expect(act).toStrictEqual({
        id: { replace: { value: "***" } },
        name: { replace: { value: "<name>" } },
      });
    });

    it("keeps prefixes on mask rules for related (non-primary) objects", () => {
      const act = project(
        {
          "users.id": { replace: { value: "***" } },
          "tenants.id": { replace: { value: "---" } },
        },
        "users"
      );
      expect(act).toStrictEqual({
        id: { replace: { value: "***" } },
        tenants: { id: { replace: { value: "---" } } },
      });
    });

    it("can have no primary masks if there are none matching", () => {
      const act = project(
        {
          "tenants.id": { replace: { value: "---" } },
        },
        "users"
      );
      expect(act).toStrictEqual({
        tenants: { id: { replace: { value: "---" } } },
      });
    });
  });
});
