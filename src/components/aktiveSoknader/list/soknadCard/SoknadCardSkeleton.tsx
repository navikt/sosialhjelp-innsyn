import { Skeleton } from "@navikt/ds-react";

import StatusCard from "../../statusCard/StatusCard";

const SoknadCardSkeleton = () => {
    return (
        <StatusCard
            description={<Skeleton variant="text" width="40px" />}
            icon={<Skeleton variant="circle" height="64px" />}
        >
            <Skeleton variant="text" width="200px" />
        </StatusCard>
    );
};

export default SoknadCardSkeleton;
