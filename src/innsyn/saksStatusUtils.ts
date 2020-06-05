import {KommuneResponse} from "../redux/innsynsdata/innsynsdataReducer";
import {REST_STATUS} from "../utils/restUtils";

const kommunenummerBergen = "4601";

export function isKommuneInfoFetched(kommuneRestStatus: REST_STATUS): boolean {
    return kommuneRestStatus !== REST_STATUS.INITIALISERT && kommuneRestStatus !== REST_STATUS.PENDING;
}

export function isKommuneInfoFeilet(kommuneRestStatus: REST_STATUS): boolean {
    return (
        kommuneRestStatus === REST_STATUS.FEILET ||
        kommuneRestStatus === REST_STATUS.UNAUTHORIZED ||
        kommuneRestStatus === REST_STATUS.SERVICE_UNAVAILABLE
    );
}

export function isKommuneBergen(kommuneResponse: KommuneResponse | undefined): boolean {
    return kommuneResponse != null && kommuneResponse.kommunenummer === kommunenummerBergen;
}

export function isKommuneMedInnsynUtenBergen(
    kommuneResponse: KommuneResponse | undefined,
    kommuneRestStatus: REST_STATUS
): boolean {
    return (
        kommuneResponse != null &&
        !kommuneResponse.erInnsynDeaktivert &&
        !isKommuneBergen(kommuneResponse) &&
        kommuneRestStatus === REST_STATUS.OK
    );
}

export function isKommuneUtenInnsynUtenBergen(
    kommuneResponse: KommuneResponse | undefined,
    kommuneRestStatus: REST_STATUS
): boolean {
    return (
        (kommuneResponse == null || kommuneResponse.erInnsynDeaktivert || isKommuneInfoFeilet(kommuneRestStatus)) &&
        !isKommuneBergen(kommuneResponse) &&
        isKommuneInfoFetched(kommuneRestStatus)
    );
}
