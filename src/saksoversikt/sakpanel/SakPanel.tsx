import React, { useMemo } from "react";
import { Detail, Label, LinkPanel, Panel } from "@navikt/ds-react";
import { useLocale, useTranslations } from "next-intl";
import { FileTextIcon } from "@navikt/aksel-icons";
import Link from "next/link";

import DatoOgKlokkeslett from "../../components/tidspunkt/DatoOgKlokkeslett";
import Lastestriper from "../../components/lastestriper/Lasterstriper";
import OppgaverTag from "../../components/sakspanel/OppgaverTag";
import SaksMetaData from "../../components/sakspanel/SaksMetaData";
import { useGetSaksDetaljer } from "../../generated/saks-oversikt-controller/saks-oversikt-controller";

const SakPanel = ({
    fiksDigisosId,
    tittel,
    oppdatert,
    url,
}: {
    fiksDigisosId?: string;
    tittel: string;
    oppdatert: string;
    url: string | undefined;
}) => {
    const { data: saksdetaljer, isLoading } = useGetSaksDetaljer(fiksDigisosId ?? "", {
        query: { enabled: !!fiksDigisosId },
    });
    const locale = useLocale();
    const t = useTranslations("common");
    const linkpanelUrl = fiksDigisosId ? `${locale}/${fiksDigisosId}/status` : url;

    const oppdatertTittel = useMemo(() => {
        if (saksdetaljer && saksdetaljer.soknadTittel?.length > 0) {
            return saksdetaljer.soknadTittel.replaceAll("default_sak_tittel", t("saker.default_tittel"));
        }
        return tittel && tittel !== "saker.default_tittel" ? tittel : t("saker.default_tittel");
    }, [saksdetaljer, tittel, t]);

    if (isLoading) {
        return (
            <Panel className="mt-1">
                <Lastestriper linjer={2} />
            </Panel>
        );
    }

    return (
        <LinkPanel className="mt-1" border={false} as={Link} href={linkpanelUrl}>
            <LinkPanel.Description className="flex gap-4 items-center justify-between md:flex-nowrap flex-wrap">
                <FileTextIcon aria-hidden title="dokument" className="sm:block hidden h-12 w-12" />
                <div>
                    <Label as="p" lang="no">
                        {oppdatertTittel}
                    </Label>
                    {!saksdetaljer?.status ? (
                        <Detail lang="no">
                            sendt <DatoOgKlokkeslett tidspunkt={oppdatert} bareDato={true} />
                        </Detail>
                    ) : (
                        <SaksMetaData oppdatert={oppdatert} status={saksdetaljer.status} />
                    )}
                </div>
                <OppgaverTag antallNyeOppgaver={saksdetaljer?.antallNyeOppgaver} />
            </LinkPanel.Description>
        </LinkPanel>
    );
};

export default SakPanel;
