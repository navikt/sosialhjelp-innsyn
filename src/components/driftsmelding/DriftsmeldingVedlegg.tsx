import * as React from "react";
import {useTranslation} from "react-i18next";
import {isFileUploadAllowed} from "./DriftsmeldingUtilities";
import {Alert} from "@navikt/ds-react";
import styled from "styled-components/macro";
import useKommune from "../../hooks/useKommune";
import useFiksDigisosId from "../../hooks/useFiksDigisosId";

const Bold = styled.span`
    font-weight: bold;
`;

export const DriftsmeldingVedleggComponent = ({className}: {className?: string}) => {
    const {t} = useTranslation();

    return (
        <Alert variant="error" size="medium" inline className={className}>
            <Bold>{t("driftsmelding.kanIkkeSendeVedlegg")}</Bold>
        </Alert>
    );
};

const DriftsmeldingVedlegg = ({className}: {className?: string}) => {
    const {kommune, isLoading} = useKommune();
    const fiksDigisosId = useFiksDigisosId();

    const kanLasteOppVedlegg = isFileUploadAllowed(kommune, fiksDigisosId);

    if (!kanLasteOppVedlegg && !isLoading) {
        return <DriftsmeldingVedleggComponent className={className} />;
    }
    return null;
};

export default DriftsmeldingVedlegg;
