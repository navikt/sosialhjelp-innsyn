import { getTranslations } from "next-intl/server";

import { StatusPage } from "./StatusPage";

interface Props {
    id: string;
}

export const StatusUnderBehandlingPage = async ({ id }: Props) => {
    const t = await getTranslations("StatusUnderBehandlingPage");

    return <StatusPage id={id} heading={t("tittel")} />;
};
