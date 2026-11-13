import { describe, expect, it } from "vitest";
import { erEttersendelsesfristUtlopt } from "./klageFrist";

describe("ettersendelsesfristen for klage", () => {
    it("utløper ved midnatt etter den 21. dagen i norsk tid", () => {
        const sendt = Date.parse("2025-11-01T13:00:00Z");

        expect(erEttersendelsesfristUtlopt(sendt, Date.parse("2025-11-22T22:59:59.999Z"))).toBe(false);
        expect(erEttersendelsesfristUtlopt(sendt, Date.parse("2025-11-22T23:00:00Z"))).toBe(true);
    });

    it("bruker norsk dato når klagen sendes rett etter midnatt", () => {
        const sendt = Date.parse("2025-11-01T23:30:00Z");

        expect(erEttersendelsesfristUtlopt(sendt, Date.parse("2025-11-23T22:59:59.999Z"))).toBe(false);
        expect(erEttersendelsesfristUtlopt(sendt, Date.parse("2025-11-23T23:00:00Z"))).toBe(true);
    });

    it.each([
        ["sommertid", "2025-03-10T12:00:00Z", "2025-03-31T21:59:59.999Z", "2025-03-31T22:00:00Z"],
        ["vintertid", "2025-10-10T12:00:00Z", "2025-10-31T22:59:59.999Z", "2025-10-31T23:00:00Z"],
    ])("følger midnatt i norsk tid ved overgang til %s", (_overgang, sendt, sisteTidspunkt, frist) => {
        expect(erEttersendelsesfristUtlopt(Date.parse(sendt), Date.parse(sisteTidspunkt))).toBe(false);
        expect(erEttersendelsesfristUtlopt(Date.parse(sendt), Date.parse(frist))).toBe(true);
    });
});
