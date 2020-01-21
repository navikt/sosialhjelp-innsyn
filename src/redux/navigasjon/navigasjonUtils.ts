import {setBannerTittel } from "./navigasjonsReducer";
import {useDispatch} from "react-redux";
import {useEffect} from "react";

const useBannerTittel = (bannerTittel: string) => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setBannerTittel(bannerTittel))
    }, [dispatch, bannerTittel]);
};

export {useBannerTittel};
