import { it, expect } from "vitest";
import { sourceItemById } from "./source-item-by-id";

  it("returns the item when a valid id is provided", () => {
    const item = sourceItemById("f76ea921edc2");
    expect(item).toBeDefined();
    expect(item?.name).toBe("Wall");
  });

  it("returns undefined for an unknown id", () => {
    expect(sourceItemById("does-not-exist")).toBeUndefined();
  });

  it("is case-insensitive", () => {
    const lower = sourceItemById("f76ea921edc2");
    const upper = sourceItemById("F76EA921EDC2");
    expect(lower).toBeDefined();
    expect(upper).toBeDefined();
    expect(lower?.id).toBe(upper?.id);
  });

  it("returns a correctly shaped item", () => {
    const item = sourceItemById("f76ea921edc2");
    expect(item).toMatchObject({
      id: "f76ea921edc2",
      name: "Wall",
      variants: expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          recipe: expect.objectContaining({
            materials: expect.any(Array),
          }),
        }),
      ]),
      facilities: expect.any(Array),
    });
  });
