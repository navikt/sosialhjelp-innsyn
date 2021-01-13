import React, {useEffect} from "react";
import {Element, EtikettLiten} from "nav-frontend-typografi";
import {LenkepanelBase} from "nav-frontend-lenkepanel/lib";
import {EtikettFokus} from "nav-frontend-etiketter";
import DatoOgKlokkeslett from "../../components/tidspunkt/DatoOgKlokkeslett";
import DocumentIcon from "../../components/ikoner/DocumentIcon";
import "./sakpanel.less";
import {FormattedMessage} from "react-intl";
import {useDispatch} from "react-redux";
import {push} from "connected-react-router";
import Lastestriper from "../../components/lastestriper/Lasterstriper";
import {hentSaksdetaljer} from "../../redux/innsynsdata/innsynsDataActions";

interface Props {
    fiksDigisosId: string;
    tittel: string;
    status: string;
    oppdatert: string;
    key: string;
    url: string;
    kilde: string;
    antallNyeOppgaver?: number;
    harBlittLastetInn?: boolean;
}

const SakPanel: React.FC<Props> = ({
    fiksDigisosId,
    tittel,
    status,
    oppdatert,
    url,
    kilde,
    antallNyeOppgaver,
    harBlittLastetInn,
}) => {
    const dispatch = useDispatch();

    let dispatchUrl = "/innsyn/" + fiksDigisosId + "/status";
    let hrefUrl = "/sosialhjelp" + dispatchUrl;
    if (fiksDigisosId === null || fiksDigisosId === undefined) {
        hrefUrl = url;
    }

    const onClick = (event: any) => {
        if (event.isDefaultPrevented() || event.metaKey || event.ctrlKey) {
            return;
        }
        if (kilde === "soknad-api") {
            window.location.href = url;
        } else if (kilde === "innsyn-api") {
            dispatch(push(dispatchUrl));
            event.preventDefault();
        } else {
            // do nothing?
        }
    };

    let underLasting = !harBlittLastetInn;
    let requestId = fiksDigisosId;
    if (fiksDigisosId === null) {
        underLasting = false;
        requestId = "";
    }

    useEffect(() => {
        if (kilde === "innsyn-api") {
            dispatch(hentSaksdetaljer(requestId, false));
        }
    }, [dispatch, requestId, kilde]);

    return (
        <LenkepanelBase onClick={onClick} className="panel-glippe-over sakspanel_lenkepanel_liste" href={hrefUrl}>
            <div className="sakpanel">
                <div className="sakpanel_text">
                    <DocumentIcon className="document_icon" />
                    <div className="sakpanel_innhold">
                        <div className="sakpanel_status">
                            {fiksDigisosId !== null && !underLasting && (
                                <EtikettLiten>
                                    {status} ● oppdatert <DatoOgKlokkeslett tidspunkt={oppdatert} bareDato={true} />
                                </EtikettLiten>
                            )}
                            {fiksDigisosId !== null && underLasting && (
                                <div className="sakspanel_status_laster">
                                    <Lastestriper linjer={1} />
                                    <EtikettLiten>
                                        ● oppdatert <DatoOgKlokkeslett tidspunkt={oppdatert} bareDato={true} />
                                    </EtikettLiten>
                                </div>
                            )}
                            {fiksDigisosId === null && (
                                <EtikettLiten>
                                    SENDT <DatoOgKlokkeslett tidspunkt={oppdatert} bareDato={true} />
                                </EtikettLiten>
                            )}
                        </div>
                        {underLasting && <Lastestriper linjer={1} />}
                        {!underLasting && <Element className="lenkepanel__heading">{tittel}</Element>}
                    </div>
                </div>
                <div className="sakpanel_innhold_etikett">
                    {!underLasting && antallNyeOppgaver !== undefined && antallNyeOppgaver >= 1 && (
                        <EtikettFokus>
                            <FormattedMessage id="saker.oppgave" values={{antall: antallNyeOppgaver}} />
                        </EtikettFokus>
                    )}
                </div>
            </div>
        </LenkepanelBase>
    );
};

export default SakPanel;
