import React from "react";
import fetchAlleSoknader from "@api/fetch/alleSoknader/fetchAlleSoknader";
import fetchPaabegynteSaker from "@api/fetch/paabegynteSoknader/fetchPaabegynteSoknader";
import fetchSoknadsdetaljer from "@api/fetch/saksdetaljer/fetchSoknadsdetaljer";
import { combineAndPartition } from "@components/soknaderList/list/soknaderUtils";
import AktiveSoknader from "@components/soknader/aktiveSoknader/AktiveSoknader";
import TidligereSoknader from "@components/soknader/TidligereSoknader";
import AktiveSoknaderEmptyState from "@components/soknader/aktiveSoknader/AktiveSoknaderEmptyState";

interface Props {
    hideInactive?: boolean;
}

const Soknader = async ({ hideInactive }: Props): Promise<React.JSX.Element> => {
    const [innsendteSoknader, paabegynteSaker] = await Promise.all([fetchAlleSoknader(), fetchPaabegynteSaker()]);
    const soknadsdetaljer = await Promise.all(fetchSoknadsdetaljer(innsendteSoknader));
    const [active, inactive] = combineAndPartition(innsendteSoknader, soknadsdetaljer);
    const activeAndStarted = [...active, ...(paabegynteSaker ?? [])];
    const soknadCount = activeAndStarted.length + inactive.length;

    if (soknadCount === 0) {
        return <AktiveSoknaderEmptyState />;
    }

    return (
        <>
            <AktiveSoknader soknader={active} />
            {!hideInactive && <TidligereSoknader soknader={inactive} />}
        </>
    );
};

export default Soknader;
