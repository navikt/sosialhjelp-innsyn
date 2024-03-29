import React, {useContext} from "react";
import {ErrorMessage as DsErrorMessage} from "@navikt/ds-react";
import styles from "./errorMessage.module.css";

interface ErrorMessageProps extends React.HTMLAttributes<HTMLElement> {
    children: React.ReactNode;
}

interface ErrorMessageContextProps {}

const ErrorMessageContext = React.createContext<ErrorMessageContextProps | null>(null);

const ErrorMessagePlaceholder = ({children}: ErrorMessageProps) => (
    <ErrorMessageContext.Provider value={{}}>
        <div className={styles.error_placeholder} aria-live="assertive" aria-atomic="true">
            {children}
        </div>
    </ErrorMessageContext.Provider>
);

const ErrorMessage = ({children, ...rest}: ErrorMessageProps) => {
    const context = useContext(ErrorMessageContext);

    if (context === null) {
        console.error("<ErrorMessage> has to be used within an <ErrorMessagePlaceholder>");
        return null;
    }
    return <DsErrorMessage {...rest}>{children}</DsErrorMessage>;
};

export default ErrorMessagePlaceholder;
export {ErrorMessage};
