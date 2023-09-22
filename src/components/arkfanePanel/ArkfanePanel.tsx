import React, {useEffect} from "react";
import {logButtonOrLinkClick} from "../../utils/amplitude";
import {Panel, Tabs} from "@navikt/ds-react";
import styled from "styled-components";
import {useTranslation} from "next-i18next";
import {ErrorColored} from "@navikt/ds-icons";
import {useHentHendelser} from "../../../generated/hendelse-controller/hendelse-controller";
import useFiksDigisosId from "../../hooks/useFiksDigisosId";
import {useHentVedlegg} from "../../../generated/vedlegg-controller/vedlegg-controller";

enum ARKFANER {
    HISTORIKK = "Historikk",
    VEDLEGG = "Vedlegg",
}

const StyledPanel = styled(Panel)<{$hasError: boolean}>`
    position: relative;
    margin-top: 2rem;
    padding: 1rem 0 1rem 0;
    border-color: ${(props) => (props.$hasError ? "var(--a-red-500)" : "transparent")};

    @media screen and (min-width: 641px) {
        padding-left: 60px;
        padding-right: 80px;
        margin-top: 3rem;
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

interface Props {
    historikkChildren: React.ReactNode;
    vedleggChildren: React.ReactNode;
}

const ArkfanePanel: React.FC<Props> = (props) => {
    const fiksDigisosId = useFiksDigisosId();
    const {t} = useTranslation();
    const [valgtFane, setValgtFane] = React.useState<string>(ARKFANER.HISTORIKK);
    const hendelserHasError = useHentHendelser(fiksDigisosId).isError;
    const vedleggHasError = useHentVedlegg(fiksDigisosId).isError;

    const hasError =
        (valgtFane === ARKFANER.HISTORIKK && hendelserHasError) || (valgtFane === ARKFANER.VEDLEGG && vedleggHasError);
    useEffect(() => {
        // Logg til amplitude når "dine vedlegg" blir trykket
        if (valgtFane === ARKFANER.VEDLEGG) {
            logButtonOrLinkClick("Dine vedlegg");
        }
    }, [valgtFane]);

    return (
        <StyledPanel $hasError={hasError}>
            {hasError && <StyledErrorColored title="Feil" />}
            <Tabs onChange={setValgtFane} value={valgtFane}>
                <Tabs.List>
                    <Tabs.Tab value={ARKFANER.HISTORIKK} label={t("historikk.tittel")} />
                    <Tabs.Tab value={ARKFANER.VEDLEGG} label={t("vedlegg.tittel")} />
                </Tabs.List>
                <Tabs.Panel value={ARKFANER.HISTORIKK} className="navds-panel">
                    {props.historikkChildren}
                </Tabs.Panel>
                <Tabs.Panel value={ARKFANER.VEDLEGG} className="navds-panel">
                    {props.vedleggChildren}
                </Tabs.Panel>
            </Tabs>
        </StyledPanel>
    );
};

export default ArkfanePanel;
