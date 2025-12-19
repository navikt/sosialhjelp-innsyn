"use client";

import * as R from "remeda";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { BodyShort, ReadMore } from "@navikt/ds-react";
import StatusAlert from "@components/alert/StatusAlert";
import { useGetOppgaverBetaSuspense } from "@generated/oppgave-controller-v-2/oppgave-controller-v-2";

interface Props {
    navKontor?: string;
}

const OppgaveAlert = ({ navKontor }: Props) => {
    const { id } = useParams<{ id: string }>();
    const t = useTranslations("OppgaveAlert");
    const { data } = useGetOppgaverBetaSuspense(id);
    if (data.every((oppgave) => oppgave.erLastetOpp)) {
        return null;
    }
    const firstDueDate = R.pipe(
        data,
        R.map(R.prop("innsendelsesfrist")),
        R.filter(R.isNonNullish),
        R.map((frist) => new Date(frist)),
        R.firstBy(R.identity())
    );
    return (
        <StatusAlert variant="warning" tittel={firstDueDate ? t("tittel", { frist: firstDueDate }) : null}>
            <BodyShort>
                {navKontor
                    ? t.rich("beskrivelse", {
                          norsk: (chunks) => {
                              return <span lang="no">{chunks}</span>;
                          },
                          navKontor,
                      })
                    : t("beskrivelseUtenNavkontor")}
            </BodyShort>
            <ReadMore header={t("readMore.tittel")}>{t("readMore.innhold")}</ReadMore>
        </StatusAlert>
    );
};

export default OppgaveAlert;
