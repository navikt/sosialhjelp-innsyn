import React from "react";
import { Tabs } from "@navikt/ds-react";
import styled from "styled-components";
import { useTranslations } from "next-intl";
import { XMarkOctagonIcon } from "@navikt/aksel-icons";

import { useHentHendelser } from "../../generated/hendelse-controller/hendelse-controller";
import useFiksDigisosId from "../../hooks/useFiksDigisosIdDepricated";
import { useHentVedlegg } from "../../generated/vedlegg-controller/vedlegg-controller";
import Panel from "../panel/Panel";

enum ARKFANER {
    HISTORIKK = "Historikk",
    VEDLEGG = "Vedlegg",
}

const StyledErrorColored = styled(XMarkOctagonIcon)`
    position: absolute;
    color: var(--a-red-500);
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

const ArkfanePanel = (props: Props) => {
    const fiksDigisosId = useFiksDigisosId();
    const t = useTranslations("common");
    const [valgtFane, setValgtFane] = React.useState<string>(ARKFANER.HISTORIKK);
    const hendelserHasError = useHentHendelser(fiksDigisosId).isError;
    const vedleggHasError = useHentVedlegg(fiksDigisosId).isError;
    const hasError =
        (valgtFane === ARKFANER.HISTORIKK && hendelserHasError) || (valgtFane === ARKFANER.VEDLEGG && vedleggHasError);

    return (
        <Panel hasError={hasError}>
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
        </Panel>
    );
};

export default ArkfanePanel;
