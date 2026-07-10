import { describe, it, expect } from "vitest";
import { idFromName, slugify } from "./id-from-name";

describe("slugify", () => {
  it("lowercases and replaces spaces with hyphens", () => {
    expect(slugify("Iron Ore")).toBe("iron-ore");
  });

  it("strips special characters", () => {
    expect(slugify("Ravanna's Ring")).toBe("ravannas-ring");
  });

  it("removes accents", () => {
    expect(slugify("Café Crème")).toBe("cafe-creme");
  });

  it("collapses repeated whitespace and hyphens", () => {
    expect(slugify("Wall   (Cabin)")).toBe("wall-cabin");
  });

  it("trims leading and trailing whitespace", () => {
    expect(slugify("  Copper Ore  ")).toBe("copper-ore");
  });

  it("is case-insensitive to differently-cased input", () => {
    expect(slugify("IRON ore")).toBe(slugify("iron Ore"));
  });

  it("collapses different punctuation into the same slug", () => {
    expect(slugify("Wall (Cabin)")).toBe(slugify("Wall - Cabin"));
  });
});

describe("idFromName", () => {
  it("delegates to slugify", () => {
    expect(idFromName("Iron Ore")).toBe(slugify("Iron Ore"));
  });

  it("produces the same id for names differing only in case", () => {
    expect(idFromName("Moon Ring")).toBe(idFromName("moon ring"));
  });
});
