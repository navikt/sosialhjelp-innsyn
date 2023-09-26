import React from "react";
import styled from "styled-components";
import {Alert} from "@navikt/ds-react";
import {useTranslation} from "next-i18next";
import {useFilUploadSuccessful} from "./FilUploadSuccessfulContext";

const StyledAlert = styled(Alert)`
    margin-top: 1rem;
`;

const VedleggSuccess = ({show}: {show: boolean}) => {
    const {setOppgaverUploadSuccess, setEttersendelseUploadSuccess} = useFilUploadSuccessful();
    const {t} = useTranslation();
    return show ? (
        <StyledAlert
            variant="success"
            closeButton
            onClose={() => {
                setOppgaverUploadSuccess(false);
                setEttersendelseUploadSuccess(false);
            }}
        >
            {t("vedlegg.suksess")}
        </StyledAlert>
    ) : null;
};
export default VedleggSuccess;
