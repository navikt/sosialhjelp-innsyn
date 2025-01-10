import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {GetServerSidePropsContext} from "next/types";

import {getFlagsServerSide} from "../featuretoggles/ssr";

const pageHandler = async (
    {locale, req, res}: GetServerSidePropsContext,
    translationNamespaces: string[] | string | undefined = ["common"]
) => {
    const translations = await serverSideTranslations(locale ?? "nb", translationNamespaces);
    const flags = await getFlagsServerSide(req, res);
    return {props: {...translations, ...flags}};
};

export default pageHandler;
