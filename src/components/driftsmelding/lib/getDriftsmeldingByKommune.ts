import { KommuneResponse } from "../../../generated/model";

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

type KommuneDriftstatus = `ettersendelseNede: ${boolean}, innsynNede: ${boolean}`;

const DRIFTSMELDINGER: Record<KommuneDriftstatus, KommuneDriftsmeldingError | undefined> = {
    "ettersendelseNede: true, innsynNede: true": mldInnsynOgEttersendelseDeaktivert,
    "ettersendelseNede: true, innsynNede: false": mldEttersendelseDeaktivert,
    "ettersendelseNede: false, innsynNede: true": mldInnsynDeaktivert,
    "ettersendelseNede: false, innsynNede: false": undefined,
} as const;

const getDriftsstatus = (kommuneResponse: KommuneResponse): KommuneDriftstatus =>
    `ettersendelseNede: ${ettersendelseDeaktivert(kommuneResponse)}, innsynNede: ${innsynDeaktivert(kommuneResponse)}`;

export const getDriftsmeldingByKommune = (
    kommuneResponse: KommuneResponse | undefined
): KommuneDriftsmeldingError | undefined =>
    kommuneResponse ? DRIFTSMELDINGER[getDriftsstatus(kommuneResponse)] : undefined;
