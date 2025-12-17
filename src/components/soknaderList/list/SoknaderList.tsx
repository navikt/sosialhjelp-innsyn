"use client";

import { addDays } from "date-fns";
import { Fragment, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Box, Button } from "@navikt/ds-react";
import { ChevronDownIcon, ChevronUpIcon } from "@navikt/aksel-icons";

import { SaksListeResponse } from "@generated/model";
import { SaksDetaljerResponse } from "@generated/model";
import useShowMore, { ITEMS_LIMIT } from "@hooks/useShowMore";
import { PaabegyntSoknad } from "@api/fetch/paabegynteSoknader/fetchPaabegynteSoknader";

import { umamiTrack } from "../../../app/umami";

import SoknadCard from "./soknadCard/SoknadCard";
import PaabegyntCard from "./soknadCard/status/PaabegyntCard";

interface Props {
    soknader: (PaabegyntSoknad | (Partial<SaksDetaljerResponse> & SaksListeResponse))[];
}

const sakKey = (sak: PaabegyntSoknad | (Partial<SaksDetaljerResponse> & SaksListeResponse)): string => {
    if ("fiksDigisosId" in sak) {
        return sak.fiksDigisosId;
    }
    if ("soknadId" in sak) {
        return sak.soknadId;
    }
    // Fallback, bør ikke skje
    return Math.random().toString(36).substring(2, 15);
};

const SoknaderList = ({ soknader }: Props) => {
    const t = useTranslations("AktiveSoknader");
    const { hasMore, showAll, setShowAll } = useShowMore(soknader);
    // Denne skal bare tracke søknader som ligger under "Aktive søknader"
    // med dokumentasjonetterspurt, så lenge tilfellene er oppfylt.
    useEffect(() => {
        const antallMedDokumentasjonEtterspurt = soknader.filter(
            (soknad) =>
                "status" in soknad && soknad.status === "UNDER_BEHANDLING" && soknad.dokumentasjonEtterspurt === true
        ).length;

        if (antallMedDokumentasjonEtterspurt > 0) {
            umamiTrack("Side rendret", {
                tekst: "Søknad med dokumentasjonetterspurt",
                antall: antallMedDokumentasjonEtterspurt,
            });
        }
    }, [soknader]);
    return (
        <>
            {soknader.slice(0, showAll ? soknader.length : ITEMS_LIMIT).map((soknad) => (
                <Fragment key={sakKey(soknad)}>
                    {"fiksDigisosId" in soknad && <SoknadCard key={soknad.fiksDigisosId} soknad={soknad} />}
                    {"soknadId" in soknad && (
                        <PaabegyntCard
                            soknadId={soknad.soknadId}
                            keptUntil={addDays(new Date(soknad.sistOppdatert), 21)}
                            key={soknad.sistOppdatert}
                        />
                    )}
                </Fragment>
            ))}
            {hasMore && (
                <Box className="self-start">
                    {!showAll && (
                        <Button onClick={() => setShowAll(true)} variant="tertiary" icon={<ChevronDownIcon />}>
                            {t("visFlere")} ({soknader.length - ITEMS_LIMIT})
                        </Button>
                    )}
                    {showAll && (
                        <Button onClick={() => setShowAll(false)} variant="tertiary" icon={<ChevronUpIcon />}>
                            {t("visFærre")}
                        </Button>
                    )}
                </Box>
            )}
        </>
    );
};

export default SoknaderList;
