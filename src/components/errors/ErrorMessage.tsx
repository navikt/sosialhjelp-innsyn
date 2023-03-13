import React from "react";
import {ErrorMessage as DsErrorMessage} from "@navikt/ds-react";

interface ErrorMessageProps extends React.HTMLAttributes<HTMLElement> {
    children: React.ReactNode;
}

export const ErrorMessage = ({children, ...rest}: ErrorMessageProps) => (
    <DsErrorMessage aria-live="polite" {...rest}>
        {children}
    </DsErrorMessage>
);
