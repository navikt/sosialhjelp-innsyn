import { notFound } from "next/navigation";

import { getFlagServerSide } from "../featureTogglesServerSide";

const page = async () => {
    const toggle = await getFlagServerSide("sosialhjelp.innsyn.ny_landingsside");
    if (!toggle) {
        return notFound();
    }
    return <div>Hello world</div>;
};

export default page;
