import {KommuneResponse} from "../redux/innsynsdata/innsynsdataReducer";
import {SoknadsStatusEnum} from "../components/soknadsStatus/soknadsStatusUtils";

export function isKommuneMedInnsyn(kommuneResponse: KommuneResponse | undefined, soknadStatus: string | null): boolean {
    return (
        kommuneResponse != null &&
        !kommuneResponse.erInnsynDeaktivert &&
        soknadStatus != null &&
        soknadStatus !== SoknadsStatusEnum.SENDT
    );
}

export function isKommuneUtenInnsyn(kommuneResponse: KommuneResponse | undefined): boolean {
    return kommuneResponse != null && kommuneResponse.erInnsynDeaktivert;
}
