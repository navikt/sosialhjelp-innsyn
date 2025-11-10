import { Option } from "../_types/types";

export const options = ["kommende", "siste3", "hittil", "fjor", "egendefinert"] as const satisfies readonly Option[];

export const maxMonthsEgendefinert = 15;
