import * as React from "react";
import {useTranslation} from "react-i18next";
import {useFileUploadAllowed} from "./DriftsmeldingUtilities";
import {Alert} from "@navikt/ds-react";
import styled from "styled-components";
import useKommune from "../../hooks/useKommune";
import useFiksDigisosId from "../../hooks/useFiksDigisosId";

const Bold = styled.span`
    font-weight: bold;
`;

interface Props {
    textKey: string;
    className?: string;
}

export const DriftsmeldingVedleggComponent = ({textKey, className}: Props) => {
    const {t} = useTranslation();

    return (
        <Alert variant="error" size="medium" inline className={className}>
            <Bold>{t(textKey)}</Bold>
        </Alert>
    );
};

const DriftsmeldingVedlegg = ({className}: {className?: string}) => {
    const {kommune, isLoading} = useKommune();
    const fiksDigisosId = useFiksDigisosId();

    const {kanLasteOppVedlegg, textKey} = useFileUploadAllowed(kommune, fiksDigisosId);

    if (!kanLasteOppVedlegg && !isLoading) {
        return <DriftsmeldingVedleggComponent className={className} textKey={textKey} />;
    }
    return null;
};

export default DriftsmeldingVedlegg;
