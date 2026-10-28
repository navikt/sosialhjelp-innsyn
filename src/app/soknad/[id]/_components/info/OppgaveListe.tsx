import { BodyShort, List } from "@navikt/ds-react";
import { ListItem } from "@navikt/ds-react/List";
import { useTranslations } from "next-intl";
import { ReactNode } from "react";

interface Props {
    oppgaver: { name: string; frist?: Date }[];
}

const OppgaveListe = ({ oppgaver }: Props) => {
    const t = useTranslations("SoknadInfoCard");

    return (
        <List>
            {oppgaver.map(({ name, frist }, index) => (
                <ListItem key={`${name}-${index}`}>
                    {frist ? (
                        t.rich("oppgave", {
                            bold: (chunks: ReactNode) => (
                                <BodyShort as="span" weight="semibold" lang="no">
                                    {chunks}
                                </BodyShort>
                            ),
                            name,
                            frist: new Date(frist),
                        })
                    ) : (
                        <BodyShort weight="semibold" lang="no">
                            {name}
                        </BodyShort>
                    )}
                </ListItem>
            ))}
        </List>
    );
};

export default OppgaveListe;
