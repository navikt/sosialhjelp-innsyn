import {Button, Loader} from "@navikt/ds-react";
import React, {MouseEventHandler} from "react";
import styled from "styled-components";
import {useTranslation} from "react-i18next";

const ButtonWrapper = styled.div`
    margin-top: 1rem;
`;

interface Props {
    isVisible: boolean;
    isLoading: boolean;
    onClick: MouseEventHandler<HTMLButtonElement>;
}
const SendFileButton = ({isVisible, isLoading, onClick}: Props) => {
    const {t} = useTranslation();

    return isVisible ? (
        <ButtonWrapper>
            <Button
                variant="primary"
                disabled={isLoading}
                onClick={onClick}
                iconPosition="right"
                icon={isLoading && <Loader />}
            >
                {t("oppgaver.send_knapp_tittel")}
            </Button>
        </ButtonWrapper>
    ) : null;
};
export default SendFileButton;
