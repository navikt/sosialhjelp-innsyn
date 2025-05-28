import { expect, describe, it, vi } from "vitest";

import { NyeOgTidligereUtbetalingerResponse } from "../../../generated/model";
import { getHentTidligereUtbetalingerResponseMock } from "../../../generated/utbetalinger-controller/utbetalinger-controller.msw";

import { filterMatch } from "./filterMatch";
import { filterResponses } from "./filterResponses";

vi.mock("./filterMatch");

describe("filterResponses", () => {
    const UTBETALINGER = [
        { utbetalingerForManed: [{ mottaker: "mottaker1" }] },
    ] as unknown as NyeOgTidligereUtbetalingerResponse[];

    it("should return undefined when utbetalinger is undefined", () =>
        expect(filterResponses(undefined, null)).toBeUndefined());

    it("should return original when filters is null", () =>
        expect(filterResponses(UTBETALINGER, null)).toBe(UTBETALINGER));

    it("should invoke filterMatch for each utbetaling", () => {
        const response = getHentTidligereUtbetalingerResponseMock();
        const totalUtbetalinger = response.reduce((acc, { utbetalingerForManed: { length } }) => acc + length, 0);
        filterResponses(response, { mottaker: "annenMottaker" });
        expect(filterMatch).toHaveBeenCalledTimes(totalUtbetalinger);
    });
});
