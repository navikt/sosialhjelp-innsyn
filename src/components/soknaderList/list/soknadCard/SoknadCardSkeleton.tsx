import { Skeleton } from "@navikt/ds-react";

import DigisosLinkCard from "@components/statusCard/DigisosLinkCard";

const SoknadCardSkeleton = () => (
    <DigisosLinkCard
        href=""
        description={<Skeleton variant="text" width="40px" />}
        icon={<Skeleton variant="circle" height="64px" />}
    >
        <Skeleton variant="text" width="200px" />
    </DigisosLinkCard>
);

export default SoknadCardSkeleton;
