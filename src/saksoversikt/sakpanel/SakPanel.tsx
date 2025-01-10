import React, {useMemo} from "react";
import {Detail, Label, LinkPanel, Panel} from "@navikt/ds-react";
import styled, {css} from "styled-components";
import {useTranslation} from "next-i18next";
import {useRouter} from "next/router";
import {ExclamationmarkTriangleIcon} from "@navikt/aksel-icons";

import DatoOgKlokkeslett from "../../components/tidspunkt/DatoOgKlokkeslett";
import Lastestriper from "../../components/lastestriper/Lasterstriper";
import OppgaverTag from "../../components/sakspanel/OppgaverTag";
import SaksMetaData from "../../components/sakspanel/SaksMetaData";
import {
    StyledFileIcon,
    StyledLinkPanelDescription,
    StyledSaksDetaljer,
} from "../../components/sakspanel/sakspanelStyles";
import {useHentSaksDetaljer} from "../../generated/saks-oversikt-controller/saks-oversikt-controller";

const PanelStyle = css`
    margin-top: 4px;
`;

const StyledLastestripeWrapper = styled(Panel)`
    ${PanelStyle};
`;

const StyledLinkPanel = styled(LinkPanel)`
    .navds-link-panel__content {
        width: 100%;
    }
    ${PanelStyle};
`;

const VarselTrekant = styled(ExclamationmarkTriangleIcon)`
    color: var(--a-icon-warning);
    height: 1.5rem;
    width: 1.5rem;
`;

interface Props {
    fiksDigisosId?: string;
    tittel: string;
    oppdatert: string;
    url: string | undefined;
    kilde: string;
    isBroken: boolean;
}

const SakPanel: React.FC<Props> = ({fiksDigisosId, tittel, oppdatert, url, kilde, isBroken}) => {
    const {data: saksdetaljer, isLoading} = useHentSaksDetaljer(
        {id: fiksDigisosId!},
        {query: {enabled: kilde === "innsyn-api" && !!fiksDigisosId}}
    );
    const router = useRouter();
    const {t} = useTranslation();
    const linkpanelUrl = fiksDigisosId ? `/sosialhjelp/innsyn/${fiksDigisosId}/status` : url;

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
            <StyledLastestripeWrapper>
                <Lastestriper linjer={2} />
            </StyledLastestripeWrapper>
        );
    }

    return (
        <StyledLinkPanel border={false} onClick={onClick} href={linkpanelUrl}>
            <StyledLinkPanelDescription>
                <StyledFileIcon width="2rem" aria-hidden />
                <StyledSaksDetaljer>
                    <span>
                        <Label as="p" lang="no">
                            {oppdatertTittel}
                        </Label>
                        {!saksdetaljer || !saksdetaljer.status ? (
                            <Detail lang="no">
                                SENDT <DatoOgKlokkeslett tidspunkt={oppdatert} bareDato={true} />
                            </Detail>
                        ) : (
                            <SaksMetaData oppdatert={oppdatert} status={saksdetaljer.status} />
                        )}
                    </span>
                    <OppgaverTag antallNyeOppgaver={saksdetaljer?.antallNyeOppgaver} />
                    {isBroken && <VarselTrekant />}
                </StyledSaksDetaljer>
            </StyledLinkPanelDescription>
        </StyledLinkPanel>
    );
};

export default SakPanel;
