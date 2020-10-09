import * as React from "react";
import {useEffect, useState} from "react";
import {Innholdstittel, Normaltekst} from "nav-frontend-typografi";
import "./Tilgangskontrollside.less";
import {useDispatch, useSelector} from "react-redux";
import Panel from "nav-frontend-paneler";
import {InnsynAppState} from "../../redux/reduxTypes";
import Brodsmulesti from "../brodsmuleSti/BrodsmuleSti";
import EllaBlunk from "../ellaBlunk";
import {fetchToJson, HttpStatus, REST_STATUS} from "../../utils/restUtils";
import {skalViseFeilside} from "../../redux/innsynsdata/innsynsdataReducer";
import {logErrorMessage, logInfoMessage} from "../../redux/innsynsdata/loggActions";
import NavFrontendSpinner from "nav-frontend-spinner";
import BigBanner from "../banner/BigBanner";

export interface TilgangskontrollsideProps {
    children: React.ReactNode;
}

const Tilgangskontrollside: React.FC<TilgangskontrollsideProps> = ({children}) => {
    const restkallHarGittForbidden = useSelector((state: InnsynAppState) => state.innsynsdata.skalViseForbudtSide);
    const [tilgang, setTilgang] = useState(!restkallHarGittForbidden);
    const [fornavn, setFornavn] = useState("");
    const [restStatus, setRestStatus] = useState(REST_STATUS.INITIALISERT);

    const dispatch = useDispatch();

    useEffect(() => {
        setRestStatus(REST_STATUS.PENDING);
        fetchToJson("/innsyn/tilgang")
            .then((response: any) => {
                setTilgang(response.harTilgang);
                setFornavn(response.fornavn);
                setRestStatus(REST_STATUS.OK);
            })
            .catch((reason) => {
                if (reason.message === HttpStatus.UNAUTHORIZED) {
                    setRestStatus(REST_STATUS.UNAUTHORIZED);
                } else {
                    setRestStatus(REST_STATUS.FEILET);
                    logErrorMessage(reason.message, reason.navCallId);
                    dispatch(skalViseFeilside(true));
                }
            });
    }, [dispatch]);

    const leserData = restStatus === REST_STATUS.INITIALISERT || restStatus === REST_STATUS.PENDING;
    const mustLogin = restStatus === REST_STATUS.UNAUTHORIZED;

    if (leserData || mustLogin) {
        return (
            <div className="informasjon-side">
                <BigBanner tittel="Økonomisk sosialhjelp" />
                <div className="application-spinner">
                    <NavFrontendSpinner type="XL" />
                </div>
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
                            <Panel className="panel-uthevet panel-uthevet-luft-under panel-glippe-over">
                                <div className="ellablunk-rad">
                                    <EllaBlunk size={"175"} />
                                </div>
                                <Innholdstittel>Hei {fornavn}</Innholdstittel>
                                <br />
                                <Normaltekst>
                                    Du kan dessverre ikke bruke den digitale søknaden om økonomisk sosialhjelp. Ta
                                    kontakt med ditt lokale NAV-kontor for å få hjelp til å søke.
                                </Normaltekst>
                            </Panel>
                        </div>
                    </div>
                </div>
            );
        }

        return <>{children}</>;
    }
};

export default Tilgangskontrollside;
