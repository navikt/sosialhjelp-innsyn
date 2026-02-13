"use client";

import { addDays } from "date-fns";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { SaksListeResponse } from "@generated/model";
import { SaksDetaljerResponse } from "@generated/model";
import { PaabegyntSoknad } from "@api/fetch/paabegynteSoknader/fetchPaabegynteSoknader";
import ExpandableList from "@components/showmore/ExpandableList";

import { umamiTrack } from "../../../app/umami";

import SoknadCard from "./soknadCard/SoknadCard";
import PaabegyntCard from "./soknadCard/status/PaabegyntCard";

interface Props {
    soknader: (PaabegyntSoknad | (Partial<SaksDetaljerResponse> & SaksListeResponse))[];
    labelledById: string;
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

const SoknaderList = ({ soknader, labelledById }: Props) => {
    const t = useTranslations("SoknaderList");

    // Denne skal bare tracke søknader som ligger under "Aktive saker"
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
        <ExpandableList id="soknader-list" items={soknader} showMoreSuffix={t("soknader")} labelledById={labelledById}>
            {(item, index, firstExpandedItemRef, itemsLimit) => (
                <li key={sakKey(item)} ref={index === itemsLimit ? firstExpandedItemRef : null} tabIndex={-1}>
                    {"fiksDigisosId" in item && <SoknadCard soknad={item} />}
                    {"soknadId" in item && (
                        <PaabegyntCard soknadId={item.soknadId} keptUntil={addDays(new Date(item.sistOppdatert), 21)} />
                    )}
                </li>
            )}
        </ExpandableList>
    );
};

export default SoknaderList;
