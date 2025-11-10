import { UtbetalingDto } from "@generated/model";

export type ManedMedUtbetalinger = {
    ar: number;
    maned: number;
    utbetalinger: UtbetalingDto[];
};

export type PeriodeChip = "siste3" | "hittil" | "fjor";

export type Option = "kommende" | "siste3" | "hittil" | "fjor" | "egendefinert";

export const options = ["kommende", "siste3", "hittil", "fjor", "egendefinert"] as const satisfies readonly Option[];
