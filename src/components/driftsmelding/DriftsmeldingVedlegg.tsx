import * as React from "react";
import {FormattedMessage} from "react-intl";
import {KommuneResponse} from "../../redux/innsynsdata/innsynsdataReducer";
import {useSelector} from "react-redux";
import {InnsynAppState} from "../../redux/reduxTypes";
import {isFileUploadAllowed} from "./DriftsmeldingUtilities";
import {Alert} from "@navikt/ds-react";
import styled from "styled-components/macro";

interface Props {
    leserData: undefined | boolean;
}

const Bold = styled.span`
    font-weight: bold;
`;

const DriftsmeldingVedlegg: React.FC<Props> = (props: Props) => {
    let kommuneResponse: KommuneResponse | undefined = useSelector(
        (state: InnsynAppState) => state.innsynsdata.kommune
    );
    const kanLasteOppVedlegg: boolean = isFileUploadAllowed(kommuneResponse);

    if (!kanLasteOppVedlegg && !props.leserData) {
        return (
            <Alert variant="error" size="medium" inline>
                <Bold>
                    <FormattedMessage id={"driftsmelding.kanIkkeSendeVedlegg"} />
                </Bold>
            </Alert>
        );
    }
    return null;
};

export default DriftsmeldingVedlegg;
