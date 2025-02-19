import React, { useMemo } from "react";
import { Detail, Label, LinkPanel, Panel } from "@navikt/ds-react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { ExclamationmarkTriangleIcon, FileTextIcon } from "@navikt/aksel-icons";

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
    kilde,
    isBroken,
}: {
    fiksDigisosId?: string;
    tittel: string;
    oppdatert: string;
    url: string | undefined;
    kilde: string;
    isBroken: boolean;
}) => {
    const { data: saksdetaljer, isLoading } = useGetSaksDetaljer(fiksDigisosId ?? "", {
        query: { enabled: kilde === "innsyn-api" && !!fiksDigisosId },
    });
    const router = useRouter();
    const { t } = useTranslation();
    const linkpanelUrl = fiksDigisosId ? `/sosialhjelp/innsyn/${fiksDigisosId}/status` : url;
    //console.log("saksdetaljer", saksdetaljer)

    const oppdatertTittel = useMemo(() => {
        if (saksdetaljer && saksdetaljer.soknadTittel?.length > 0) {
            return saksdetaljer.soknadTittel.replaceAll("default_sak_tittel", t("saker.default_tittel"));
        }
        return tittel && tittel !== "saker.default_tittel" ? tittel : t("saker.default_tittel");
    }, [saksdetaljer, tittel, t]);

    const onClick = async (event: React.MouseEvent<HTMLAnchorElement>) => {
        if (event.isDefaultPrevented() || event.metaKey || event.ctrlKey) {
            return;
        }
        if (kilde === "soknad-api") {
            window.location.href = url!;
        } else if (kilde === "innsyn-api") {
            await router.push(`/${fiksDigisosId}/status`);
            event.preventDefault();
        }
    };

    if (isLoading) {
        return (
            <Panel className="mt-1">
                <Lastestriper linjer={2} />
            </Panel>
        );
    }

    return (
        <LinkPanel className="mt-1" border={false} onClick={onClick} href={linkpanelUrl}>
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
                {isBroken && <ExclamationmarkTriangleIcon className="text-icon-warning w-6 h-6" />}
            </LinkPanel.Description>
        </LinkPanel>
    );
};

export default SakPanel;
