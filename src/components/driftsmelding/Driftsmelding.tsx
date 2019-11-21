import * as React from 'react';
import AlertStripe from "nav-frontend-alertstriper";
import {useSelector} from "react-redux";
import {InnsynAppState} from "../../redux/reduxTypes";
import {KommuneResponse} from "../../redux/innsynsdata/innsynsdataReducer";
import {FormattedMessage} from "react-intl";
import {Driftsmelding, DriftsmeldingTypeKeys, getDriftsmeldingByKommuneResponse} from "./DriftsmeldingUtilities";



const DriftsmeldingAlertstripe: React.FC<{}> = () => {

    let kommuneResponse: KommuneResponse | undefined = useSelector((state: InnsynAppState) => state.innsynsdata.kommune);

    const driftsmelding: Driftsmelding = getDriftsmeldingByKommuneResponse(kommuneResponse);

    switch (driftsmelding.type) {
        case DriftsmeldingTypeKeys.DRIFTSMELDING_ETTERSENDELSE_DEAKTIVERT: {
            return (
                <div>
                    <AlertStripe type="feil">
                        <FormattedMessage id={driftsmelding.textKey}/>
                    </AlertStripe>
                    <br/>
                </div>
            )
        }
        case DriftsmeldingTypeKeys.DRIFTSMELDING_INNSYN_DEAKTIVERT: {
            return (
                <div>
                    <AlertStripe type="feil">
                        <FormattedMessage id={driftsmelding.textKey}/>
                    </AlertStripe>
                    <br/>
                </div>
            )
        }
        case DriftsmeldingTypeKeys.DRIFTSMELDING_INNSYN_OG_ETTERSENDELSE_DEAKTIVERT: {
            return (
                <div>
                    <AlertStripe type="feil">
                        <FormattedMessage id={driftsmelding.textKey}/>
                    </AlertStripe>
                    <br/>
                </div>
            )
        }
        case DriftsmeldingTypeKeys.DRIFTSMELDING_INGEN: {
            return null;

        }
        default: {
            return null;
        }
    }
};

export default DriftsmeldingAlertstripe;