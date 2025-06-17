import { Heading, VStack } from "@navikt/ds-react";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import * as R from "remeda";
import { logger } from "@navikt/next-logger";

import {
    getSaksDetaljer,
    getSaksDetaljerResponse,
    hentAlleSaker,
} from "../../generated/ssr/saks-oversikt-controller/saks-oversikt-controller";
import { SaksListeResponse } from "../../generated/model";
import { getServerEnv } from "../../config/env";
import exchangedFetch from "../../api/ssr/exchangedFetch";

import AktiveSoknaderList from "./list/AktiveSoknaderList";
import AktiveSoknaderListSkeleton from "./list/AktiveSoknaderListSkeleton";
import AktiveSoknaderEmptyState from "./AktiveSoknaderEmptyState";

export interface PaabegyntSak {
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

const fetchSaksDetaljer = (saker: SaksListeResponse[]): Promise<getSaksDetaljerResponse>[] =>
    // TODO: Filteret her tror jeg ikke trengs, da fiksDigisosId alltid skal være satt. Se TODO i innsyn-api.
    R.pipe(
        saker,
        R.filter((sak) => !!sak.fiksDigisosId),
        R.map((sak) => getSaksDetaljer(sak.fiksDigisosId!))
    );

const fetchPaabegynteSaker = async (): Promise<PaabegyntSak[]> => {
    if (getServerEnv().NEXT_PUBLIC_RUNTIME_ENVIRONMENT === "local") {
        return Promise.resolve([]);
    }
    try {
        return exchangedFetch<PaabegyntSak[]>(
            "/dittnav/pabegynte/aktive",
            getServerEnv().SOKNAD_API_HOSTNAME,
            "/sosialhjelp/soknad-api"
        );
    } catch (e: unknown) {
        logger.error(`Feil ved henting av paabegynte saker ${e}`);
        return Promise.resolve([]);
    }
};

const AktiveSoknader = async () => {
    const t = await getTranslations("AktiveSoknader");
    const [alleSakerResponse, paabegynteSaker] = await Promise.all([hentAlleSaker(), fetchPaabegynteSaker()]);

    if (alleSakerResponse.status !== 200) {
        logger.error(
            `Fikk feil ved henting av saker. Status: ${alleSakerResponse.status}. Data: ${alleSakerResponse.data}`
        );
    }

    const alleSaker = alleSakerResponse.status === 200 ? alleSakerResponse.data : [];
    const totaltAntallSaker = alleSaker.length + paabegynteSaker.length;
    if (totaltAntallSaker === 0) {
        return <AktiveSoknaderEmptyState />;
    }

    const promises = Promise.all(fetchSaksDetaljer(alleSaker));

    return (
        <VStack gap="2">
            <Heading size="medium" level="2">
                {t("tittel")}
            </Heading>
            <Suspense fallback={<AktiveSoknaderListSkeleton count={totaltAntallSaker} />}>
                <AktiveSoknaderList saker={alleSaker} paabegynteSaker={paabegynteSaker} saksdetaljer={promises} />
            </Suspense>
        </VStack>
    );
};

export default AktiveSoknader;
