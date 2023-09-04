import {useMedia} from "react-use";

export const MOBILE_MAX_WIDTH = "48em";

const useIsMobile = () => {
    return useMedia(`(max-width: ${MOBILE_MAX_WIDTH})`);
};

export default useIsMobile;
