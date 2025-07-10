import { getTranslations } from "next-intl/server";
import { Box } from "@navikt/ds-react";

import { hentSaksStatuser } from "../../generated/ssr/saks-status-controller/saks-status-controller";
import { isVedtakUtfallKey, vedtakUtfallMap } from "../vedtak/VedtakUtfallMap";

import { StatusPage } from "./StatusPage";

interface Props {
    id: string;
}

export const StatusFerdigbehandletPage = async ({ id }: Props) => {
    const t = await getTranslations("StatusFerdigbehandletPage");
    const saker = await hentSaksStatuser(id);

    return (
        <StatusPage heading={t("tittel")} id={id}>
            {saker.map((sak, index) => {
                const key = sak.utfallVedtak;
                const Component = key && isVedtakUtfallKey(key) ? vedtakUtfallMap[key] : null;

                if (Component) {
                    return <Component key={index} sak={sak} />;
                }

                if (sak.status === "UNDER_BEHANDLING") {
                    return (
                        <Box
                            background="surface-info-subtle"
                            key={index}
                            className="box-border size-fit  p-2 rounded-md text-blue-900"
                        >
                            {t("underBehandlingAlert")}
                        </Box>
                    );
                }
                return null;
            })}
        </StatusPage>
    );
};
