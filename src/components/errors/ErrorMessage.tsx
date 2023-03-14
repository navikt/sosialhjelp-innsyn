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
        <div className={styles.error_placeholder} role="alert" aria-atomic="true" aria-live="assertive">
            {children}
        </div>
    </ErrorMessageContext.Provider>
);

/*Todo restrict usage inside the errorPlaceholder-component*/
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
