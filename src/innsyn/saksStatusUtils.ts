import {KommuneResponse, SoknadsStatusResponseStatus} from "../generated/model";

export function isKommuneMedInnsyn(kommuneResponse: KommuneResponse | undefined, soknadStatus: string | null): boolean {
    return (
        kommuneResponse != null &&
        !kommuneResponse.erInnsynDeaktivert &&
        soknadStatus != null &&
        soknadStatus !== SoknadsStatusResponseStatus.SENDT
    );
}

export function isKommuneUtenInnsyn(kommuneResponse: KommuneResponse | undefined): boolean {
    return kommuneResponse != null && kommuneResponse.erInnsynDeaktivert;
}
