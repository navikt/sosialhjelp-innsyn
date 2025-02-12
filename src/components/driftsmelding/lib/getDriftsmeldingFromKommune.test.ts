import { KommuneResponse } from "../../../generated/model";

import { getDriftsmeldingFromKommune } from "./getDriftsmeldingFromKommune";

export const kommuneProblemer: Record<
    "ok" | "utenInnsyn" | "utenEttersendelse" | "utenBegge" | "littDiverse",
    KommuneResponse
> = {
    ok: {
        erInnsynDeaktivert: false,
        erInnsynMidlertidigDeaktivert: false,
        erInnsendingEttersendelseDeaktivert: false,
        erInnsendingEttersendelseMidlertidigDeaktivert: false,
        tidspunkt: new Date().toString(),
    },
    utenInnsyn: {
        erInnsynDeaktivert: true,
        erInnsynMidlertidigDeaktivert: true,
        erInnsendingEttersendelseDeaktivert: false,
        erInnsendingEttersendelseMidlertidigDeaktivert: false,
        tidspunkt: new Date().toString(),
    },
    utenEttersendelse: {
        erInnsynDeaktivert: false,
        erInnsynMidlertidigDeaktivert: false,
        erInnsendingEttersendelseDeaktivert: true,
        erInnsendingEttersendelseMidlertidigDeaktivert: true,
        tidspunkt: new Date().toString(),
    },
    utenBegge: {
        erInnsynDeaktivert: true,
        erInnsynMidlertidigDeaktivert: true,
        erInnsendingEttersendelseDeaktivert: true,
        erInnsendingEttersendelseMidlertidigDeaktivert: true,
        tidspunkt: new Date().toString(),
    },
    // Uklart hva som er formålet med denne.
    // "erInnsynDeaktivert" registerer rett nok ikke som at innsyn er deaktivert,
    // kun erInnsynMidlertidigDeaktivert.
    littDiverse: {
        erInnsynDeaktivert: true,
        erInnsynMidlertidigDeaktivert: false,
        erInnsendingEttersendelseDeaktivert: true,
        erInnsendingEttersendelseMidlertidigDeaktivert: false,
        tidspunkt: new Date().toString(),
    },
} as const;

describe("getDriftsmeldingByKommune", () => {
    it("viser driftsmelding for riktig kommune state", () => {
        const expectations: [keyof typeof kommuneProblemer, string | undefined][] = [
            ["ok", undefined],
            ["utenInnsyn", "driftsmelding.innsynDeaktivert"],
            ["utenEttersendelse", "driftsmelding.ettersendelseDeaktivert"],
            ["utenBegge", "driftsmelding.innsynOgEttersendelseDeaktivert"],
            ["littDiverse", "driftsmelding.ettersendelseDeaktivert"],
        ];

        for (const [key, expected] of expectations) {
            expect(getDriftsmeldingFromKommune(kommuneProblemer[key])).toEqual(expected);
        }
    });

    it("returnerer undefined om kommune er undefined", () => {
        expect(getDriftsmeldingFromKommune(undefined)).toEqual(undefined);
    });
});
