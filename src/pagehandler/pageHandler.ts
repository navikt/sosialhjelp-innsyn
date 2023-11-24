import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {getFlagsServerSide} from "../featuretoggles/ssr";
import {GetServerSidePropsContext} from "next/types";

const pageHandler = async (
    {locale, req, res}: GetServerSidePropsContext,
    translationNamespaces: string[] | string | undefined = ["common"]
) => {
    const translations = await serverSideTranslations(locale ?? "nb", translationNamespaces);
    const flags = await getFlagsServerSide(req, res);
    return {props: {...translations, ...flags}};
};

export default pageHandler;
