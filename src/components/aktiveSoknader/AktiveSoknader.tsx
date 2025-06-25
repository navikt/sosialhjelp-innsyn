import { Heading, VStack } from "@navikt/ds-react";
import { getTranslations } from "next-intl/server";
import * as R from "remeda";

import { hentAlleSaker } from "../../generated/ssr/saks-oversikt-controller/saks-oversikt-controller";
import fetchPaabegynteSaker from "../../api/fetch/paabegynteSoknader/fetchPaabegynteSoknader";
import fetchSoknadsdetaljer from "../../api/fetch/saksdetaljer/fetchSoknadsdetaljer";
import { ferdigbehandletAndOlderThan21Days, filterAndSort } from "../soknaderList/list/soknaderUtils";
import SoknaderList from "../soknaderList/list/SoknaderList";

import AktiveSoknaderEmptyState from "./AktiveSoknaderEmptyState";

export interface PaabegyntSoknad {
    eventTidspunkt: string;
    eventId: string;
    grupperingsId: string;
    tekst: string;
    link: string;
    sikkerhetsnivaa: number;
    sistOppdatert: string;
    isAktiv: boolean;
    soknadId: string;
}

const AktiveSoknader = async () => {
    const t = await getTranslations("AktiveSoknader");
    const [alleSakerResponse, paabegynteSaker] = await Promise.all([hentAlleSaker(), fetchPaabegynteSaker()]);

    const innsendteSoknader = alleSakerResponse.status === 200 ? alleSakerResponse.data : [];

    const soknadsdetaljerResponses = await Promise.all(fetchSoknadsdetaljer(innsendteSoknader));
    const soknadsdetaljer = soknadsdetaljerResponses
        .filter((response) => response.status === 200)
        .map((response) => response.data);

    const sorted = filterAndSort(
        innsendteSoknader,
        soknadsdetaljer,
        R.isNot(ferdigbehandletAndOlderThan21Days),
        paabegynteSaker
    );

    if (sorted.length === 0) {
        return <AktiveSoknaderEmptyState />;
    }

    return (
        <VStack gap="2">
            <Heading size="medium" level="2">
                {t("tittel")}
            </Heading>
            <SoknaderList soknader={sorted} />
        </VStack>
    );
};

export default AktiveSoknader;
