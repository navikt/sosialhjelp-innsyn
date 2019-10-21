import {Reducer} from "redux";

interface NavigasjonsType {
    brodsmulesti: BrodsmuleElement[];
}

interface BrodsmuleElement {
    sti: string;
    tittel: string;
}

const initialState: NavigasjonsType = {
    brodsmulesti: [
        {
            sti: "/sosialhjelp/innsyn",
            tittel: "Økonomisk sosialhjelp"
        }
    ]
};

export enum NavgiasjonActionTypeKey {
    SETT_BRODSMULESTI = "SETT_BRODSMULESTI"
}
const setBrodsmuleSti = (brodsmulesti: BrodsmuleElement[]) => {
    return {
        type: NavgiasjonActionTypeKey.SETT_BRODSMULESTI,
        brodsmulesti
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
    }
    return state;
};

export {setBrodsmuleSti};
export default NavigasjonsReducer;

