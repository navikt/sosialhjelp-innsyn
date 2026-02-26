"use client";

import { InfoCard } from "@navikt/ds-react";
import { InfoCardContent, InfoCardHeader, InfoCardTitle } from "@navikt/ds-react/InfoCard";
import { PropsWithChildren } from "react";
import { CheckmarkCircleIcon, ExclamationmarkTriangleIcon, InformationSquareIcon } from "@navikt/aksel-icons";

interface Props {
    title: string;
    variant: "info" | "warning" | "success";
    titleId: string;
}

const Icon = ({ variant }: Pick<Props, "variant">) => {
    switch (variant) {
        case "info":
            return <InformationSquareIcon aria-hidden />;
        case "warning":
            return <ExclamationmarkTriangleIcon aria-hidden />;
        case "success":
            return <CheckmarkCircleIcon aria-hidden />;
    }
};

const Info = ({ title, children, variant, titleId }: PropsWithChildren<Props>) => (
    <InfoCard as="section" data-color={variant} aria-labelledby={titleId}>
        <InfoCardHeader icon={<Icon variant={variant} />}>
            <InfoCardTitle id={titleId} as="h2">
                {title}
            </InfoCardTitle>
        </InfoCardHeader>
        {children && <InfoCardContent>{children}</InfoCardContent>}
    </InfoCard>
);

export default Info;
