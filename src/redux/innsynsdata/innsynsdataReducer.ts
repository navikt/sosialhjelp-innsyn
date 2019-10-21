import {Reducer} from "redux";
import {setPath} from "../../utils/setPath";
import {REST_STATUS} from "../../utils/restUtils";

export enum Utfall {
    INNVILGET = "INNVILGET",
    DELVIS_INNVILGET = "DELVIS_INNVILGET",
    AVSLATT = "AVSLATT",
    AVVIST = "AVVIST",
    FERDIG_BEHANDLET = "FERDIG_BEHANDLET",
    KAN_IKKE_VISES = "KAN_IKKE_VISES"
}

export interface Vedtaksfil {
    tidspunkt: string;
    beskrivelse: string;
    filUrl: null|string;
}

export interface Utbetaling {
    tidspunkt: string;
    beskrivelse: string;
    belop: number;
}

export interface SaksStatusState {
    tittel: string;
    status: Utfall;
    vedtaksfiler: Vedtaksfil[];
    melding?: string;
}

export interface Sakstype {
    fiksDigisosId: string;
    soknadTittel: string;
    status: string;
    sistOppdatert: string;
    antallNyeOppgaver: number;
    kilde: string;
}

export interface Vedlegg {
    storrelse: number;
    url: string;
    type: string;
    tilleggsinfo: string;
    datoLagtTil: string;
    filnavn: string;
}

export interface Fil {
    filnavn: string;
    file: File;
    status?: string;
}

export interface Oppgave {
    innsendelsesfrist?: string;
    dokumenttype: string;
    tilleggsinformasjon?: string;
    erFraInnsyn: boolean;
    vedlegg?: Vedlegg[];
    filer?: Fil[];
}

export enum InnsynsdataActionTypeKeys {
    // Innsynsdata:
    OPPDATER_INNSYNSSDATA_STI = "innsynsdata/OPPDATER_STI",
    SETT_REST_STATUS = "innsynsdata/SETT_REST_STATUS",

    // Vedlegg:
    LEGG_TIL_FIL_FOR_OPPLASTING = "innsynsdata/LEGG_TIL_FILE_FOR_OPPLASTING",
    FJERN_FIL_FOR_OPPLASTING = "innsynsdata/FJERN_FIL_FOR_OPPLASTING",
    SETT_STATUS_FOR_FIL = "innsynsdata/SETT_STATUS_FOR_FIL"
}

export enum InnsynsdataSti {
    SAKSSTATUS = "saksStatus",
    OPPGAVER = "oppgaver",
    SOKNADS_STATUS = "soknadsStatus",
    HENDELSER = "hendelser",
    VEDLEGG = "vedlegg",
    SEND_VEDLEGG = "vedlegg/send",
    SAKER = "saker"
}

// export interface InnsynssdataActionVerdi {
//     saksStatus?: SaksStatusState;
// }

export interface InnsynsdataActionType {
    type: InnsynsdataActionTypeKeys,
    verdi?: any,
    sti: InnsynsdataSti,
    restStatus?: string
}

export interface VedleggActionType {
    type: InnsynsdataActionTypeKeys,
    fil?: File;
    filnavn?: string;
    oppgave: Oppgave;
    status?: string;
}

export interface Status {
    status: string|null;
}

export interface Hendelse {
    tidspunkt: string;
    beskrivelse: string;
    filUrl: null|string;
}

export interface InnsynsdataType {
    saksStatus: SaksStatusState[];
    oppgaver: Oppgave[];
    restStatus: any;
    soknadsStatus: Status;
    hendelser: Hendelse[];
    vedlegg: Vedlegg[];
    saker: Sakstype[];
}

export const initialInnsynsdataRestStatus = {
    saksStatus: REST_STATUS.INITIALISERT,
    oppgaver: REST_STATUS.INITIALISERT,
    soknadsStatus: REST_STATUS.INITIALISERT,
    hendelser: REST_STATUS.INITIALISERT,
    vedlegg: REST_STATUS.INITIALISERT,
    utbetalinger: REST_STATUS.INITIALISERT,
    saker: REST_STATUS.INITIALISERT
};

const initialState: InnsynsdataType = {
    saksStatus: [],
    oppgaver: [],
    soknadsStatus: {
        status: null
    },
    hendelser: [],
    vedlegg: [],
    saker: [],
    restStatus: initialInnsynsdataRestStatus
};

const InnsynsdataReducer: Reducer<InnsynsdataType, InnsynsdataActionType & VedleggActionType> = (state = initialState, action) => {
    switch (action.type) {
        case InnsynsdataActionTypeKeys.OPPDATER_INNSYNSSDATA_STI:
            return {
                ...setPath(state, action.sti, action.verdi)
            };
        case InnsynsdataActionTypeKeys.SETT_REST_STATUS:
            return {
                ...setPath(state, "restStatus/" + action.sti, action.restStatus)
            };
        case InnsynsdataActionTypeKeys.LEGG_TIL_FIL_FOR_OPPLASTING:
            return  {
                ...state,
                oppgaver: state.oppgaver.map((item) => {
                    if (item.dokumenttype === action.oppgave.dokumenttype) {
                        return {
                            ...item,
                            filer: [...(item.filer ? item.filer : []), action.fil]
                        }
                    }
                    return item;
                })
            };
        case InnsynsdataActionTypeKeys.FJERN_FIL_FOR_OPPLASTING:
            return  {
                ...state,
                oppgaver: state.oppgaver.map((oppgave) => {
                    if (oppgave.dokumenttype === action.oppgave.dokumenttype) {
                        return {
                            ...oppgave,
                            filer: (oppgave.filer && oppgave.filer.filter((fil: Fil, index: number) => {
                                if (action.fil && fil.filnavn === action.fil.name) {
                                    return false;
                                }
                                return true;
                            }))
                        }
                    }
                    return oppgave;
                })
            };
        case InnsynsdataActionTypeKeys.SETT_STATUS_FOR_FIL:
            return  {
                ...state,
                oppgaver: state.oppgaver.map((oppgave) => {
                    return {
                        ...oppgave,
                        filer: (oppgave.filer && oppgave.filer.map((fil: Fil) => {
                            if (fil.filnavn === action.filnavn) {
                                return {
                                    ...fil,
                                    status: action.status
                                };
                            }
                            return fil;
                        }))
                    }
                })
            };
        default:
            return state;
    }
};

export const oppdaterInnsynsdataState = (sti: InnsynsdataSti, verdi: any): InnsynsdataActionType => {
    return {
        type: InnsynsdataActionTypeKeys.OPPDATER_INNSYNSSDATA_STI,
        sti,
        verdi
    }
};

export const settRestStatus = (sti: InnsynsdataSti, restStatus: REST_STATUS): InnsynsdataActionType => {
    return {
        type: InnsynsdataActionTypeKeys.SETT_REST_STATUS,
        sti,
        restStatus
    }
};

export default InnsynsdataReducer;
