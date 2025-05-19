import { Button, Loader } from "@navikt/ds-react";
import React, { MouseEventHandler } from "react";
import styled from "styled-components";
import { useTranslations } from "next-intl";

const ButtonWrapper = styled.div`
    margin-top: 1rem;
`;

interface Props {
    isVisible: boolean;
    isLoading: boolean;
    onClick: MouseEventHandler<HTMLButtonElement>;
    disabled?: boolean;
}
const SendFileButton = ({ isVisible, isLoading, onClick, disabled }: Props) => {
    const t = useTranslations("common");

    return isVisible ? (
        <ButtonWrapper>
            <Button
                variant="primary"
                disabled={isLoading || disabled}
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
