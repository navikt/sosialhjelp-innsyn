import React from "react";
import {Accordion, BodyShort, Label} from "@navikt/ds-react";
import {logButtonOrLinkClick} from "../../utils/amplitude";

interface Props {
    tittel: string | React.ReactNode;
    underTittel: string | React.ReactNode;
    children: React.ReactNode;
}

const EkspanderbartIkonPanel: React.FC<Props> = ({tittel, underTittel, children}) => {
    return (
        <Accordion>
            <Accordion.Item>
                <Accordion.Header onClick={() => logButtonOrLinkClick("Dine oppgaver: Åpnet informasjons boks")}>
                    <div>
                        <Label>{tittel}</Label>
                        <BodyShort>{underTittel}</BodyShort>
                    </div>
                </Accordion.Header>
                <Accordion.Content>{children}</Accordion.Content>
            </Accordion.Item>
        </Accordion>
    );
};

export default EkspanderbartIkonPanel;
