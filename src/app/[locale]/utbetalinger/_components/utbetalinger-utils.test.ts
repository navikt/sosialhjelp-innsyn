/*import { vi, expect, describe, it } from "vitest";
import {
    kombinertManed,
    datoIntervall,
    utbetalingInnenforValgtDatoIntervall,
    erInnenforAngittPeriode,
} from "./utbetalinger-utils";


  utbetalingerForManed: ManedUtbetaling[];
  ar: number;
  maned: number;

  tittel: string;
  belop: number;
  utbetalingsdato?: string;
  forfallsdato?: string;
  status: ManedUtbetalingStatus;
  fiksDigisosId: string;
  fom?: string;
  tom?: string;
  mottaker?: string;
  annenMottaker: boolean;
  // @pattern ^[0-9]{11}$
kontonummer?: string;
utbetalingsmetode?: string;

  PLANLAGT_UTBETALING: 'PLANLAGT_UTBETALING',
  UTBETALT: 'UTBETALT',
  STOPPET: 'STOPPET',
  ANNULLERT: 'ANNULLERT',






I created this test as a start:
-------------------- utbetalinger-utils.test.ts - START --------------------
import { expect, describe, it } from "vitest";
import { kombinertManed } from "./utbetalinger-utils";

describe("kombinertManed", () => {
    it("returnerer en liste av utbetalinger etter alle månedene ble kombinert", () => {
        const nye = [
            {
                ar: 2025,
                maned: 10,
                utbetalingerForManed: [
                    {
                        tittel: "halloen",
                        belop: 1000,
                        utbetalingsdato: "2025-9-19",
                        forfallsdato: "2025-9-18",
                        status: "PLANLAGT_UTBETALING",
                        fiksDigisosId: "id1",
                        fom: "2025-9-01",
                        tom: "2025-9-30",
                        mottaker: "meg",
                        annenMottaker: false,
                        kontonummer: "12345678901",
                        utbetalingsmetode: "BANKKONTO",
                    },
                ],
            },
        ];
        const tidligere = [
            {
                ar: 2025,
                maned: 8,
                utbetalingForManed: [
                    {
                        tittel: "neinei",
                        belop: 2000,
                        utbetalingsdato: "2025-8-19",
                        forfallsdato: "2025-8-18",
                        status: "PLANLAGT_UTBETALING",
                        fiksDigisosId: "id1",
                        fom: "2025-8-01",
                        tom: "2025-8-30",
                        mottaker: "meg",
                        annenMottaker: false,
                        kontonummer: "12345678901",
                        utbetalingsmetode: "BANKKONTO",
                    },
                ],
            },
        ];

        const result = kombinertManed(nye, tidligere);
        expect(result).toEqual([
            {
                ar: 2025,
                maned: 10,
                utbetalingerForManed: [
                    {
                        tittel: "halloen",
                        belop: 1000,
                        utbetalingsdato: "2025-9-19",
                        forfallsdato: "2025-9-18",
                        status: "PLANLAGT_UTBETALING",
                        fiksDigisosId: "id1",
                        fom: "2025-9-01",
                        tom: "2025-9-30",
                        mottaker: "meg",
                        annenMottaker: false,
                        kontonummer: "12345678901",
                        utbetalingsmetode: "BANKKONTO",
                    },
                ],
                ar: 2025,
                maned: 8,
                utbetalingForManed: [
                    {
                        tittel: "neinei",
                        belop: 2000,
                        utbetalingsdato: "2025-8-19",
                        forfallsdato: "2025-8-18",
                        status: "PLANLAGT_UTBETALING",
                        fiksDigisosId: "id1",
                        fom: "2025-8-01",
                        tom: "2025-8-30",
                        mottaker: "meg",
                        annenMottaker: false,
                        kontonummer: "12345678901",
                        utbetalingsmetode: "BANKKONTO",
                    },
                ],
            },
        ]);
    });
});
-------------------- utbetalinger-utils.test.ts - END --------------------









describe("kombinertManed", () => {
    it("returnerer en liste av utbetalinger etter alle månedene ble kombinert", () => {
        const nye = [
            {
                ar: 2025,
                maned: 10,
                utbetalingerForManed: [
                    {
                        tittel: "halloen",
                        belop: 1000,
                        utbetalingsdato: "2025-9-19",
                        forfallsdato: "2025-9-18",
                        status: "PLANLAGT_UTBETALING",
                        fiksDigisosId: "id1",
                        fom: "2025-9-01",
                        tom: "2025-9-30",
                        mottaker: "meg",
                        annenMottaker: false,
                        kontonummer: "12345678901",
                        utbetalingsmetode: "BANKKONTO",
                    },
                ],
            },
        ];
        const tidligere = [
            {
                ar: 2025,
                maned: 8,
                utbetalingForManed: [
                    {
                        tittel: "neinei",
                        belop: 2000,
                        utbetalingsdato: "2025-8-19",
                        forfallsdato: "2025-8-18",
                        status: "PLANLAGT_UTBETALING",
                        fiksDigisosId: "id1",
                        fom: "2025-8-01",
                        tom: "2025-8-30",
                        mottaker: "meg",
                        annenMottaker: false,
                        kontonummer: "12345678901",
                        utbetalingsmetode: "BANKKONTO",
                    },
                ],
            },
        ];

        const result = kombinertManed(nye, tidligere);
        expect(result).toEqual([
            {
                ar: 2025,
                maned: 10,
                utbetalingerForManed: [
                    {
                        tittel: "halloen",
                        belop: 1000,
                        utbetalingsdato: "2025-9-19",
                        forfallsdato: "2025-9-18",
                        status: "PLANLAGT_UTBETALING",
                        fiksDigisosId: "id1",
                        fom: "2025-9-01",
                        tom: "2025-9-30",
                        mottaker: "meg",
                        annenMottaker: false,
                        kontonummer: "12345678901",
                        utbetalingsmetode: "BANKKONTO",
                    },
                ],
                ar: 2025,
                maned: 8,
                utbetalingForManed: [
                    {
                        tittel: "neinei",
                        belop: 2000,
                        utbetalingsdato: "2025-8-19",
                        forfallsdato: "2025-8-18",
                        status: "PLANLAGT_UTBETALING",
                        fiksDigisosId: "id1",
                        fom: "2025-8-01",
                        tom: "2025-8-30",
                        mottaker: "meg",
                        annenMottaker: false,
                        kontonummer: "12345678901",
                        utbetalingsmetode: "BANKKONTO",
                    },
                ],
            },
        ]);
    });
});
*/
