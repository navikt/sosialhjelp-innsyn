import DatoTag from "@components/tags/tag/DatoTag";
import BehandlingsStatusTag from "@components/tags/tag/BehandlingStatusTag";
import AlertTag from "@components/tags/tag/AlertTag";
import VedtakTag from "@components/tags/tag/VedtakTag";
import { InnsendtSoknad, isActiveSoknad } from "@components/soknaderList/list/soknaderUtils";
import { Skeleton, Tag, TagProps } from "@navikt/ds-react";
import IkkeInnsynTag from "@components/tags/tag/IkkeInnsynTag";
import BehandlesIkkeTag from "@components/tags/tag/BehandlesIkkeTag";

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
    const harSakMedFlereVedtak = soknad.saker.some((s) => s.antallVedtak > 1);
    const antallNyeVilkarOgDokumentasjonKrav = soknad.antallNyeVilkarOgDokumentasjonKrav ?? 0;
    const enSakIkkeInnsyn = soknad.saker.length === 1 && soknad.saker[0].status === "IKKE_INNSYN";

    const behandlesIkke =
        soknad.status === "BEHANDLES_IKKE" ||
        (soknad.saker.length === 1 && soknad.saker[0].status === "BEHANDLES_IKKE");

    if (behandlesIkke) {
        return (
            <>
                <DatoTag sendtDato={sendtDato} mottattDato={mottattDato} />
                <BehandlesIkkeTag />
            </>
        );
    }

    if (enSakIkkeInnsyn) {
        return (
            <>
                <DatoTag sendtDato={sendtDato} mottattDato={mottattDato} />
                <IkkeInnsynTag />
            </>
        );
    }

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
        const antallSaker = soknad.saker.filter((sak) => sak.status !== "FEILREGISTRERT").length;
        const ferdigeSaker = soknad.saker.filter((sak) => sak.status === "FERDIGBEHANDLET").length;
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
