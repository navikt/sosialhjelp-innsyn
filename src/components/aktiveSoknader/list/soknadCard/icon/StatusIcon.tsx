import { SaksDetaljerResponseStatus } from "../../../../../generated/ssr/model";
import { CheckmarkIcon, FileTextIcon, PersonGavelIcon } from "@navikt/aksel-icons";

interface Props {
    status: SaksDetaljerResponseStatus;
}

const StatusIcon = ({ status }: Props) => {
    switch (status) {
        case SaksDetaljerResponseStatus.SENDT:
            return <FileTextIcon />;
        case SaksDetaljerResponseStatus.MOTTATT:
            return <FileTextIcon />;
        case SaksDetaljerResponseStatus.FERDIGBEHANDLET:
            return <CheckmarkIcon />;
        case SaksDetaljerResponseStatus.UNDER_BEHANDLING:
            return <PersonGavelIcon />;
    }
    return null;
};

export default StatusIcon;
