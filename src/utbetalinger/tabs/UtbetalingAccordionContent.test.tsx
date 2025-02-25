import { render } from "@testing-library/react";
import { Accordion } from "@navikt/ds-react";

import { UtbetalingAccordionContent } from "./UtbetalingAccordionContent";

describe("UtbetalingAccordionContent", () => {
    it("matches snapshot with annenMottaker", () =>
        expect(
            render(
                <Accordion>
                    <Accordion.Item>
                        <UtbetalingAccordionContent
                            fom="2022-01-01"
                            tom="2022-01-31"
                            mottaker="Ola Nordmann"
                            annenMottaker={true}
                            utbetalingsmetode="BANK"
                            kontonummer="1234 56 78901"
                            fiksDigisosId="123"
                        />
                    </Accordion.Item>
                </Accordion>
            ).asFragment()
        ).toMatchSnapshot());
});
