import { getTranslations } from "next-intl/server";

import { StatusPage } from "./StatusPage";

interface Props {
    id: string;
}

export const StatusFerdigbehandletPage = async ({ id }: Props) => {
    const t = await getTranslations("StatusFerdigbehandletPage");
    return <StatusPage heading={t("tittel")} id={id} />;
};
