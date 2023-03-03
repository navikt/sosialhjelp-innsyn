import {SoknadsStatusEnum} from "../components/soknadsStatus/soknadsStatusUtils";
import {KommuneResponse} from "../generated/model";

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
