import React, {useEffect} from "react";
import {useDispatch} from "react-redux";
import Lastestriper from "../components/lastestriper/Lasterstriper";
import {hentSaksdetaljer} from "../redux/innsynsdata/innsynsDataActions";
import {Label, LinkPanel} from "@navikt/ds-react";
import styled from "styled-components";
import OppgaverTag from "../components/sakspanel/OppgaverTag";
import SaksMetaData from "../components/sakspanel/SaksMetaData";
import {StyledLinkPanelDescription, StyledFileIcon, StyledSaksDetaljer} from "../components/sakspanel/sakspanelStyles";
import {Link} from "react-router-dom";

const StyledLinkPanel = styled(LinkPanel)`
    &:focus {
        box-shadow: inset var(--a-shadow-focus);
    }
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

    useEffect(() => {
        dispatch(hentSaksdetaljer(fiksDigisosId, false));
    }, [dispatch, fiksDigisosId]);

    if (!harBlittLastetInn) {
        return <Lastestriper linjer={2} />;
    }
    return (
        <StyledLinkPanel border to={"/" + fiksDigisosId + "/status"} forwardedAs={Link}>
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
