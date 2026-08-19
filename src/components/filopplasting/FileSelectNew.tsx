"use client";

import { useTranslations } from "next-intl";
import * as R from "remeda";
import { FileObject, FileUpload, Heading, VStack } from "@navikt/ds-react";
import InlineStatusMessage from "@components/filopplasting/InlineStatusMessage";
import { ReactNode, useRef, useState } from "react";
import { getTusUploader } from "@components/filopplasting/utils/tusUploader";
import { DocumentState, UploadState } from "@components/filopplasting/api/useDocumentState";

import FileUploadItem from "./FileUploadItem";
import { FileSelectUpload } from "@components/filopplasting/FileSelectUpload";
import { browserEnv } from "@config/env";
import { useParams } from "next/navigation";
import useSlowProcessingWarning from "@components/filopplasting/useSlowProcessingWarning";
import { isFolder } from "@components/filopplasting/utils/validateFiles";

interface Props {
    id?: string;
    label?: string;
    description?: string;
    filesLabel?: string;
    tag?: ReactNode;
    isPending?: boolean;
    docState: DocumentState;
    uploadId: string;
    onSelect?: (files: FileObject[]) => void;
    onUploadsAdded: (uploads: UploadState[]) => void;
    onUploadRemoved: (correlationId: string) => void;
    onMarkAsDeleting: (correlationId: string) => void;
    variant?: "normal" | "warning";
}

const liveRegionIndexes = [0, 1] as const;
type LiveRegionIndex = (typeof liveRegionIndexes)[number];

const FileSelectNew = ({
    label,
    description,
    tag,
    docState,
    id,
    filesLabel,
    uploadId,
    variant,
    onSelect,
    onUploadsAdded,
    onUploadRemoved,
    onMarkAsDeleting,
    isPending,
}: Props) => {
    const { id: fiksDigisosId } = useParams<{ id: string }>();
    const t = useTranslations("Opplastingsboks");

    const hasPendingOrProcessing = docState.uploads?.some((u) => u.status === "PENDING" || u.status === "PROCESSING");

    const [folderDropError, setFolderDropError] = useState(false);
    const [skjermleserBeskjed, setSkjermleserBeskjed] = useState<{ text: string; activeRegion: LiveRegionIndex }>({
        text: "",
        activeRegion: 0,
    });
    const announceTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    // Refs til slett-knappene, nøkkel = correlationId. Brukes til å flytte fokus
    // til nabo-filen når en fil slettes, se moveFocusAwayFrom under.
    const deleteButtonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
    // Fallback-mål når det ikke finnes noen nabo å flytte fokus til (f.eks. siste
    // fil i listen slettes). tabIndex=-1 gjør den programmatisk fokuserbar uten
    // å komme inn i tab-rekkefølgen.
    const filesHeadingRef = useRef<HTMLHeadingElement>(null);

    // Rotårsaken til at fokus "hopper til body" ved sletting er IKKE at <li>
    // fjernes fra DOM (den delen er allerede håndtert av DELETING-status under).
    // Aksel sin <Button loading={...}> setter faktisk disabled-attributtet på
    // knappen (se node_modules/@navikt/ds-react .../button/Button.js), og siden
    // useMutation setter isPending=true på NESTE render etter klikk — altså
    // synkront og lenge før nettverkskallet er ferdig — blir akkurat den
    // knappen som har fokus disablet med en gang. Nettleseren blur'er da
    // elementet og fokus havner på <body>, uansett hva slags live-region- eller
    // DOM-fjernings-logikk vi bygger etterpå.
    // Løsningen (anbefalt av UU-ressursen vår): flytt fokus eksplisitt til noe
    // meningsfylt FØR knappen blir utilgjengelig, ikke etterpå.
    //
    // VIKTIG: Vi sjekker bevisst IKKE document.activeElement her. På macOS gir
    // Chrome alltid en <button> ekte DOM-fokus ved museklikk, mens Safari/
    // Firefox som standard IKKE gjør det (kun hvis brukeren har skrudd på
    // "Full tilgang med tastatur: Alle kontroller" i systeminnstillingene —
    // noe de færreste VoiceOver-brukere har, siden VoiceOver navigerer med sin
    // egen virtuelle markør). I Firefox er document.activeElement derfor
    // typisk aldri lik knappen som ble klikket, så en activeElement-sjekk her
    // ville stille gjort denne funksjonen til en no-op i Firefox — noe som er
    // nøyaktig det vi observerte (VoiceOver mister markøren sin helt og hopper
    // til toppen av siden/sidetittelen, siden ingen eksplisitt fokusflytting
    // skjedde). Vi flytter derfor fokus ubetinget hver gang en fil slettes.
    const moveFocusAwayFrom = (correlationId: string) => {
        const uploads = docState.uploads ?? [];
        const currentIndex = uploads.findIndex((u) => u.correlationId === correlationId);
        const isFocusable = (u: UploadState) => u.status !== "DELETING" && u.correlationId !== correlationId;

        const next = uploads.slice(currentIndex + 1).find(isFocusable);
        const previous = [...uploads.slice(0, currentIndex)].reverse().find(isFocusable);
        const target = next ?? previous;

        const targetButton = target?.correlationId ? deleteButtonRefs.current.get(target.correlationId) : undefined;
        (targetButton ?? filesHeadingRef.current)?.focus();
    };

    const showSlowProcessingWarning = useSlowProcessingWarning(hasPendingOrProcessing);

    // Bytter mellom to live-regioner med 200ms delay for å løse to separate problemer:
    // 1. Firefox + VoiceOver dropper live-region-mutasjoner rett etter native filvelger
    //    lukkes — delayen gir tid til fokusretur før live-regionen oppdateres.
    // 2. Identisk tekst leses ikke opp igjen — veksling mellom regionene sikrer at
    //    skjermleseren alltid ser en endring fra tom til tekst.
    const oppdaterSkjermleserBeskjed = (text: string, delay = 200) => {
        clearTimeout(announceTimerRef.current);
        announceTimerRef.current = setTimeout(() => {
            setSkjermleserBeskjed(({ activeRegion }) => ({
                text,
                activeRegion: activeRegion === 0 ? 1 : 0,
            }));
        }, delay);
    };

    // Starter opplasting umiddelbart ved filvalg
    const _onSelect = (files: FileObject[]) => {
        const [folders, valid] = R.partition(files, (f) => isFolder(f));

        setFolderDropError(folders.length > 0);

        if (valid.length === 0) return;
        oppdaterSkjermleserBeskjed(t("filLagtTil", { count: valid.length }));
        onSelect?.(valid);

        const optimisticUploads: UploadState[] = valid.map((file: FileObject) => {
            const correlationId = crypto.randomUUID();
            const upload = getTusUploader({
                id: uploadId,
                file,
                fiksDigisosId,
                correlationId,
            });
            upload.start();
            return {
                id: correlationId,
                correlationId,
                originalFilename: file.file.name,
                size: file.file.size,
                status: "PENDING" as const,
            };
        });
        onUploadsAdded(optimisticUploads);
    };

    const converted = docState.uploads?.some(
        (upload) => !!upload.finalFilename && upload.finalFilename !== upload.originalFilename
    );

    // Filer som ikke er i ferd med å slettes — brukes for å vise riktig antall
    // i listen og i kunngjøringen "Fil slettet. X filer gjenstår".
    const activeUploads = docState.uploads?.filter((u) => u.status !== "DELETING") ?? [];

    return (
        <FileUpload
            id={id}
            translations={{
                dropzone: {
                    buttonMultiple: t("button"),
                    or: t("eller"),
                    dragAndDropMultiple: t("dragAndDrop"),
                },
                item: {
                    uploading: t("uploading"),
                    deleteButtonTitle: t("delete"),
                },
            }}
        >
            {liveRegionIndexes.map((index) => (
                <div key={index} role="status" aria-live="polite" aria-atomic="true" className="sr-only">
                    {skjermleserBeskjed.activeRegion === index ? skjermleserBeskjed.text : ""}
                </div>
            ))}
            <VStack gap="space-24">
                <FileSelectUpload
                    label={label ?? t("tittel")}
                    headerId={`header-id-${uploadId}`}
                    description={description}
                    tag={tag}
                    variant={variant === "warning" ? "warning" : "default"}
                    buttonText={t("lastOppFiler")}
                    onSelect={_onSelect}
                    currentCount={activeUploads.length}
                />

                {folderDropError && (
                    <InlineStatusMessage variant="error" role="alert">
                        {t("mappeIkkeTillatt")}
                    </InlineStatusMessage>
                )}

                {!!docState.uploads?.length && (
                    <VStack gap="space-8">
                        <Heading ref={filesHeadingRef} tabIndex={-1} size="xsmall" level="3">
                            {filesLabel ?? t("valgteFiler", { antall_filer: activeUploads.length })}
                        </Heading>
                        {converted && (
                            <InlineStatusMessage variant="info" role="status">
                                {t("konvertert")}
                            </InlineStatusMessage>
                        )}
                        {showSlowProcessingWarning && (
                            <InlineStatusMessage variant="info" role="status">
                                {t("processingWarning")}
                            </InlineStatusMessage>
                        )}
                        {(docState.validations?.length ?? 0) > 0 && (
                            <>
                                {docState.validations?.map((error) => (
                                    <InlineStatusMessage key={error} variant="error" role="alert">
                                        {t(`submissionError.${error}`)}
                                    </InlineStatusMessage>
                                ))}
                            </>
                        )}
                        <VStack as="ul" gap="space-8">
                            {docState.uploads?.map((upload) => (
                                <FileUploadItem
                                    key={upload.id}
                                    url={
                                        upload.url
                                            ? `${browserEnv.NEXT_PUBLIC_BASE_PATH}/api/upload-api${upload.url}`
                                            : undefined
                                    }
                                    uploadId={upload.id}
                                    convertedFilename={upload.finalFilename}
                                    originalFilename={upload.originalFilename}
                                    validations={upload.validations}
                                    status={upload.status}
                                    size={upload.size}
                                    showCancelButton={
                                        showSlowProcessingWarning &&
                                        (upload.status === "PENDING" || upload.status === "PROCESSING")
                                    }
                                    deleteDisabled={isPending}
                                    buttonRef={(el) => {
                                        if (!upload.correlationId) return;
                                        if (el) deleteButtonRefs.current.set(upload.correlationId, el);
                                        else deleteButtonRefs.current.delete(upload.correlationId);
                                    }}
                                    onBeforeDelete={() => {
                                        if (!upload.correlationId) return;
                                        moveFocusAwayFrom(upload.correlationId);
                                    }}
                                    onTerminate={() => {
                                        if (!upload.correlationId) return;
                                        // 1. Merk filen som DELETING — <li> forblir i DOM med spinner.
                                        //    VoiceOver mister ikke fokus og kan lese kunngjøringen.
                                        onMarkAsDeleting(upload.correlationId);
                                        // 2. Kunngjør til skjermleser. activeUploads ekskluderer allerede
                                        //    denne filen siden den nå er DELETING.
                                        oppdaterSkjermleserBeskjed(
                                            t("filSlettet", { count: activeUploads.length - 1 }),
                                            0
                                        );
                                        // 3. Fjern filen fra DOM etter en kort pause slik at VoiceOver
                                        //    rekker å lese ferdig før <li> forsvinner.
                                        setTimeout(() => {
                                            onUploadRemoved(upload.correlationId!);
                                        }, 1500);
                                    }}
                                />
                            ))}
                        </VStack>
                    </VStack>
                )}
            </VStack>
        </FileUpload>
    );
};

export default FileSelectNew;
