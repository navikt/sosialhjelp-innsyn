import * as React from "react";
import RemoveCircle from "../ikoner/RemoveCircle";
import {FormattedMessage} from "react-intl";
import "./DriftsmeldingVedlegg.less";
import {KommuneResponse} from "../../redux/innsynsdata/innsynsdataReducer";
import {useSelector} from "react-redux";
import {InnsynAppState} from "../../redux/reduxTypes";
import {erOpplastingAvVedleggTillat} from "./DriftsmeldingUtilities";
import {Normaltekst} from "nav-frontend-typografi";

interface Props {
    leserData: undefined | boolean;
}

const DriftsmeldingVedlegg: React.FC<Props> = (props: Props) => {
    let kommuneResponse: KommuneResponse | undefined = useSelector(
        (state: InnsynAppState) => state.innsynsdata.kommune
    );
    const kanLasteOppVedlegg: boolean = erOpplastingAvVedleggTillat(kommuneResponse);

    if (!kanLasteOppVedlegg && !props.leserData) {
        return (
            <div className={"driftsmelding-vedlegg-wrapper"}>
                <div className={"driftsmelding-vedlegg-symbol-wrapper"}>
                    <RemoveCircle />
                </div>
                <Normaltekst className={"driftsmelding-vedlegg-text-wrapper"}>
                    <FormattedMessage id={"driftsmelding.kanIkkeSendeVedlegg"} />
                </Normaltekst>
            </div>
        );
    }
    return null;
};

export default DriftsmeldingVedlegg;
