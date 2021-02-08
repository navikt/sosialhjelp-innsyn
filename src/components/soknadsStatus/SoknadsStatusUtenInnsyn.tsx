import React from "react";
import Panel from "nav-frontend-paneler";
import {Innholdstittel, Normaltekst} from "nav-frontend-typografi";
import "./soknadsStatus.less";
import {UrlResponse} from "../../redux/innsynsdata/innsynsdataReducer";
import EksternLenke from "../eksternLenke/EksternLenke";
import Lastestriper from "../lastestriper/Lasterstriper";

import {REST_STATUS, skalViseLastestripe} from "../../utils/restUtils";
import DokumentSendt from "../ikoner/DokumentSendt";
import DatoOgKlokkeslett from "../tidspunkt/DatoOgKlokkeslett";

const SoknadsStatusUtenInnsyn = (props: {
    restStatus: REST_STATUS;
    tidspunktSendt: string | null;
    navKontor: string | null;
    filUrl: UrlResponse | null;
}) => {
    return (
        <Panel className={"panel-uthevet"}>
            <div className="tittel_og_ikon">
                {skalViseLastestripe(props.restStatus) && <Lastestriper linjer={1} />}
                {props.restStatus !== REST_STATUS.FEILET && (
                    <>
                        <Innholdstittel>Søknaden er sendt</Innholdstittel>
                        <DokumentSendt />
                    </>
                )}
            </div>

            <div className="status_detalj_panel_info_alert_luft_under">
                {props.tidspunktSendt && props.navKontor && props.filUrl && (
                    <Normaltekst>
                        Sendt den{" "}
                        <DatoOgKlokkeslett bareDato={true} tidspunkt={props.tidspunktSendt} brukKortMaanedNavn={true} />
                        til {props.navKontor}{" "}
                        <EksternLenke href={props.filUrl.link}>{props.filUrl.linkTekst}</EksternLenke>
                    </Normaltekst>
                )}
            </div>
        </Panel>
    );
};

export default SoknadsStatusUtenInnsyn;
