import StatusCard from "@components/soknaderList/list/soknadCard/status/StatusCard";

interface Props {
    fiksDigisosId: string;
    sakTittel?: string;
    sendtDato?: Date;
}

const UnderBehandlingCard = ({ fiksDigisosId, sakTittel, sendtDato }: Props) => {
    return (
        <StatusCard id={fiksDigisosId} variant="info" sendtDato={sendtDato} behandlingsStatus="under_behandling">
            <span lang="nb">{sakTittel}</span>
        </StatusCard>
    );
};

export default UnderBehandlingCard;
