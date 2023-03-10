import React, {MouseEventHandler, ReactElement} from "react";
import InnsendelsesFrist from "./InnsendelsesFrist";
import {Button, Loader} from "@navikt/ds-react";
import styled from "styled-components";
import ErrorMessagePlaceholder, {ErrorMessage} from "../errors/ErrorMessage";
import {useTranslation} from "react-i18next";

const StyledInnerFrame = styled.div<{$hasError?: boolean}>`
    padding: 1rem;
    border-radius: 2px;
    border-color: ${(props) => (props.$hasError ? "var(--a-red-500)" : "var(--a-gray-300)")};
    border-width: 1px;
    border-style: solid;
`;

const StyledOuterFrame = styled.div`
    margin-top: 1rem;
`;

const ButtonWrapper = styled.div`
    margin-top: 1rem;
`;

interface Props {
    frist?: string;
    children: ReactElement;
    hasError?: boolean;
    showUploadButton?: boolean;
    isLoading?: boolean;
    onClick: MouseEventHandler<HTMLButtonElement>;
    errors: string[];
}

const OppgaveUploadBox = ({
    frist,
    children,
    hasError,
    showUploadButton,
    isLoading,
    onClick,
    errors,
}: Props): ReactElement => {
    const {t} = useTranslation();
    return (
        <StyledOuterFrame>
            <StyledInnerFrame $hasError={hasError}>
                {frist && <InnsendelsesFrist frist={frist} />}

                {children}
                {showUploadButton && (
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
                )}
            </StyledInnerFrame>
            <ErrorMessagePlaceholder>
                {errors.map((error, index) => (
                    <ErrorMessage key={index} style={{marginBottom: "1rem", marginLeft: "1rem"}}>
                        {t(error)}
                    </ErrorMessage>
                ))}
            </ErrorMessagePlaceholder>
        </StyledOuterFrame>
    );
};

export default OppgaveUploadBox;
