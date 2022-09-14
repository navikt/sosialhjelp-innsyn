import React, {useEffect} from "react";
import DatoOgKlokkeslett from "../components/tidspunkt/DatoOgKlokkeslett";
import "../saksoversikt/sakpanel/sakpanel.css";
import {FormattedMessage} from "react-intl";
import {useDispatch} from "react-redux";
import Lastestriper from "../components/lastestriper/Lasterstriper";
import {hentSaksdetaljer} from "../redux/innsynsdata/innsynsDataActions";
import {Detail, Label, LinkPanel, Tag} from "@navikt/ds-react";
import styled from "styled-components";
import {FileContent} from "@navikt/ds-icons";
import {push} from "connected-react-router";

const StyledLinkPanel = styled(LinkPanel)`
    .navds-link-panel__content {
        flex-grow: 1;
        width: fit-content;
    }
`;
const StyledLinkPanelDescription = styled(LinkPanel.Description)`
    display: flex;
    gap: 0.5rem;
    width: 100%;
    align-items: center;
    justify-content: space-between;

    @media screen and (max-width: 900px) {
        flex-wrap: wrap;
    }
`;
const StyledIcon = styled(FileContent)`
    width: 2rem;
    @media screen and (max-width: 340px) {
        display: none;
    }
`;
const StyledTag = styled(Tag)`
    white-space: nowrap;

    margin-left: auto;
    @media screen and (max-width: 900px) {
    }
`;

const FlexWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
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

    const onClick = (event: any) => {
        // Fra tidligere kommentar: skal fikse problem med command-click
        if (event.isDefaultPrevented() || event.metaKey || event.ctrlKey) {
            return;
        }

        dispatch(push("/innsyn/" + fiksDigisosId + "/status"));
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
                <FlexWrapper>
                    <StyledIcon />
                    <span>
                        <Detail as="span">{status}</Detail>
                        <span aria-hidden="true"> ● </span>
                        <Detail as="span">
                            oppdatert <DatoOgKlokkeslett tidspunkt={oppdatert} bareDato={true} />
                        </Detail>
                        <Label as="p">{tittel}</Label>
                    </span>
                </FlexWrapper>
                {antallNyeOppgaver !== undefined && antallNyeOppgaver >= 1 && (
                    <StyledTag variant="warning">
                        <FormattedMessage id="saker.oppgave" />
                    </StyledTag>
                )}
            </StyledLinkPanelDescription>
        </StyledLinkPanel>
    );
};

export default SaksPanelUtbetalinger;
