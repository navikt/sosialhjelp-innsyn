import { getTranslations } from "next-intl/server";
import { Tag } from "@navikt/ds-react";

import StatusAlert from "../alert/StatusAlert";
import { getOppgaver } from "../../generated/ssr/oppgave-controller/oppgave-controller";
import { hentSaksStatuser } from "../../generated/ssr/saks-status-controller/saks-status-controller";
import { isVedtakUtfallKey, vedtakUtfallMap } from "../vedtak/VedtakUtfallMap";

import { StatusPage } from "./StatusPage";

interface Props {
    navKontor: string;
    id: string;
}

export const StatusUnderBehandlingPage = async ({ navKontor, id }: Props) => {
    const t = await getTranslations("StatusUnderBehandlingPage");

    const oppgaver = await getOppgaver(id);
    const saker = await hentSaksStatuser(id);

    return (
        <StatusPage
            id={id}
            heading={t("tittel")}
            alert={
                oppgaver.length > 0 ? (
                    <StatusAlert
                        variant="warning"
                        tittel={t.rich("alert.tittel", {
                            navKontor: navKontor,
                            norsk: (chunks) => <span lang="no">{chunks}</span>,
                        })}
                        beskrivelse={t("alert.beskrivelse")}
                    />
                ) : null
            }
        >
            {saker.map((sak, index) => {
                const key = sak.utfallVedtak;
                const Component = key && isVedtakUtfallKey(key) ? vedtakUtfallMap[key] : null;

                if (Component) {
                    return <Component key={index} sak={sak} />;
                }

                if (sak.status === "UNDER_BEHANDLING") {
                    return (
                        <Tag variant="info" key={index}>
                            Under behandling
                        </Tag>
                    );
                }
                return null;
            })}
        </StatusPage>
    );
};
