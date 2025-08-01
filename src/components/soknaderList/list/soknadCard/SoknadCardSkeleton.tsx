import { Skeleton } from "@navikt/ds-react";

import StatusCard from "@components/statusCard/StatusCard";

const SoknadCardSkeleton = () => (
    <StatusCard
        href=""
        description={<Skeleton variant="text" width="40px" />}
        icon={<Skeleton variant="circle" height="64px" />}
    >
        <Skeleton variant="text" width="200px" />
    </StatusCard>
);

export default SoknadCardSkeleton;
