import * as React from "react";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import EllaBlunk from "../ellaBlunk";
import {fetchToJson, HttpErrorType, REST_STATUS} from "../../utils/restUtils";
import {Feilside, InnsynsdataActionTypeKeys, visFeilside} from "../../redux/innsynsdata/innsynsdataReducer";
import {logInfoMessage, logWarningMessage} from "../../redux/innsynsdata/loggActions";
import {ApplicationSpinner} from "../applicationSpinner/ApplicationSpinner";
import {BodyLong, Heading} from "@navikt/ds-react";
import {UthevetPanel} from "../paneler/UthevetPanel";
import {setBreadcrumbs} from "../../utils/breadcrumbs";
import {InnsynAppState} from "../../redux/reduxTypes";
import styled from "styled-components";
import Banner from "../banner/Banner";

const StyledElla = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Wrapper = styled.div`
    margin-top: 2rem;
`;
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
        if (restkallHarGittForbidden || !tilgang) {
            setBreadcrumbs();
        }
    }, [restkallHarGittForbidden, tilgang]);

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
                <Banner>Økonomisk sosialhjelp</Banner>

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
                    <Banner>Økonomisk sosialhjelp</Banner>

                    <Wrapper className={"blokk-center"}>
                        <UthevetPanel className="panel-glippe-over">
                            <StyledElla>
                                <EllaBlunk size={"175"} />
                            </StyledElla>
                            <Heading as="p" size="large" spacing>
                                Hei {fornavn}
                            </Heading>
                            <BodyLong spacing>
                                Du kan dessverre ikke bruke den digitale søknaden om økonomisk sosialhjelp. Ta kontakt
                                med ditt lokale NAV-kontor for å få hjelp til å søke.
                            </BodyLong>
                        </UthevetPanel>
                    </Wrapper>
                </div>
            );
        }

        return <>{children}</>;
    }
};

export default Tilgangskontrollside;
