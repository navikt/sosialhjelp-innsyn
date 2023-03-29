import React from "react";
import styled from "styled-components";
import {Alert} from "@navikt/ds-react";
import {useTranslation} from "react-i18next";

const StyledAlert = styled(Alert)`
    margin-top: 1rem;
`;

const VedleggSuccess = ({show}: {show: boolean}) => {
    const {t} = useTranslation();
    return show ? <StyledAlert variant="success">{t("vedlegg.suksess")}</StyledAlert> : null;
};
export default VedleggSuccess;
