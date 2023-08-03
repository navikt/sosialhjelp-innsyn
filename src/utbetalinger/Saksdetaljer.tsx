import React from "react";
import {useHentAlleSaker, useHentSaksDetaljer} from "../../generated/saks-oversikt-controller/saks-oversikt-controller";
import {SaksListeResponse} from "../../generated/model";
import {StyledFileIcon, StyledLinkPanelDescription, StyledSaksDetaljer} from "../components/sakspanel/sakspanelStyles";
import SaksMetaData from "../components/sakspanel/SaksMetaData";
import {Detail, Label, LinkPanel} from "@navikt/ds-react";
import OppgaverTag from "../components/sakspanel/OppgaverTag";
import Lastestriper from "../components/lastestriper/Lasterstriper";
import styled from "styled-components";
import Link from "next/link";

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
                    <StyledDetail>Søknaden din</StyledDetail>
                    <Link href={"/" + fiksDigisosId + "/status"} legacyBehavior passHref>
                        <StyledLinkPanel border>
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
                    </Link>
                </>
            )}
        </>
    );
};

export default Saksdetaljer;
