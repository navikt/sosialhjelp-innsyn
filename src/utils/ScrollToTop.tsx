import {useLayoutEffect} from "react";
import {useHistory} from "react-router";

function ScrollToTop() {
    const history = useHistory();
    useLayoutEffect(() => {
        const unlisten = history.listen(() => {
            window.scrollTo(0, 0);
        });
        return () => {
            unlisten();
        };
    }, [history]);

    return null;
}

export default ScrollToTop;
