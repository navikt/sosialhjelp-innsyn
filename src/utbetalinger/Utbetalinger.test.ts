import { utbetalingsdetaljerDefaultAapnet } from "./beta/tabs/UtbetalingAccordionItem";

describe("utbetalingsdetaljerDefaultAapnet", () => {
    it("returns false when the date is 18 days in the past", () =>
        expect(utbetalingsdetaljerDefaultAapnet(new Date("2024-01-14"), "2023-12-27")).toBe(false));

    it("returns false when the date is 16 days in the past (same month)", () =>
        expect(utbetalingsdetaljerDefaultAapnet(new Date("2024-01-20"), "2024-01-04")).toBe(false));

    it("returns false when the date is 16 days in the past", () =>
        expect(utbetalingsdetaljerDefaultAapnet(new Date("2024-01-14"), "2023-12-29")).toBe(false));

    it("returns true when the date is 15 days in the past (same month)", () =>
        expect(utbetalingsdetaljerDefaultAapnet(new Date("2024-01-20"), "2024-01-05")).toBe(true));

    it("returns true when the date is 15 days in the past", () =>
        expect(utbetalingsdetaljerDefaultAapnet(new Date("2024-01-14"), "2023-12-30")).toBe(true));

    it("returns true when the date is 14 days in the past", () =>
        expect(utbetalingsdetaljerDefaultAapnet(new Date("2024-01-14"), "2023-12-31")).toBe(true));

    it("returns true when the date is the same as today's date", () =>
        expect(utbetalingsdetaljerDefaultAapnet(new Date("2024-01-14"), "2024-01-14")).toBe(true));

    it("returns true when the date is 14 days in the future", () =>
        expect(utbetalingsdetaljerDefaultAapnet(new Date("2024-01-14"), "2024-01-28")).toBe(true));

    it("returns true when the date is 15 days in the future", () =>
        expect(utbetalingsdetaljerDefaultAapnet(new Date("2024-01-14"), "2024-01-29")).toBe(true));

    it("returns false when the date is 16 days in the future", () =>
        expect(utbetalingsdetaljerDefaultAapnet(new Date("2024-01-14"), "2024-01-30")).toBe(false));

    it("returns false when the date is 18 days in the future", () =>
        expect(utbetalingsdetaljerDefaultAapnet(new Date("2024-01-14"), "2024-02-02")).toBe(false));

    it("returns false when the date is undefined", () => {
        expect(utbetalingsdetaljerDefaultAapnet(new Date("2024-01-14"), "")).toBe(false);
    });
});
