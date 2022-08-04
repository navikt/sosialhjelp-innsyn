import {useEffect, useLayoutEffect} from "react";
import {RouteComponentProps, withRouter} from "react-router";

function ScrollToTop({history}: RouteComponentProps) {
    useLayoutEffect(() => {
        const unlisten = history.listen(() => {
            window.scrollTo(0, 0);
        });
        return () => {
            unlisten();
        };
    }, []);

    return null;
}

export default withRouter(ScrollToTop);
