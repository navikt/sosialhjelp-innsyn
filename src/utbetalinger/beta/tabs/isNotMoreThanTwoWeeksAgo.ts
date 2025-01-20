import { differenceInCalendarDays } from "date-fns";

export const isNotMoreThanTwoWeeksAgo = (utbetalingsdato?: string) =>
    !utbetalingsdato ? false : Math.abs(differenceInCalendarDays(new Date(), utbetalingsdato)) <= 15;
