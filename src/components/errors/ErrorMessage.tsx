import React from "react";
import styled from "styled-components";

const StyledErrorMessage = styled.p`
    color: var(--a-text-danger);
`;

interface ErrorMessageProps extends React.HTMLAttributes<HTMLElement> {
    children: React.ReactNode;
}

export const ErrorMessage = ({children, ...rest}: ErrorMessageProps) => (
    <StyledErrorMessage aria-live="polite" {...rest}>
        {children}
    </StyledErrorMessage>
);
