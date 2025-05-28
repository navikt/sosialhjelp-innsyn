import { expect, describe, it, vi, beforeAll, beforeEach } from "vitest";

import * as amp from "../../../utils/amplitude";

import { filterLogAnalytics } from "./filterLogAnalytics";

describe("filterLogAnalytics", () => {
    beforeAll(() => vi.spyOn(amp, "logAmplitudeEventTyped"));
    beforeEach(() => vi.clearAllMocks());

    it("logs single filter update", () => {
        const fraDato = new Date();
        filterLogAnalytics({ fraDato });
        expect(amp.logAmplitudeEventTyped).toHaveBeenCalledWith({
            eventName: "filtervalg",
            eventData: { kategori: "fraDato", filternavn: fraDato },
        });
    });

    it("logs multiple filter updates", () => {
        const fraDato = new Date();
        const tilDato = new Date();
        const action = { fraDato, tilDato };
        filterLogAnalytics(action);
        expect(amp.logAmplitudeEventTyped).toHaveBeenCalledWith({
            eventName: "filtervalg",
            eventData: { kategori: "fraDato", filternavn: fraDato },
        });
        expect(amp.logAmplitudeEventTyped).toHaveBeenCalledWith({
            eventName: "filtervalg",
            eventData: { kategori: "tilDato", filternavn: tilDato },
        });
    });

    it("logs no events for empty action", () => {
        filterLogAnalytics({});
        expect(amp.logAmplitudeEventTyped).not.toHaveBeenCalled();
    });
});
