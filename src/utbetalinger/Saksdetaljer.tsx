import React from "react";
import {useHentAlleSaker, useHentSaksDetaljer} from "../generated/saks-oversikt-controller/saks-oversikt-controller";
import {SaksListeResponse} from "../generated/model";
import {Link} from "react-router-dom";
import {StyledFileIcon, StyledLinkPanelDescription, StyledSaksDetaljer} from "../components/sakspanel/sakspanelStyles";
import SaksMetaData from "../components/sakspanel/SaksMetaData";
import {Detail, Label, LinkPanel} from "@navikt/ds-react";
import OppgaverTag from "../components/sakspanel/OppgaverTag";
import Lastestriper from "../components/lastestriper/Lasterstriper";
import styled from "styled-components";
import {useTranslation} from "react-i18next";

const StyledLinkPanel = styled(LinkPanel)`
    &:focus {
        box-shadow: inset var(--a-shadow-focus);
    }
    .navds-link-panel__content {
        width: 100%;
    }
`;

const StyledDetail = styled(Detail)`
    margin-top: 1rem;
`;

const Saksdetaljer: React.FC<{fiksDigisosId: string}> = ({fiksDigisosId}) => {
    const {data: sak, isLoading: sakIsLoading} = useHentSaksDetaljer({id: fiksDigisosId});
    const {data: alleSaker, isLoading: isAlleSakerLoading} = useHentAlleSaker();

    const {t} = useTranslation("utbetalinger");

    const merOmSaken = alleSaker?.find((sak: SaksListeResponse) => {
        if (sak.fiksDigisosId === fiksDigisosId) {
            return sak;
        } else {
            return null;
        }
    });

    if (sakIsLoading || isAlleSakerLoading) {
        return <Lastestriper linjer={2} />;
    }
    return (
        <>
            {sak && merOmSaken && (
                <>
                    <StyledDetail>{t("soknadenDin")} </StyledDetail>
                    <StyledLinkPanel border to={"/" + fiksDigisosId + "/status"} forwardedAs={Link}>
                        <StyledLinkPanelDescription>
                            <StyledFileIcon aria-hidden />
                            <StyledSaksDetaljer>
                                <span>
                                    <SaksMetaData oppdatert={merOmSaken.sistOppdatert} status={sak.status} />
                                    <Label as="p">{sak.soknadTittel}</Label>
                                </span>
                                <OppgaverTag antallNyeOppgaver={sak.antallNyeOppgaver} />
                            </StyledSaksDetaljer>
                        </StyledLinkPanelDescription>
                    </StyledLinkPanel>
                </>
            )}
        </>
    );
};

export default Saksdetaljer;
