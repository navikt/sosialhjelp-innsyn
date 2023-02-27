import React, {useEffect, useState} from "react";
import {FormattedMessage, useIntl} from "react-intl";
import {logButtonOrLinkClick} from "../../utils/amplitude";
import {Panel, Tabs} from "@navikt/ds-react";
import styled from "styled-components";
import {ErrorColored} from "@navikt/ds-icons";
import {useHentHendelser} from "../../generated/hendelse-controller/hendelse-controller";
import {useHentVedlegg} from "../../generated/vedlegg-controller/vedlegg-controller";

enum ARKFANER {
    HISTORIKK = "Historikk",
    VEDLEGG = "Vedlegg",
}

const StyledPanel = styled(Panel)<{error: boolean}>`
    position: relative;
    margin-top: 2rem;
    padding: 1rem 0 0 0;
    border-color: ${(props) => (props.error ? "var(--a-red-500)" : "transparent")};

    @media screen and (min-width: 641px) {
        padding-left: 60px;
        padding-right: 80px;
        margin-top: 4rem;
    }
`;

const StyledErrorColored = styled(ErrorColored)`
    position: absolute;
    @media screen and (min-width: 641px) {
        top: 5.15rem;
        left: 1.5rem;
    }
    @media screen and (max-width: 640px) {
        top: 5.15rem;
        left: 1rem;
    }
`;

const StyledTextPlacement = styled.div`
    margin-bottom: 1rem;
    @media screen and (max-width: 640px) {
        margin-left: 2rem;
    }
`;

interface Props {
    fiksDigisosId: string;
    historikkChildren: React.ReactNode;
    vedleggChildren: React.ReactNode;
}

const ArkfanePanel: React.FC<Props> = (props) => {
    const intl = useIntl();
    const [valgtFane, setValgtFane] = React.useState<string>(ARKFANER.HISTORIKK);
    const [LoadingResourscesError, setLoadingResourscesError] = useState(false);
    const {isError: hendelserError} = useHentHendelser(props.fiksDigisosId);
    const {isError: vedleggError} = useHentVedlegg(props.fiksDigisosId);

    useEffect(() => {
        if (hendelserError || vedleggError) {
            setLoadingResourscesError(true);
        }
    }, [hendelserError, vedleggError, LoadingResourscesError]);

    useEffect(() => {
        // Logg til amplitude når "dine vedlegg" blir trykket
        if (valgtFane === ARKFANER.VEDLEGG) {
            logButtonOrLinkClick("Dine vedlegg");
        }
    }, [valgtFane]);

    return (
        <StyledPanel error={+LoadingResourscesError}>
            {LoadingResourscesError && <StyledErrorColored />}
            <Tabs onChange={setValgtFane} value={valgtFane}>
                <Tabs.List>
                    <Tabs.Tab value={ARKFANER.HISTORIKK} label={intl.formatMessage({id: "historikk.tittel"})} />
                    <Tabs.Tab value={ARKFANER.VEDLEGG} label={intl.formatMessage({id: "vedlegg.tittel"})} />
                </Tabs.List>
                <Tabs.Panel value={ARKFANER.HISTORIKK} className="navds-panel">
                    {hendelserError && (
                        <StyledTextPlacement>
                            <FormattedMessage id="feilmelding.historikk_innlasting" />
                        </StyledTextPlacement>
                    )}
                    {props.historikkChildren}
                </Tabs.Panel>
                <Tabs.Panel value={ARKFANER.VEDLEGG} className="navds-panel">
                    {vedleggError && (
                        <StyledTextPlacement>
                            <FormattedMessage id="feilmelding.vedlegg_innlasting" />
                        </StyledTextPlacement>
                    )}
                    {props.vedleggChildren}
                </Tabs.Panel>
            </Tabs>
        </StyledPanel>
    );
};

export default ArkfanePanel;
