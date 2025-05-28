import { expect, describe, it, beforeAll, afterAll, vi } from "vitest";

import { isLessThanTwoWeeksAgo } from "./isLessThanTwoWeeksAgo";

/**
 * For en gitt referansedato og måldato, forventer vi at funksjonen returnerer et gitt resultat.
 * @param referenceDate Mock-verdi for systemklokka
 * @param targetDate Datoen vi vil sjekke
 * @param expectedResult Forventet resultat
 * @param description Beskrivelse av testen
 */
const expectResult = (referenceDate: string, targetDate: string, expectedResult: boolean, description: string) =>
    it(`returns ${expectedResult} for ${description}`, () => {
        vi.setSystemTime(new Date(referenceDate));
        expect(isLessThanTwoWeeksAgo(targetDate)).toBe(expectedResult);
    });

describe("isNotMoreThanTwoWeeksAgo", () => {
    beforeAll(() => vi.useFakeTimers());
    afterAll(() => vi.useRealTimers());
    expectResult("2024-01-14", "2023-12-27", false, "a date 18 days before the reference date");
    expectResult("2024-01-20", "2024-01-04", false, "a date 16 days before the reference date in the same month");
    expectResult("2024-01-14", "2023-12-29", false, "a date 16 days before the reference date across months");
    expectResult("2024-01-20", "2024-01-05", true, "a date 15 days before the reference date in the same month");
    expectResult("2024-01-14", "2023-12-30", true, "a date 15 days before the reference date across months");
    expectResult("2024-01-14", "2023-12-31", true, "a date 14 days before the reference date");
    expectResult("2024-01-14", "2024-01-14", true, "the reference date itself");
    expectResult("2024-01-14", "2024-01-28", true, "a date 14 days after the reference date");
    expectResult("2024-01-14", "2024-01-29", true, "a date 15 days after the reference date");
    expectResult("2024-01-14", "2024-01-30", false, "a date 16 days after the reference date");
    expectResult("2024-01-14", "2024-02-02", false, "a date 18 days after the reference date");
    expectResult("2024-01-14", "", false, "an undefined date");
});
