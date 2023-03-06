import * as React from "react";
import {FormattedMessage} from "react-intl";
import {isFileUploadAllowed} from "./DriftsmeldingUtilities";
import {Alert} from "@navikt/ds-react";
import styled from "styled-components/macro";
import useKommune from "../../hooks/useKommune";

interface Props {
    restStatusError: undefined | boolean;
}

const Bold = styled.span`
    font-weight: bold;
`;

const DriftsmeldingVedlegg: React.FC<Props> = (props: Props) => {
    const {kommune, isLoading} = useKommune();
    const kanLasteOppVedlegg: boolean = isFileUploadAllowed(kommune);

    if (!kanLasteOppVedlegg && props.restStatusError && !isLoading) {
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
