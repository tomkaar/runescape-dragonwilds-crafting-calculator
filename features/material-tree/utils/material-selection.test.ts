import { describe, expect, it } from "vitest";

import { getMaterialSelection } from "./material-selection";

const hide = { nodeId: "leather/hide" };
const blood = { nodeId: "leather/blood" };
const essence = { nodeId: "leather/essence" };

describe("getMaterialSelection", () => {
	it("returns every material as missing when none are selected", () => {
		expect(getMaterialSelection([hide, blood, essence], [])).toEqual({
			allSelected: false,
			missing: [hide, blood, essence],
		});
	});

	it("returns only the unselected materials when some are selected", () => {
		expect(
			getMaterialSelection([hide, blood, essence], [{ nodeId: blood.nodeId }]),
		).toEqual({ allSelected: false, missing: [hide, essence] });
	});

	it("reports allSelected when every material is selected", () => {
		expect(
			getMaterialSelection(
				[hide, blood, essence],
				[
					{ nodeId: essence.nodeId },
					{ nodeId: hide.nodeId },
					{ nodeId: blood.nodeId },
					{ nodeId: "other/node" },
				],
			),
		).toEqual({ allSelected: true, missing: [] });
	});

	it("ignores selected entries without a nodeId", () => {
		expect(getMaterialSelection([hide], [{}])).toEqual({
			allSelected: false,
			missing: [hide],
		});
	});

	it("is never allSelected when there are no materials", () => {
		expect(getMaterialSelection([], [{ nodeId: hide.nodeId }])).toEqual({
			allSelected: false,
			missing: [],
		});
	});
});
