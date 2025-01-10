import React, {ErrorInfo, ReactNode} from "react";
import {logger} from "@navikt/next-logger";
import ServerError from "../../pages/500";

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
}

class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        // Define a state variable to track whether is an error or not
        this.state = {hasError: false};
    }
    static getDerivedStateFromError(_: Error) {
        // Update state so the next render will show the fallback UI

        return {hasError: true};
    }
    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        logger.error(`Uncaught clientside error: ${error}, errorInfo: ${JSON.stringify(errorInfo)}`);
    }

    public render() {
        if (this.state.hasError) {
            return <ServerError />;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
