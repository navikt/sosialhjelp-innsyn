import {useTranslation} from "react-i18next";
import ErrorMessagePlaceholder, {ErrorMessage} from "../errors/ErrorMessage";
import React, {ReactElement} from "react";
import styled from "styled-components";
import {css} from "styled-components/macro";

const OuterFrame = styled.div`
    padding: 8px;
    margin-bottom: 16px;
`;
const ChildrenFrame = styled.div<{hasError?: boolean}>`
    ${({hasError}) =>
        hasError &&
        css`
            border: 1px solid var(--a-red-500);
        `};
`;

interface Props {
    children: ReactElement;
    errors: string[];
    innsendelsesFrist?: ReactElement;
    sendButton?: ReactElement;
}

const OppgaveOpplastingBlokk = (props: Props) => {
    const {children, sendButton, errors, innsendelsesFrist} = props;
    const {t} = useTranslation();
    return (
        <OuterFrame>
            {innsendelsesFrist}

            <ChildrenFrame hasError={errors.length > 0}>{children}</ChildrenFrame>
            <ErrorMessagePlaceholder>
                {errors.map((error, index) => (
                    <ErrorMessage key={index} style={{marginBottom: "1rem"}}>
                        {t(error)}
                    </ErrorMessage>
                ))}
            </ErrorMessagePlaceholder>
            {sendButton}
        </OuterFrame>
    );
};
export default OppgaveOpplastingBlokk;
