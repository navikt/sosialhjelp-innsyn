import * as React from "react";
import { useTranslation } from "next-i18next";
import { Alert } from "@navikt/ds-react";
import styled from "styled-components";

import useKommune from "../../hooks/useKommune";
import useFiksDigisosId from "../../hooks/useFiksDigisosId";

import { useFileUploadAllowed } from "./DriftsmeldingUtilities";

const Bold = styled.span`
    font-weight: bold;
`;

interface Props {
    textKey: string;
    className?: string;
}

export const DriftsmeldingVedleggComponent = ({ textKey, className }: Props) => {
    const { t } = useTranslation();

    return (
        <Alert variant="error" size="medium" inline className={className}>
            <Bold>{t(textKey)}</Bold>
        </Alert>
    );
};

const DriftsmeldingVedlegg = ({ className }: { className?: string }) => {
    const { kommune, isLoading } = useKommune();
    const fiksDigisosId = useFiksDigisosId();

    const { textKey } = useFileUploadAllowed(kommune, fiksDigisosId);

    if (textKey && !isLoading) {
        return <DriftsmeldingVedleggComponent className={className} textKey={textKey} />;
    }
    return null;
};

export default DriftsmeldingVedlegg;
