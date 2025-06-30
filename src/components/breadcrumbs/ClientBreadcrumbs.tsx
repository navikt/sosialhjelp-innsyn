"use client";

import { Breadcrumb } from "../../utils/breadcrumbs";
import { useSetBreadcrumbs } from "../../hooks/useUpdateBreadcrumbs";

interface ClientBreadcrumbsProps {
    dynamicBreadcrumbs?: Breadcrumb[];
}
const ClientBreadcrumbs = ({ dynamicBreadcrumbs }: ClientBreadcrumbsProps) => {
    useSetBreadcrumbs(dynamicBreadcrumbs);

    return <></>;
};

export default ClientBreadcrumbs;
