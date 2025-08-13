import { PropsWithChildren } from "react";
import { useLocale } from "next-intl";

import DigisosLinkCard, { Props } from "@components/statusCard/DigisosLinkCard";
import { useFlag } from "@featuretoggles/context";

const StatusCard = (props: Omit<PropsWithChildren<Props>, "href"> & { id: string }) => {
    const nySoknadSideToggle = useFlag("sosialhjelp.innsyn.ny_soknadside");
    const locale = useLocale();
    const href = nySoknadSideToggle.enabled ? `/${locale}/soknad/${props.id}` : `/${locale}/${props.id}/status`;
    return <DigisosLinkCard href={href} {...props} />;
};

export default StatusCard;
