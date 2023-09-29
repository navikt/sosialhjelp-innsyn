import React from "react";
import {useHentKlager} from "../../generated/klage-controller/klage-controller";
import {NextPage} from "next";
import useFiksDigisosId from "../../hooks/useFiksDigisosId";
import Panel from "../panel/Panel";
import Lastestriper from "../lastestriper/Lasterstriper";
import Link from "next/link";
import {Button, Heading, List, Tag} from "@navikt/ds-react";
import styled from "styled-components";
import {KlageDtoStatus} from "../../generated/model";

interface Props {}

const StyledKlageList = styled(List)`
    border-bottom: 1px solid black;
    padding-bottom: 1rem;
`;

const InfoBoks = styled("p")`
    padding-top: 1rem;
    margin-bottom: 1.5rem;
    display: flex;
    flex-direction: column;
`;

const KlageHeader = styled("div")`
    display: flex;
    justify-content: space-between;
`;

const FilUrlBoks = styled("div")`
    margin-top: 1.5rem;
    display: flex;
    flex-direction: column;
`;

const statusToText: Record<KlageDtoStatus, string> = {
    [KlageDtoStatus.UNDER_BEHANDLING]: "Under behandling",
    [KlageDtoStatus.MOTTATT]: "Mottatt",
    [KlageDtoStatus.FERDIG_BEHANDLET]: "Ferdig behandlet",
    [KlageDtoStatus.SENDT]: "Sendt",
    [KlageDtoStatus.HOS_STATSFORVALTER]: "Hos statsforvalter",
};

const KlageSection: NextPage<Props> = ({}: Props): React.JSX.Element => {
    const fiksDigisosId = useFiksDigisosId();
    const {data, isLoading, error} = useHentKlager(fiksDigisosId);
    if (isLoading) {
        return (
            <Panel header="Dine klager">
                <Lastestriper />
            </Panel>
        );
    }
    return (
        <Panel header="Dine klager">
            {data && data.length > 0 && (
                <>
                    <StyledKlageList as="ul">
                        {data.map((klage) => (
                            <React.Fragment key={klage.klageUrl.id}>
                                <KlageHeader>
                                    <Heading level="4" size="small">
                                        Et eller annet
                                    </Heading>
                                    <Tag variant="info">{statusToText[klage.status]}</Tag>
                                </KlageHeader>
                                <FilUrlBoks>
                                    <Link href={klage.klageUrl.url}>Kvittering på klage ({klage.klageUrl.dato})</Link>
                                    {klage.nyttVedtakUrl && (
                                        <Link href={klage.nyttVedtakUrl.url}>
                                            Nytt vedtak ({klage.nyttVedtakUrl.dato})
                                        </Link>
                                    )}
                                </FilUrlBoks>
                            </React.Fragment>
                        ))}
                    </StyledKlageList>
                    {data.some((klage) => klage.status === KlageDtoStatus.UNDER_BEHANDLING) && (
                        <p>Kommunene kan ha ulik svartid, men du skal få svar innen rimelig tid.</p>
                    )}
                </>
            )}
            <InfoBoks>
                <AntallKlagerSendt antallKlager={data?.length ?? 0} />
                <Link href="https://www.nav.no/okonomisk-sosialhjelp#klage">Les mer om klageprosessen her</Link>
            </InfoBoks>
            <Link href={`/${fiksDigisosId}/klage/skjema`}>
                <Button>Start klage</Button>
            </Link>
        </Panel>
    );
};

const AntallKlagerSendt = ({antallKlager}: {antallKlager: number}): React.JSX.Element => {
    let tekst: string;
    if (antallKlager === 0) {
        tekst = "Ingen klage sendt";
    } else if (antallKlager === 1) {
        tekst = "1 klage er sendt";
    } else {
        tekst = `${antallKlager} klager er sendt`;
    }
    return <>{tekst}, du har tre uker klagefrist på vedtak.</>;
};

export default KlageSection;
