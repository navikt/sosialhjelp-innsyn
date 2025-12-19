import React, { use } from "react";
import { useTranslations } from "next-intl";
import { VilkarResponse } from "@generated/ssr/model";
import StatusAlert from "@components/alert/StatusAlert";

interface Props {
    vilkarPromise: Promise<VilkarResponse[]>;
}

const VilkarAlert = ({ vilkarPromise }: Props): React.JSX.Element | null => {
    const t = useTranslations("VilkarAlert");
    const vilkar = use(vilkarPromise);
    if (vilkar?.length) {
        return (
            <StatusAlert variant="warning" tittel={t("tittel")}>
                {t("beskrivelse")}
            </StatusAlert>
        );
    }
    return null;
};

export default VilkarAlert;
