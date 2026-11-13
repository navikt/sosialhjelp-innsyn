import { TZDate } from "@date-fns/tz";
import { addDays, isBefore, startOfDay } from "date-fns";

const KLAGE_ETTERSENDELSE_FRIST_DOGN = 21;

const TIDSSONE = "Europe/Oslo";

export const erEttersendelsesfristUtlopt = (timestampSendt: number, now = Date.now()): boolean => {
    const frist = addDays(startOfDay(new TZDate(timestampSendt, TIDSSONE)), KLAGE_ETTERSENDELSE_FRIST_DOGN + 1);
    return !isBefore(now, frist);
};
