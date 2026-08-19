import { useTranslations } from "next-intl";
import { useMutation } from "@tanstack/react-query";
import { FileUpload } from "@navikt/ds-react/FileUpload";
import { Upload } from "tus-js-client";
import { BodyShort, Button, HStack, Loader } from "@navikt/ds-react";
import { InformationSquareFillIcon, TrashIcon } from "@navikt/aksel-icons";
import { browserEnv } from "@config/env";
import { UploadStatus, ValidationCode } from "@components/filopplasting/api/useDocumentState";

interface Props {
    originalFilename: string;
    convertedFilename?: string;
    uploadId: string;
    validations?: ValidationCode[];
    url?: string;
    status: UploadStatus;
    size?: number;
    showCancelButton?: boolean;
    onTerminate?: () => void;
    buttonRef?: (el: HTMLButtonElement | null) => void;
    deleteDisabled?: boolean;
}

const SeOverDescription = () => {
    const t = useTranslations("FileUploadItem");
    return (
        <HStack align="center" gap="space-8" className="text-ax-text-info-subtle">
            <InformationSquareFillIcon aria-hidden />
            <BodyShort>{t("seOver")}</BodyShort>
        </HStack>
    );
};

const FileUploadItem = ({
    convertedFilename,
    originalFilename,
    uploadId,
    validations,
    url,
    status,
    size,
    showCancelButton,
    onTerminate,
    buttonRef,
    deleteDisabled,
}: Props) => {
    const t = useTranslations("FileUploadItem");
    const { mutate, isPending } = useMutation({
        mutationFn: () => Upload.terminate(`${browserEnv.NEXT_PUBLIC_UPLOAD_API_BASE}/tus/files/${uploadId}`, {}),
        onSuccess: () => onTerminate?.(),
        retry: false,
    });
    const isConverted = !!convertedFilename && convertedFilename !== originalFilename;

    // Status DELETING betyr at filen er merket for sletting men fortsatt i DOM —
    // den vises som "uploading" (spinner) slik at brukeren ser at noe skjer.
    const isDeleting = status === "DELETING";
    const isUploading =
        (!url && !validations && status !== "FAILED" && status !== "COMPLETE" && !showCancelButton) || isDeleting;
    const uploadStatus = isUploading ? "uploading" : "idle";

    // VIKTIG: Vi bruker bevisst IKKE Aksel sin disabled/loading-prop på denne
    // knappen. <Button loading={...}> setter det native disabled-attributtet
    // (se node_modules/@navikt/ds-react .../button/Button.js: disabled er
    // (disabled ?? loading) ? true : undefined) — og dette skjer synkront på
    // NESTE render etter klikk, altså lenge før nettverkskallet er ferdig.
    // Å disable en knapp som akkurat fikk fokus tvinger nettleseren til å
    // blur'e den til <body> med en gang, uansett hvor mye fokus-styring vi
    // bygger etterpå (dette var den egentlige rotårsaken til at fokus/
    // VoiceOver "hoppet" ved sletting). Derfor holder vi knappen ekte
    // fokuserbar/ikke-disablet gjennom hele slette-flyten, og bruker
    // aria-disabled + en guard i onClick i stedet. Den eneste plassen fokus
    // faktisk MÅ flyttes eksplisitt er rett før <li>-en fjernes fra DOM for
    // godt (se setTimeout i FileSelectNew.tsx), siden det er DA nettleseren
    // faktisk fjerner et fokusert element.
    const isBusy = isPending || isDeleting;

    return (
        <>
            <FileUpload.Item
                file={{ name: convertedFilename ?? originalFilename, size }}
                as="li"
                status={uploadStatus}
                button={
                    <Button
                        ref={buttonRef}
                        variant="tertiary"
                        data-color="neutral"
                        icon={isBusy ? <Loader size="xsmall" title={t("slett")} /> : <TrashIcon title={t("slett")} />}
                        aria-disabled={deleteDisabled || isBusy || undefined}
                        onClick={() => {
                            if (deleteDisabled || isBusy) return;
                            mutate();
                        }}
                    />
                }
                onFileClick={url ? () => window.open(url, "_blank", "noopener,noreferrer") : undefined}
                /* @ts-expect-error Funker fint med ReactNode */
                description={isConverted ? <SeOverDescription /> : undefined}
                error={
                    validations?.length
                        ? t(`validation.${validations[0]}`)
                        : status === "FAILED"
                          ? t("uploadFailed")
                          : undefined
                }
            />
        </>
    );
};

export default FileUploadItem;
