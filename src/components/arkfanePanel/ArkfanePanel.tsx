import React, {useEffect} from "react";
import {FormattedMessage, useIntl} from "react-intl";
import {logButtonOrLinkClick} from "../../utils/amplitude";
import {Panel, Tabs} from "@navikt/ds-react";
import styled from "styled-components";
import {ErrorColored} from "@navikt/ds-icons";
import {useSelector} from "react-redux";
import {InnsynAppState} from "../../redux/reduxTypes";
import {REST_STATUS} from "../../utils/restUtils";

enum ARKFANER {
    HISTORIKK = "Historikk",
    VEDLEGG = "Vedlegg",
}

const StyledPanel = styled(Panel)<{error: boolean}>`
    position: relative;
    margin-top: 2rem;
    padding: 1rem 0 1rem 0;
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
    historikkChildren: React.ReactNode;
    vedleggChildren: React.ReactNode;
}

const restStatusError = (restStatus: REST_STATUS): boolean => {
    return (
        restStatus !== REST_STATUS.INITIALISERT && restStatus !== REST_STATUS.PENDING && restStatus !== REST_STATUS.OK
    );
};

const ArkfanePanel: React.FC<Props> = (props) => {
    const intl = useIntl();
    const [valgtFane, setValgtFane] = React.useState<string>(ARKFANER.HISTORIKK);
    const {restStatus} = useSelector((state: InnsynAppState) => state.innsynsdata);
    const hasError = restStatusError(restStatus.hendelser) || restStatusError(restStatus.vedlegg);

    useEffect(() => {
        // Logg til amplitude når "dine vedlegg" blir trykket
        if (valgtFane === ARKFANER.VEDLEGG) {
            logButtonOrLinkClick("Dine vedlegg");
        }
    }, [valgtFane]);

    return (
        <StyledPanel error={+hasError}>
            {hasError && <StyledErrorColored />}
            <Tabs onChange={setValgtFane} value={valgtFane}>
                <Tabs.List>
                    <Tabs.Tab value={ARKFANER.HISTORIKK} label={intl.formatMessage({id: "historikk.tittel"})} />
                    <Tabs.Tab value={ARKFANER.VEDLEGG} label={intl.formatMessage({id: "vedlegg.tittel"})} />
                </Tabs.List>
                <Tabs.Panel value={ARKFANER.HISTORIKK} className="navds-panel">
                    {restStatusError(restStatus.hendelser) && (
                        <StyledTextPlacement>
                            <FormattedMessage id="feilmelding.historikk_innlasting" />
                        </StyledTextPlacement>
                    )}
                    {props.historikkChildren}
                </Tabs.Panel>
                <Tabs.Panel value={ARKFANER.VEDLEGG} className="navds-panel">
                    {restStatusError(restStatus.vedlegg) && (
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
