import { ManedUtbetaling } from "../../../generated/model";

import { filterMatch } from "./useFiltrerteUtbetalinger";
import { MottakerFilter } from "./FilterContext";

describe("filtrering på utbetalinger fungerer", () => {
    it("skal filtrere dato på fom og tom", () => {
        const utbetaling: ManedUtbetaling = {
            utbetalingsdato: "2023-04-12",
            status: "UTBETALT",
            annenMottaker: false,
            tittel: "",
            belop: 0,
            fiksDigisosId: "",
        };

        const filterFra = {
            mottaker: MottakerFilter.Alle,
            fraDato: new Date(2023, 3, 12),
            tilDato: undefined,
        };
        const filterFraSenere = {
            mottaker: MottakerFilter.Alle,
            fraDato: new Date(2023, 3, 20),
            tilDato: undefined,
        };
        const filterTil = {
            mottaker: MottakerFilter.Alle,
            fraDato: undefined,
            tilDato: new Date(2023, 3, 12),
        };
        const filterTilTidligere = {
            mottaker: MottakerFilter.Alle,
            fraDato: undefined,
            tilDato: new Date(2023, 3, 10),
        };

        expect(filterMatch(utbetaling, filterFra)).toBeTruthy();
        expect(filterMatch(utbetaling, filterTil)).toBeTruthy();
        expect(filterMatch(utbetaling, filterFraSenere)).toBeFalsy();
        expect(filterMatch(utbetaling, filterTilTidligere)).toBeFalsy();
    });

    it("skal filtrere mottaker", () => {
        const utbetalingAnnen: ManedUtbetaling = {
            utbetalingsdato: "2023-04-12",
            status: "UTBETALT",
            annenMottaker: true,
            tittel: "tilAnnen",
            belop: 0,
            fiksDigisosId: "",
        };

        const utbetalingMeg: ManedUtbetaling = {
            utbetalingsdato: "2023-04-12",
            status: "UTBETALT",
            annenMottaker: false,
            tittel: "tilMeg",
            belop: 0,
            fiksDigisosId: "",
        };

        const filterMeg = {
            mottaker: MottakerFilter.MinKonto,
            fraDato: undefined,
            tilDato: undefined,
        };
        const filterAnnen = {
            mottaker: MottakerFilter.AnnenMottaker,
            fraDato: undefined,
            tilDato: new Date(2023, 3, 12),
        };
        expect(filterMatch(utbetalingAnnen, filterAnnen)).toBeTruthy();
        expect(filterMatch(utbetalingAnnen, filterMeg)).toBeFalsy();
        expect(filterMatch(utbetalingMeg, filterMeg)).toBeTruthy();
        expect(filterMatch(utbetalingMeg, filterAnnen)).toBeFalsy();
    });
});
