import React, {useEffect, useState} from "react";
import {useIntl} from "react-intl";
import {logButtonOrLinkClick} from "../../utils/amplitude";
import {Panel, Tabs} from "@navikt/ds-react";
import styled from "styled-components";
import {REST_STATUS} from "../../utils/restUtils";
import {useSelector} from "react-redux";
import {InnsynAppState} from "../../redux/reduxTypes";
import {ErrorColored} from "@navikt/ds-icons";

enum ARKFANER {
    HISTORIKK = "Historikk",
    VEDLEGG = "Vedlegg",
}

const StyledPanel = styled(Panel)<{hasError?: boolean}>`
    position: relative;
    margin-top: 2rem;
    padding: 1rem 0 0 0;
    border-color: ${(props) => (props.hasError ? "var(--a-red-500)" : "transparent")};

    @media screen and (min-width: 641px) {
        padding-left: 60px;
        padding-right: 80px;
        margin-top: 4rem;
    }
`;

const StyledErrorColored = styled(ErrorColored)`
    position: absolute;

    @media screen and (min-width: 641px) {
        top: 2rem;
        left: 1.5rem;
    }
    @media screen and (max-width: 640px) {
        top: 0.5rem;
        left: 0;
    }
`;

interface Props {
    historikkChildren: React.ReactNode;
    vedleggChildren: React.ReactNode;
}

const leserData = (restStatus: REST_STATUS): boolean => {
    return restStatus === REST_STATUS.INITIALISERT || restStatus === REST_STATUS.PENDING;
};

const ArkfanePanel: React.FC<Props> = (props) => {
    const intl = useIntl();
    const [valgtFane, setValgtFane] = React.useState<string>(ARKFANER.HISTORIKK);
    const [restStatusError, setRestStatusError] = useState(false);
    const {restStatus} = useSelector((state: InnsynAppState) => state.innsynsdata);

    useEffect(() => {
        if (!leserData(restStatus.hendelser) || !leserData(restStatus.vedlegg)) {
            if (restStatus.hendelser === REST_STATUS.FEILET || restStatus.vedlegg === REST_STATUS.FEILET) {
                setRestStatusError(true);
            }
        }
    }, [restStatus.hendelser, restStatus.vedlegg, restStatusError]);

    useEffect(() => {
        // Logg til amplitude når "dine vedlegg" blir trykket
        if (valgtFane === ARKFANER.VEDLEGG) {
            logButtonOrLinkClick("Dine vedlegg");
        }
    }, [valgtFane]);

    return (
        <StyledPanel hasError={restStatusError}>
            {restStatusError && <StyledErrorColored />}
            <Tabs onChange={setValgtFane} value={valgtFane}>
                <Tabs.List>
                    <Tabs.Tab value={ARKFANER.HISTORIKK} label={intl.formatMessage({id: "historikk.tittel"})} />
                    <Tabs.Tab value={ARKFANER.VEDLEGG} label={intl.formatMessage({id: "vedlegg.tittel"})} />
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
