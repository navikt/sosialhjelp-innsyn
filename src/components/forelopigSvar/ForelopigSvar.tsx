import * as React from "react";
import {FormattedMessage} from "react-intl";
import EksternLenke from "../eksternLenke/EksternLenke";
import {logButtonOrLinkClick} from "../../utils/amplitude";
import {Alert} from "@navikt/ds-react";
import {useHentForelopigSvarStatus} from "../../generated/forelopig-svar-controller/forelopig-svar-controller";
import {useParams} from "react-router";
import {useHentSoknadsStatus} from "../../generated/soknads-status-controller/soknads-status-controller";

const ForelopigSvarAlertstripe: React.FC = () => {
    const {soknadId} = useParams<{soknadId: string}>();

    const {data: forelopigSvar} = useHentForelopigSvarStatus(soknadId!);
    const {data: soknadsStatus} = useHentSoknadsStatus(soknadId!);

    const onVisForelopigSvar = () => {
        logButtonOrLinkClick("Vis foreløpig svar");
    };

    if (!forelopigSvar || !soknadsStatus) {
        return null;
    }

    if (forelopigSvar.harMottattForelopigSvar && soknadsStatus.status !== "FERDIGBEHANDLET") {
        return (
            <Alert variant="info">
                <FormattedMessage id={"forelopigSvar"} />
                {forelopigSvar.link && (
                    <EksternLenke href={forelopigSvar.link} onClick={onVisForelopigSvar}>
                        <b>
                            <FormattedMessage id="historikk.se_vedtaksbrev" />
                        </b>
                    </EksternLenke>
                )}
            </Alert>
        );
    }
    return null;
};

export default ForelopigSvarAlertstripe;
