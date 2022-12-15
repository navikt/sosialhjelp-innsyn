import React, {useEffect} from "react";
import {useDispatch} from "react-redux";
import Lastestriper from "../components/lastestriper/Lasterstriper";
import {hentSaksdetaljer} from "../redux/innsynsdata/innsynsDataActions";
import {Label, LinkPanel} from "@navikt/ds-react";
import styled from "styled-components";
import OppgaverTag from "../components/sakspanel/OppgaverTag";
import SaksMetaData from "../components/sakspanel/SaksMetaData";
import {StyledLinkPanelDescription, StyledFileIcon, StyledSaksDetaljer} from "../components/sakspanel/sakspanelStyles";
import {useNavigate} from "react-router-dom";

const StyledLinkPanel = styled(LinkPanel)`
    .navds-link-panel__content {
        width: 100%;
    }
`;

interface Props {
    fiksDigisosId: string;
    tittel: string;
    status: string;
    oppdatert: string;
    key: string;
    antallNyeOppgaver?: number;
    harBlittLastetInn?: boolean;
    border?: boolean;
}

const SaksPanelUtbetalinger: React.FC<Props> = ({
    fiksDigisosId,
    tittel,
    status,
    oppdatert,
    antallNyeOppgaver,
    harBlittLastetInn,
}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const onClick = (event: any) => {
        // Fra tidligere kommentar: skal fikse problem med command-click
        if (event.isDefaultPrevented() || event.metaKey || event.ctrlKey) {
            return;
        }

        navigate("/innsyn/" + fiksDigisosId + "/status");
        event.preventDefault();
    };

    useEffect(() => {
        dispatch(hentSaksdetaljer(fiksDigisosId, false));
    }, [dispatch, fiksDigisosId]);

    if (!harBlittLastetInn) {
        return <Lastestriper linjer={2} />;
    }
    return (
        <StyledLinkPanel border onClick={onClick} href={"/sosialhjelp/innsyn/" + fiksDigisosId + "/status"}>
            <StyledLinkPanelDescription>
                <StyledFileIcon />
                <StyledSaksDetaljer>
                    <span>
                        <SaksMetaData oppdatert={oppdatert} status={status} />
                        <Label as="p">{tittel}</Label>
                    </span>
                    <OppgaverTag antallNyeOppgaver={antallNyeOppgaver} />
                </StyledSaksDetaljer>
            </StyledLinkPanelDescription>
        </StyledLinkPanel>
    );
};

export default SaksPanelUtbetalinger;
