import {BrodsmuleElement, setBannerTittel, setBrodsmuleSti} from "./navigasjonsReducer";
import {useDispatch} from "react-redux";
import {useEffect} from "react";

const useBrodsmuleSti = (brodsmulesti: BrodsmuleElement[]) => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setBrodsmuleSti(brodsmulesti))
    }, [dispatch, brodsmulesti]);
};

const useBannerTittel = (bannerTittel: string) => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setBannerTittel(bannerTittel))
    }, [dispatch, bannerTittel]);
};

export {useBrodsmuleSti, useBannerTittel};
