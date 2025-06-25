import { notFound } from "next/navigation";

import { getFlag, getToggles } from "../../../../featuretoggles/unleash";

const Page = async () => {
    const toggle = getFlag("sosialhjelp.innsyn.ny_soknadside", await getToggles());
    if (!toggle.enabled) {
        return notFound();
    }

    return <div>Hello world! This is the new application page.</div>;
};

export default Page;
