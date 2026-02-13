import React, { forwardRef, PropsWithChildren, ReactNode, Ref } from "react";
import { Process, ProcessEventProps } from "@navikt/ds-react/Process";
import { useFormatter } from "next-intl";
import { CheckmarkHeavyIcon } from "@navikt/aksel-icons";
import { Skeleton } from "@navikt/ds-react";

interface Props {
    title: ReactNode;
    timestamp?: Date;
    status?: ProcessEventProps["status"];
}

const Event = (
    { timestamp, title, children, status }: PropsWithChildren<Props>,
    ref: Ref<HTMLLIElement>
): React.JSX.Element => {
    const format = useFormatter();
    return (
        <Process.Event
            // @ts-expect-error Title er typa som string, men brukes som ReactNode inni komponenten.
            title={title}
            ref={ref}
            tabIndex={-1}
            status={status}
            bullet={status === "completed" ? <CheckmarkHeavyIcon aria-hidden /> : <div className="bg-transparent" />}
            timestamp={timestamp ? format.dateTime(timestamp, "long") : undefined}
        >
            {children}
        </Process.Event>
    );
};

export const EventSkeleton = ({ status, children, timestamp, title }: PropsWithChildren<Props>) => {
    return (
        <Process.Event
            // @ts-expect-error Title er typa som string, men brukes som ReactNode inni komponenten.
            title={title}
            status={status}
            bullet={status === "completed" ? <CheckmarkHeavyIcon aria-hidden /> : <div className="bg-transparent" />}
            // @ts-expect-error Title er typa som string, men brukes som ReactNode inni komponenten.
            timestamp={timestamp ? <Skeleton width="150px" /> : undefined}
        >
            {children}
        </Process.Event>
    );
};

export default forwardRef(Event);
