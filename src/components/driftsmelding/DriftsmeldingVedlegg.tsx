import * as React from "react";
import RemoveCircle from "../ikoner/RemoveCircle";
import {FormattedMessage} from "react-intl";
import "./DriftsmeldingVedlegg.css";
import {KommuneResponse} from "../../redux/innsynsdata/innsynsdataReducer";
import {useSelector} from "react-redux";
import {InnsynAppState} from "../../redux/reduxTypes";
import {isFileUploadAllowed} from "./DriftsmeldingUtilities";
import {Label} from "@navikt/ds-react";

interface Props {
    leserData: undefined | boolean;
}

const DriftsmeldingVedlegg: React.FC<Props> = (props: Props) => {
    let kommuneResponse: KommuneResponse | undefined = useSelector(
        (state: InnsynAppState) => state.innsynsdata.kommune
    );
    const kanLasteOppVedlegg: boolean = isFileUploadAllowed(kommuneResponse);

    if (!kanLasteOppVedlegg && !props.leserData) {
        return (
            <div className={"driftsmelding-vedlegg-wrapper"}>
                <div className={"driftsmelding-vedlegg-symbol-wrapper"}>
                    <RemoveCircle />
                </div>
                <Label>
                    <FormattedMessage id={"driftsmelding.kanIkkeSendeVedlegg"} />
                </Label>
            </div>
        );
    }
    return null;
};

export default DriftsmeldingVedlegg;
