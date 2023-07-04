import React, {useMemo} from "react";
import DatoOgKlokkeslett from "../../components/tidspunkt/DatoOgKlokkeslett";
import Lastestriper from "../../components/lastestriper/Lasterstriper";
import {Detail, Label, LinkPanel, Panel} from "@navikt/ds-react";
import styled, {css} from "styled-components/macro";
import OppgaverTag from "../../components/sakspanel/OppgaverTag";
import SaksMetaData from "../../components/sakspanel/SaksMetaData";
import {
    StyledFileIcon,
    StyledLinkPanelDescription,
    StyledSaksDetaljer,
} from "../../components/sakspanel/sakspanelStyles";
import {useNavigate} from "react-router-dom";
import {useHentSaksDetaljer} from "../../generated/saks-oversikt-controller/saks-oversikt-controller";
import {useTranslation} from "react-i18next";

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

interface Props {
    fiksDigisosId?: string;
    tittel: string;
    oppdatert: string;
    url: string | undefined;
    kilde: string;
}

const SakPanel: React.FC<Props> = ({fiksDigisosId, tittel, oppdatert, url, kilde}) => {
    const {data: saksdetaljer, isInitialLoading} = useHentSaksDetaljer(
        {id: fiksDigisosId!},
        {query: {enabled: kilde === "innsyn-api" && !!fiksDigisosId}}
    );
    const navigate = useNavigate();
    const {t} = useTranslation();
    const linkpanelUrl = fiksDigisosId ? `/sosialhjelp/innsyn/${fiksDigisosId}/status` : url;

    const oppdatertTittel = useMemo(() => {
        if (saksdetaljer && saksdetaljer.soknadTittel?.length > 0) {
            return saksdetaljer.soknadTittel;
        }
        return tittel && tittel !== "saker.default_tittel" ? tittel : t("saker.default_tittel");
    }, [saksdetaljer, tittel, t]);

    const onClick = (event: any) => {
        if (event.isDefaultPrevented() || event.metaKey || event.ctrlKey) {
            return;
        }
        if (kilde === "soknad-api") {
            window.location.href = url!;
        } else if (kilde === "innsyn-api") {
            navigate(`/${fiksDigisosId}/status`);
            event.preventDefault();
        }
    };
    if (isInitialLoading) {
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
                        {!saksdetaljer ? (
                            <Detail>
                                SENDT <DatoOgKlokkeslett tidspunkt={oppdatert} bareDato={true} />
                            </Detail>
                        ) : (
                            <SaksMetaData oppdatert={oppdatert} status={saksdetaljer.status} />
                        )}
                        <Label as="p">{oppdatertTittel}</Label>
                    </span>
                    <OppgaverTag antallNyeOppgaver={saksdetaljer?.antallNyeOppgaver} />
                </StyledSaksDetaljer>
            </StyledLinkPanelDescription>
        </StyledLinkPanel>
    );
};

export default SakPanel;
