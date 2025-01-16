import * as React from "react";
import { useTranslation } from "next-i18next";
import { Alert } from "@navikt/ds-react";
import styled from "styled-components";

import useFiksDigisosId from "../../hooks/useFiksDigisosId";

import { useFileUploadError } from "./useFileUploadError";

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
    const fileUploadError = useFileUploadError(useFiksDigisosId());

    if (!fileUploadError) return null;

    return <DriftsmeldingVedleggComponent className={className} textKey={fileUploadError} />;
};

export default DriftsmeldingVedlegg;
