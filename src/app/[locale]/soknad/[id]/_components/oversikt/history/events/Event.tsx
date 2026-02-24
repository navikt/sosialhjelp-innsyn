import React, { forwardRef, PropsWithChildren, ReactNode, Ref } from "react";
import { Process } from "@navikt/ds-react/Process";
import { useFormatter } from "next-intl";
import { CheckmarkHeavyIcon } from "@navikt/aksel-icons";
import { Skeleton } from "@navikt/ds-react";

interface Props {
    title: ReactNode;
    timestamp?: Date;
}

const Event = (
    { timestamp, title, children }: PropsWithChildren<Props>,
    ref: Ref<HTMLLIElement>
): React.JSX.Element => {
    const format = useFormatter();
    return (
        <Process.Event
            // @ts-expect-error Title er typa som string, men brukes som ReactNode inni komponenten.
            title={title}
            ref={ref}
            tabIndex={-1}
            status="completed"
            bullet={<CheckmarkHeavyIcon aria-hidden />}
            timestamp={timestamp ? format.dateTime(timestamp, "long") : undefined}
        >
            {children}
        </Process.Event>
    );
};

export const EventSkeleton = ({ children, timestamp, title }: PropsWithChildren<Props>) => {
    return (
        <Process.Event
            // @ts-expect-error Title er typa som string, men brukes som ReactNode inni komponenten.
            title={title}
            status="completed"
            bullet={<CheckmarkHeavyIcon aria-hidden />}
            // @ts-expect-error timestamp er typa som string, men brukes som ReactNode inni komponenten.
            timestamp={timestamp ? <Skeleton width="150px" /> : undefined}
        >
            {children}
        </Process.Event>
    );
};

export default forwardRef(Event);
