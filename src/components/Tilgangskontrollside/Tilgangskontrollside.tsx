import * as React from "react";
import {useEffect, useState} from "react";
import "./Tilgangskontrollside.less";
import {useDispatch, useSelector} from "react-redux";
import {InnsynAppState} from "../../redux/reduxTypes";
import Brodsmulesti from "../brodsmuleSti/BrodsmuleSti";
import EllaBlunk from "../ellaBlunk";
import {fetchToJson, HttpErrorType, REST_STATUS} from "../../utils/restUtils";
import {Feilside, InnsynsdataActionTypeKeys, visFeilside} from "../../redux/innsynsdata/innsynsdataReducer";
import {logInfoMessage, logWarningMessage} from "../../redux/innsynsdata/loggActions";
import BigBanner from "../banner/BigBanner";
import {ApplicationSpinner} from "../applicationSpinner/ApplicationSpinner";
import {BodyShort, Heading} from "@navikt/ds-react";
import {UthevetPanel} from "../paneler/UthevetPanel";

export interface TilgangskontrollsideProps {
    children: React.ReactNode;
}

const Tilgangskontrollside: React.FC<TilgangskontrollsideProps> = ({children}) => {
    const restkallHarGittForbidden =
        useSelector((state: InnsynAppState) => state.innsynsdata.feilside) === Feilside.IKKE_TILGANG;
    const fornavn = useSelector((state: InnsynAppState) => state.innsynsdata.fornavn);
    const [tilgang, setTilgang] = useState(!restkallHarGittForbidden);
    const [restStatus, setRestStatus] = useState(REST_STATUS.INITIALISERT);

    const dispatch = useDispatch();

    useEffect(() => {
        setRestStatus(REST_STATUS.PENDING);
        fetchToJson("/innsyn/tilgang")
            .then((response: any) => {
                setTilgang(response.harTilgang);
                dispatch({
                    type: InnsynsdataActionTypeKeys.SETT_FORNAVN,
                    fornavn: response.fornavn,
                });

                setRestStatus(REST_STATUS.OK);
            })
            .catch((reason) => {
                if (reason.message === HttpErrorType.UNAUTHORIZED) {
                    setRestStatus(REST_STATUS.UNAUTHORIZED);
                } else {
                    setRestStatus(REST_STATUS.FEILET);
                    logWarningMessage(reason.message, reason.navCallId);
                    dispatch(visFeilside(Feilside.TEKNISKE_PROBLEMER));
                }
            });
    }, [dispatch]);

    const leserData = restStatus === REST_STATUS.INITIALISERT || restStatus === REST_STATUS.PENDING;
    const mustLogin = restStatus === REST_STATUS.UNAUTHORIZED;

    if (leserData || mustLogin) {
        return (
            <div className="informasjon-side">
                <BigBanner tittel="Økonomisk sosialhjelp" />
                <ApplicationSpinner />
            </div>
        );
    } else {
        if (restkallHarGittForbidden || !tilgang) {
            fornavn === ""
                ? logInfoMessage("Viser tilgangskontrollside uten fornavn")
                : logInfoMessage("Viser tilgangskontrollside med fornavn");

            return (
                <div className="informasjon-side">
                    <BigBanner tittel="Økonomisk sosialhjelp" />
                    <div className={"blokk-center"}>
                        <Brodsmulesti tittel="Innsyn" foreldreside={{tittel: "Økonomisk sosialhjelp", path: "/"}} />
                        <div className="tilgangskontroll">
                            <UthevetPanel className="panel-uthevet-luft-under panel-glippe-over">
                                <div className="ellablunk-rad">
                                    <EllaBlunk size={"175"} />
                                </div>
                                <Heading level="1" size="xlarge" spacing className="blokk-xs">
                                    Hei {fornavn}
                                </Heading>
                                <BodyShort spacing>
                                    Du kan dessverre ikke bruke den digitale søknaden om økonomisk sosialhjelp. Ta
                                    kontakt med ditt lokale NAV-kontor for å få hjelp til å søke.
                                </BodyShort>
                            </UthevetPanel>
                        </div>
                    </div>
                </div>
            );
        }

        return <>{children}</>;
    }
};

export default Tilgangskontrollside;
