import "@testing-library/jest-dom";
import React from "react";
import {render} from "../test/test-utils";
import {IngenUtbetalingsoversikt} from "./IngenUtbetalingsoversikt";

// test("Viser riktig feilmelding dersom ingen saker", async () => {
//     render(
//         <IngenUtbetalingsoversikt
//             harSoknaderMedInnsyn={true}
//             lasterSoknaderMedInnsyn={true}
//             harSaker={false}
//             leserData={false}
//         />
//     );
//
//     expect(screen.getByText("Vi finner ingen utbetalinger for økonomisk sosialhjelp")).toBeVisible();
// });
//
// test("Viser riktig feilmelding dersom ingen saker med innsyn", async () => {
//     render(
//         <IngenUtbetalingsoversikt
//             harSoknaderMedInnsyn={false}
//             lasterSoknaderMedInnsyn={false}
//             harSaker={true}
//             leserData={true}
//         />
//     );
//
//     expect(screen.getByText("Vi kan ikke vise dine utbetalinger for økonomisk sosialhjelp")).toBeVisible();
// });
//
// test("Viser riktig feilmelding dersom både harSaker og harSoknaderMedInnsyn er false", async () => {
//     render(
//         <IngenUtbetalingsoversikt
//             harSoknaderMedInnsyn={false}
//             lasterSoknaderMedInnsyn={false}
//             harSaker={false}
//             leserData={false}
//         />
//     );
//
//     expect(screen.getByText("Vi finner ingen utbetalinger for økonomisk sosialhjelp")).toBeVisible();
// });

test("Rendrer ikke feilmelding dersom vi leser data", async () => {
    const {container} = render(
        <IngenUtbetalingsoversikt
            harSoknaderMedInnsyn={false}
            lasterSoknaderMedInnsyn={true}
            harSaker={false}
            leserData={true}
        />
    );

    expect(container).toBeEmptyDOMElement();
});
