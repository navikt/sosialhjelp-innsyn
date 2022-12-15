import React, {useEffect} from "react";
import DatoOgKlokkeslett from "../../components/tidspunkt/DatoOgKlokkeslett";
import {useDispatch} from "react-redux";
import Lastestriper from "../../components/lastestriper/Lasterstriper";
import {hentSaksdetaljer} from "../../redux/innsynsdata/innsynsDataActions";
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
    fiksDigisosId: string | null;
    tittel: string;
    status: string;
    oppdatert: string;
    key: string;
    url: string;
    kilde: string;
    antallNyeOppgaver?: number;
    harBlittLastetInn?: boolean;
}

const SakPanel: React.FC<Props> = ({
    fiksDigisosId,
    tittel,
    status,
    oppdatert,
    url,
    kilde,
    antallNyeOppgaver,
    harBlittLastetInn,
}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const linkpanelUrl = fiksDigisosId ? `/sosialhjelp/innsyn/${fiksDigisosId}/status` : url;

    const onClick = (event: any) => {
        if (event.isDefaultPrevented() || event.metaKey || event.ctrlKey) {
            return;
        }
        if (kilde === "soknad-api") {
            window.location.href = url;
        } else if (kilde === "innsyn-api") {
            navigate(`/innsyn/${fiksDigisosId}/status`);
            event.preventDefault();
        } else {
            // do nothing?
        }
    };

    let underLasting = fiksDigisosId ? !harBlittLastetInn : false;
    let requestId = fiksDigisosId ?? "";

    useEffect(() => {
        if (kilde === "innsyn-api") {
            dispatch(hentSaksdetaljer(requestId, false));
        }
    }, [dispatch, requestId, kilde]);

    if (underLasting) {
        return (
            <StyledLastestripeWrapper>
                <Lastestriper linjer={2} />
            </StyledLastestripeWrapper>
        );
    }
    return (
        <StyledLinkPanel border={false} onClick={onClick} href={linkpanelUrl}>
            <StyledLinkPanelDescription>
                <StyledFileIcon width="2rem" />
                <StyledSaksDetaljer>
                    <span>
                        {fiksDigisosId === null ? (
                            <Detail>
                                SENDT <DatoOgKlokkeslett tidspunkt={oppdatert} bareDato={true} />
                            </Detail>
                        ) : (
                            <SaksMetaData oppdatert={oppdatert} status={status} />
                        )}
                        <Label as="p">{tittel}</Label>
                    </span>
                    <OppgaverTag antallNyeOppgaver={antallNyeOppgaver} />
                </StyledSaksDetaljer>
            </StyledLinkPanelDescription>
        </StyledLinkPanel>
    );
};

export default SakPanel;
