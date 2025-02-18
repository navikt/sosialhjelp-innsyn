import React, { ErrorInfo, ReactNode } from "react";
import { logger } from "@navikt/next-logger";

import ServerError from "../../pages/500";

interface Props {
    children?: ReactNode;
    fallback?: ReactNode;
}

interface State {
    error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        // Define a state variable to track whether is an error or not
        this.state = { error: null };
    }

    static getDerivedStateFromError(error: Error) {
        // Update state so the next render will show the fallback UI
        return { error };
    }
    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        logger.error(`Uncaught clientside error: ${error}, errorInfo: ${JSON.stringify(errorInfo)}`);
    }

    public render() {
        if (!!this.state.error) return this.props.fallback ?? <ServerError />;
        return this.props.children;
    }
}

export default ErrorBoundary;
