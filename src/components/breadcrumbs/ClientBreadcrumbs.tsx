"use client";

import { Breadcrumb, LastCrumb } from "@utils/breadcrumbs";
import { useSetBreadcrumbs } from "@hooks/useUpdateBreadcrumbs";

interface ClientBreadcrumbsProps {
    dynamicBreadcrumbs?: (Breadcrumb | LastCrumb)[];
}
const ClientBreadcrumbs = ({ dynamicBreadcrumbs }: ClientBreadcrumbsProps) => {
    useSetBreadcrumbs(dynamicBreadcrumbs);

    return <></>;
};

export default ClientBreadcrumbs;
