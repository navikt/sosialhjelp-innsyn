import { notFound } from "next/navigation";
import { browserEnv } from "@config/env";
import { getFlag, getToggles } from "@featuretoggles/unleash";
import DirectUploadPilot from "@components/filopplasting/direct/DirectUploadPilot";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    if (!["dev", "local"].includes(browserEnv.NEXT_PUBLIC_RUNTIME_ENVIRONMENT)) notFound();
    const toggles = await getToggles();
    if (!getFlag("sosialhjelp.innsyn.direkte-opplasting-pilot", toggles).enabled) notFound();
    const { id } = await params;
    return <DirectUploadPilot fiksDigisosId={id} />;
}
