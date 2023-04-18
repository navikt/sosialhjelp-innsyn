import {useMedia} from "react-use";

export const MOBILE_MAX_WIDTH = "648px";

const useIsMobile = () => {
    return useMedia(`(max-width: ${MOBILE_MAX_WIDTH})`);
};

export default useIsMobile;
