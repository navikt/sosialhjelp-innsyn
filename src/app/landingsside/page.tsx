import { notFound } from "next/navigation";
import { Heading } from "@navikt/ds-react";

import { getFlagServerSide } from "../featureTogglesServerSide";

const page = async () => {
    const toggle = await getFlagServerSide("sosialhjelp.innsyn.ny_landingsside");
    if (!toggle) {
        return notFound();
    }
    return <Heading size="xlarge">Hello world</Heading>;
};

export default page;
