import {Reducer} from "redux";

interface NavigasjonsType {
    bannerTittel: string;
}

const initialState: NavigasjonsType = {
    bannerTittel: "Økonomisk sosialhjelp",
};

export enum NavgiasjonActionTypeKey {
    SETT_BANNERTITTEL = "SETT_BANNERTITTEL",
}

const setBannerTittel = (bannerTittel: string) => {
    return {
        type: NavgiasjonActionTypeKey.SETT_BANNERTITTEL,
        bannerTittel,
    };
};

const NavigasjonsReducer: Reducer<NavigasjonsType, any> = (state = initialState, action) => {
    switch (action.type) {
        case NavgiasjonActionTypeKey.SETT_BANNERTITTEL: {
            return {
                ...state,
                bannerTittel: action.bannerTittel,
            };
        }
    }
    return state;
};

export {setBannerTittel};
export default NavigasjonsReducer;
