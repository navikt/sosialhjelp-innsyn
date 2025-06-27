import { getTranslations } from "next-intl/server";

import { StatusPage } from "./StatusPage";

export const StatusFerdigbehandletPage = async () => {
    const t = await getTranslations("StatusFerdigbehandletPage");
    return <StatusPage heading={t("tittel")} />;
};
