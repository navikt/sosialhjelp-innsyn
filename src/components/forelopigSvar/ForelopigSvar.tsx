import * as React from "react";
import {FormattedMessage} from "react-intl";
import EksternLenke from "../eksternLenke/EksternLenke";
import {useSelector} from "react-redux";
import {InnsynAppState} from "../../redux/reduxTypes";
import {ForelopigSvar} from "../../redux/innsynsdata/innsynsdataReducer";
import {logButtonOrLinkClick} from "../../utils/amplitude";
import {Alert} from "@navikt/ds-react";

const ForelopigSvarAlertstripe: React.FC<{}> = () => {
    let forelopigSvar: ForelopigSvar = useSelector((state: InnsynAppState) => state.innsynsdata.forelopigSvar);
    let soknadsStatusState: string | null = useSelector(
        (state: InnsynAppState) => state.innsynsdata.soknadsStatus.status
    );

    const onVisForeløpigSvar = () => {
        logButtonOrLinkClick("Vis foreløpig svar");
    };

    if (forelopigSvar.harMottattForelopigSvar && soknadsStatusState !== "FERDIGBEHANDLET") {
        return (
            <Alert className="blokk" variant="info">
                <FormattedMessage id={"forelopigSvar"} />
                <FormattedMessage id={"forelopigSvar"} />
                {forelopigSvar.link && (
                    <EksternLenke href={forelopigSvar.link} target="_blank" onClick={onVisForeløpigSvar}>
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
