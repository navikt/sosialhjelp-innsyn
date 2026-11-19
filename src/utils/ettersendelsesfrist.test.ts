import { describe, expect, it } from "vitest";
import { erEttersendelsesfristUtlopt, getEttersendelsesfrist } from "./ettersendelsesfrist";

describe("ettersendelsesfristen for klage", () => {
    it("beregner siste fristdag fra norsk dato når klagen sendes rett etter midnatt", () => {
        const sendt = Date.parse("2025-01-01T23:30:00Z");

        expect(getEttersendelsesfrist(sendt).getTime()).toBe(Date.parse("2025-04-01T22:00:00.000Z"));
    });

    it("beregner fristdagen i norsk tid ved overgang til sommertid", () => {
        const sendt = Date.parse("2024-12-30T12:00:00Z");

        expect(getEttersendelsesfrist(sendt).getTime()).toBe(Date.parse("2025-03-29T23:00:00.000Z"));
    });

    it("utløper ved midnatt etter den 90. dagen i norsk tid", () => {
        const sendt = Date.parse("2025-11-01T13:00:00Z");

        expect(erEttersendelsesfristUtlopt(sendt, Date.parse("2026-01-30T22:59:59.999Z"))).toBe(false);
        expect(erEttersendelsesfristUtlopt(sendt, Date.parse("2026-01-30T23:00:00Z"))).toBe(true);
    });

    it("bruker norsk dato når klagen sendes rett etter midnatt", () => {
        const sendt = Date.parse("2025-11-01T23:30:00Z");

        expect(erEttersendelsesfristUtlopt(sendt, Date.parse("2026-01-31T22:59:59.999Z"))).toBe(false);
        expect(erEttersendelsesfristUtlopt(sendt, Date.parse("2026-01-31T23:00:00Z"))).toBe(true);
    });

    it.each([
        ["sommertid", "2024-12-30T12:00:00Z", "2025-03-30T21:59:59.999Z", "2025-03-30T22:00:00Z"],
        ["vintertid", "2025-07-28T12:00:00Z", "2025-10-26T22:59:59.999Z", "2025-10-26T23:00:00Z"],
    ])("følger midnatt i norsk tid ved overgang til %s", (_overgang, sendt, sisteTidspunkt, frist) => {
        expect(erEttersendelsesfristUtlopt(Date.parse(sendt), Date.parse(sisteTidspunkt))).toBe(false);
        expect(erEttersendelsesfristUtlopt(Date.parse(sendt), Date.parse(frist))).toBe(true);
    });
});
