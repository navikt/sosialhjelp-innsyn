import * as React from "react";
import AlertStripe from "nav-frontend-alertstriper";
import {FormattedMessage} from "react-intl";
import EksternLenke from "../eksternLenke/EksternLenke";
import {useSelector} from "react-redux";
import {InnsynAppState} from "../../redux/reduxTypes";
import {ForelopigSvar} from "../../redux/innsynsdata/innsynsdataReducer";

const ForelopigSvarAlertstripe: React.FC<{}> = () => {
    let forelopigSvar: ForelopigSvar = useSelector((state: InnsynAppState) => state.innsynsdata.forelopigSvar);
    let soknadsStatusState: string | null = useSelector(
        (state: InnsynAppState) => state.innsynsdata.soknadsStatus.status
    );

    if (forelopigSvar.harMottattForelopigSvar && soknadsStatusState !== "FERDIGBEHANDLET") {
        return (
            <div>
                <AlertStripe type="info">
                    <FormattedMessage id={"forelopigSvar"} />
                    {forelopigSvar.link && (
                        <EksternLenke href={forelopigSvar.link} target="_blank">
                            <b>
                                <FormattedMessage id="historikk.se_vedtaksbrev" />
                            </b>
                        </EksternLenke>
                    )}
                </AlertStripe>
                <br />
            </div>
        );
    }
    return null;
};

export default ForelopigSvarAlertstripe;
