"use client";

import { useTranslations } from "next-intl";
import { LinkCardFooter } from "@navikt/ds-react/LinkCard";

import StatusCard from "./status/StatusCard";
import Tags from "@components/tags/Tags";
import { InnsendtSoknad } from "@components/soknaderList/list/soknaderUtils";
import TagsContextProvider from "@components/tags/TagsContextProvider";

interface Props {
    soknad: InnsendtSoknad;
}

const SoknadCard = ({ soknad }: Props) => {
    const t = useTranslations("SoknadCard");
    const id = soknad.fiksDigisosId!;
    const sakTittel = soknad.soknadTittel?.length ? soknad.soknadTittel : t("defaultTittel");
    const sendtDato = soknad.soknadOpprettet ? new Date(soknad.soknadOpprettet) : undefined; // Kun satt ved digital søknad
    const mottattDato = soknad.mottattTidspunkt ? new Date(soknad.mottattTidspunkt) : undefined;
    const ariaTittel = t("ariaTittel", {
        dato: sendtDato || mottattDato || "",
    });
    return (
        <StatusCard id={id} tittel={sakTittel} ariaTittel={ariaTittel}>
            <LinkCardFooter>
                <TagsContextProvider size="small">
                    <Tags soknad={soknad} />
                </TagsContextProvider>
            </LinkCardFooter>
        </StatusCard>
    );
};

export default SoknadCard;
