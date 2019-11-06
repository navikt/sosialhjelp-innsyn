import {Reducer} from "redux";

interface NavigasjonsType {
    brodsmulesti: BrodsmuleElement[];
    bannerTittel: string;
}

export interface BrodsmuleElement {
    sti: string;
    tittel: string;
}

const initialState: NavigasjonsType = {
    brodsmulesti: [
        {
            sti: "/sosialhjelp/innsyn",
            tittel: "Økonomisk sosialhjelp"
        }
    ],
    bannerTittel: "Økonomisk sosialhjelp"
};

export enum NavgiasjonActionTypeKey {
    SETT_BRODSMULESTI = "SETT_BRODSMULESTI",
    SETT_BANNERTITTEL = "SETT_BANNERTITTEL"
}

const setBrodsmuleSti = (brodsmulesti: BrodsmuleElement[]) => {
    return {
        type: NavgiasjonActionTypeKey.SETT_BRODSMULESTI,
        brodsmulesti
    }
};

const setBannerTittel = (bannerTittel: string) => {
    return {
        type: NavgiasjonActionTypeKey.SETT_BANNERTITTEL,
        bannerTittel
    }
};

const NavigasjonsReducer: Reducer<NavigasjonsType, any> = (state = initialState, action) => {
    switch (action.type) {
        case NavgiasjonActionTypeKey.SETT_BRODSMULESTI: {
            return {
                ...state,
                brodsmulesti: action.brodsmulesti
            }
        }
        case NavgiasjonActionTypeKey.SETT_BANNERTITTEL: {
            return {
                ...state,
                bannerTittel: action.bannerTittel
            }
        }
    }
    return state;
};

export {setBrodsmuleSti, setBannerTittel};
export default NavigasjonsReducer;

