import { useTranslation } from "next-i18next";
import React, { ReactElement } from "react";
import styled from "styled-components";
import { css } from "styled-components";
import { ErrorMessage } from "@navikt/ds-react";

import ErrorMessageWrapper from "../errors/ErrorMessageWrapper";

const OuterFrame = styled.div`
    padding: 8px;
    margin-bottom: 16px;
`;
const ChildrenFrame = styled.div<{ $hasError?: boolean }>`
    ${({ $hasError }) =>
        $hasError &&
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
    const { children, sendButton, errors, innsendelsesFrist } = props;
    const { t } = useTranslation();
    return (
        <OuterFrame>
            {innsendelsesFrist}

            <ChildrenFrame $hasError={errors.length > 0}>{children}</ChildrenFrame>
            <ErrorMessageWrapper>
                {errors.map((error, index) => (
                    <ErrorMessage key={index} style={{ marginBottom: "1rem" }}>
                        {t(error)}
                    </ErrorMessage>
                ))}
            </ErrorMessageWrapper>
            {sendButton}
        </OuterFrame>
    );
};
export default OppgaveOpplastingBlokk;
