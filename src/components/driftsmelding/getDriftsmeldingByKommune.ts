import { KommuneResponse } from "../../generated/model";

const mldInnsynOgEttersendelseDeaktivert = "driftsmelding.innsynOgEttersendelseDeaktivert" as const;
const mldEttersendelseDeaktivert = "driftsmelding.ettersendelseDeaktivert" as const;
const mldInnsynDeaktivert = "driftsmelding.innsynDeaktivert" as const;

type KommuneDriftsmeldingError =
    | typeof mldInnsynOgEttersendelseDeaktivert
    | typeof mldEttersendelseDeaktivert
    | typeof mldInnsynDeaktivert;

// Man skulle trodd at erInnsynDeaktivert skulle telle her, men enhetstestene tester faktisk at denne skal returnere false selv om erInnsynDeaktivert er true.
const innsynDeaktivert = ({ erInnsynMidlertidigDeaktivert }: KommuneResponse) => erInnsynMidlertidigDeaktivert;

const ettersendelseDeaktivert = ({
    erInnsendingEttersendelseDeaktivert,
    erInnsendingEttersendelseMidlertidigDeaktivert,
}: KommuneResponse) => erInnsendingEttersendelseMidlertidigDeaktivert || erInnsendingEttersendelseDeaktivert;

const getDriftsstatus = (kommuneResponse: KommuneResponse): "both" | "innsyn" | "ettersendelse" | undefined => {
    if (ettersendelseDeaktivert(kommuneResponse) && innsynDeaktivert(kommuneResponse)) return "both";
    if (innsynDeaktivert(kommuneResponse)) return "innsyn";
    if (ettersendelseDeaktivert(kommuneResponse)) return "ettersendelse";
};

export const getDriftsmeldingByKommune = (
    kommuneResponse: KommuneResponse | undefined
): KommuneDriftsmeldingError | undefined => {
    if (!kommuneResponse) return undefined;

    const status = getDriftsstatus(kommuneResponse);

    switch (status) {
        case "both":
            return mldInnsynOgEttersendelseDeaktivert;
        case "ettersendelse":
            return mldEttersendelseDeaktivert;
        case "innsyn":
            return mldInnsynDeaktivert;
    }
};
