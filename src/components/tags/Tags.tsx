import DatoTag from "@components/soknaderList/list/soknadCard/DatoTag";
import BehandlingsStatusTag from "@components/soknaderList/list/soknadCard/status/BehandlingStatusTag";
import AlertTag from "@components/soknaderList/list/soknadCard/status/AlertTag";
import VedtakTag from "@components/soknaderList/list/soknadCard/VedtakTag";
import { InnsendtSoknad, isActiveSoknad } from "@components/soknaderList/list/soknaderUtils";
import { Skeleton, Tag, TagProps } from "@navikt/ds-react";

interface Props {
    soknad: InnsendtSoknad;
}

const Tags = ({ soknad }: Props) => {
    const sendtDato = soknad.soknadOpprettet ? new Date(soknad.soknadOpprettet) : undefined; // Kun satt ved digital søknad
    const mottattDato = soknad.mottattTidspunkt ? new Date(soknad.mottattTidspunkt) : undefined;
    const isDigitalSoknad = !!sendtDato;
    const forsteOppgaveFrist = soknad.forsteOppgaveFrist ? new Date(soknad.forsteOppgaveFrist) : undefined;
    const sisteDokumentasjonKravFrist = soknad.sisteDokumentasjonKravFrist
        ? new Date(soknad.sisteDokumentasjonKravFrist)
        : undefined;
    const antallNyeOppgaver = soknad.antallNyeOppgaver ?? 0;
    const antallNyeVilkarOgDokumentasjonKrav = soknad.antallNyeVilkarOgDokumentasjonKrav ?? 0;
    const harSakMedFlereVedtak = soknad.saker?.some((s) => s.antallVedtak > 1) ?? false;

    if (soknad.status === "MOTTATT") {
        return (
            <>
                <DatoTag sendtDato={sendtDato} mottattDato={mottattDato} />
                {isDigitalSoknad && <BehandlingsStatusTag status="mottatt" />}
                {antallNyeOppgaver > 0 && <AlertTag alertType="oppgave" deadline={forsteOppgaveFrist} />}
            </>
        );
    }
    if (soknad.status === "SENDT") {
        return (
            <>
                <DatoTag sendtDato={sendtDato} mottattDato={mottattDato} />
                {antallNyeOppgaver > 0 && <AlertTag alertType="oppgave" deadline={forsteOppgaveFrist} />}
            </>
        );
    }
    if (soknad.status === "UNDER_BEHANDLING") {
        const antallSaker = soknad.saker?.length || 1;
        const ferdigeSaker = soknad.saker?.filter((sak) => sak.status === "FERDIGBEHANDLET").length || 0;
        const vedtakProgress = antallSaker > 1 && ferdigeSaker > 0 ? { ferdigeSaker, antallSaker } : undefined;
        const antallNyeDokEtterspurt = antallNyeOppgaver - antallNyeVilkarOgDokumentasjonKrav;

        return (
            <>
                <DatoTag sendtDato={sendtDato} mottattDato={mottattDato} />
                <BehandlingsStatusTag status="under_behandling" vedtakProgress={vedtakProgress} />
                {harSakMedFlereVedtak && <VedtakTag />}
                {antallNyeDokEtterspurt > 0 && <AlertTag alertType="oppgave" deadline={forsteOppgaveFrist} />}
                {antallNyeVilkarOgDokumentasjonKrav > 0 && (
                    <AlertTag alertType="vilkar" deadline={sisteDokumentasjonKravFrist} />
                )}
                {soknad.forelopigSvar?.harMottattForelopigSvar && <AlertTag alertType="forlenget_behandlingstid" />}
            </>
        );
    }
    if (soknad.status === "FERDIGBEHANDLET") {
        return (
            <>
                <DatoTag sendtDato={sendtDato} mottattDato={mottattDato} />
                <BehandlingsStatusTag
                    status={!isActiveSoknad(soknad) ? "ferdigbehandlet_eldre" : "ferdigbehandlet_nylig"}
                />
                {harSakMedFlereVedtak && <VedtakTag />}
                {antallNyeVilkarOgDokumentasjonKrav > 0 && (
                    <AlertTag alertType="vilkar" deadline={sisteDokumentasjonKravFrist} />
                )}
            </>
        );
    }
    if (soknad.status === "BEHANDLES_IKKE") {
        return (
            <>
                <DatoTag sendtDato={sendtDato} mottattDato={mottattDato} />
                <BehandlingsStatusTag status={"ferdigbehandlet_eldre"} />
            </>
        );
    }

    return null;
};

export const TagsSkeleton = ({ size = "medium" }: Pick<TagProps, "size">) => (
    <>
        <Tag variant="neutral-moderate" size={size}>
            <Skeleton variant="text" width="80px" />
        </Tag>
    </>
);

export default Tags;
