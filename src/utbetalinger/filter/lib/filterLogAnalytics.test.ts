jest.mock("../../../utils/amplitude", () => ({
    logAmplitudeEventTyped: jest.fn(),
}));

import { logAmplitudeEventTyped } from "../../../utils/amplitude";

import { filterLogAnalytics } from "./filterLogAnalytics";

describe("filterLogAnalytics", () => {
    beforeAll(() => jest.mock("../../../utils/amplitude", () => ({ logAmplitudeEventTyped })));
    beforeEach(() => jest.clearAllMocks());

    it("logs single filter update", () => {
        const fraDato = new Date();
        filterLogAnalytics({ fraDato });
        expect(logAmplitudeEventTyped).toHaveBeenCalledWith({
            eventName: "filtervalg",
            eventData: { kategori: "fraDato", filternavn: fraDato },
        });
    });

    it("logs multiple filter updates", () => {
        const fraDato = new Date();
        const tilDato = new Date();
        const action = { fraDato, tilDato };
        filterLogAnalytics(action);
        expect(logAmplitudeEventTyped).toHaveBeenCalledWith({
            eventName: "filtervalg",
            eventData: { kategori: "fraDato", filternavn: fraDato },
        });
        expect(logAmplitudeEventTyped).toHaveBeenCalledWith({
            eventName: "filtervalg",
            eventData: { kategori: "tilDato", filternavn: tilDato },
        });
    });

    it("logs no events for empty action", () => {
        filterLogAnalytics({});
        expect(logAmplitudeEventTyped).not.toHaveBeenCalled();
    });
});
