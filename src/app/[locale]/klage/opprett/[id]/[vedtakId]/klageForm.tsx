"use client";

import {
    Alert,
    Button,
    FileObject,
    FileRejected,
    FileRejectionReason,
    FileUpload,
    Heading,
    Textarea,
    VStack,
} from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import { useForm, SubmitHandler, useController, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { logger } from "@navikt/next-logger";

import useFiksDigisosId from "../../../../../../hooks/useFiksDigisosId";
import { getHentKlagerQueryKey, useSendKlage } from "../../../../../../generated/klage-controller/klage-controller";
import useVedtakId from "../../../../../../hooks/useVedtakId";

const MAX_LEN_BACKGROUND = 1000;
const MAX_FILES = 3;
const MAX_SIZE_MB = 1;
const MAX_SIZE = MAX_SIZE_MB * 1024 * 1024;

type FormValues = {
    background: string | null;
    files?: FileObject[];
};

const klageSchema = z.object({
    background: z.string().max(MAX_LEN_BACKGROUND, "validering.maksLengde").nullable(),
    files: z.array(z.any()).max(MAX_FILES, `Du kan laste opp maks ${MAX_FILES} filer`),
});

const KlageForm = () => {
    const t = useTranslations("KlageForm");
    const fiksDigisosId = useFiksDigisosId();
    const vedtakId = useVedtakId();
    const queryClient = useQueryClient();
    const router = useRouter();

    const [klageId] = useState(crypto.randomUUID());

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(klageSchema) as Resolver<FormValues>,
    });

    const {
        mutate,
        isPending: sendKlageIsLoading,
        isError,
    } = useSendKlage({
        mutation: {
            onSuccess: async () => {
                await queryClient.invalidateQueries({ queryKey: getHentKlagerQueryKey(fiksDigisosId) });
                await router.push(`/klage/status/${fiksDigisosId}/${vedtakId}`);
            },
            onError: (error, variables) => {
                logger.error(
                    `Opprett klage feilet ved sending til api ${error}, FiksDigisosId: ${variables.fiksDigisosId}`
                );
            },
        },
    });

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        mutate({
            fiksDigisosId: fiksDigisosId,
            data: { klageId, vedtakId, klageTekst: data.background ?? "" },
        });
    };

    // Integrate FileUpload with react-hook-form
    const {
        field: { value: files = [], onChange },
    } = useController({
        name: "files",
        control,
    });

    const onFileSelect = (newFiles: FileObject[]) => {
        onChange([...files, ...newFiles]);
    };

    const removeFile = (fileToRemove: FileObject) => {
        onChange(files.filter((file: FileObject) => file !== fileToRemove));
    };

    const acceptedFiles = files.filter((file) => !file.error);
    const rejectedFiles = files.filter((f): f is FileRejected => f.error);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-20">
            <Textarea
                label={t("bakgrunn.label")}
                description={t("bakgrunn.beskrivelse")}
                error={errors.background?.message && t(errors.background.message)}
                {...register("background")}
            ></Textarea>
            <VStack gap="6">
                <FileUpload.Dropzone
                    label="Last opp filer til søknaden"
                    description={`Du kan laste opp Word- og PDF-filer. Maks 3 filer. Maks størrelse ${MAX_SIZE_MB} MB.`}
                    accept=".doc,.docx,.pdf"
                    maxSizeInBytes={MAX_SIZE}
                    fileLimit={{ max: MAX_FILES, current: acceptedFiles.length }}
                    onSelect={(newFiles) => onFileSelect(newFiles)}
                />
                {acceptedFiles.length > 0 && (
                    <VStack gap="2">
                        <Heading level="3" size="xsmall">
                            {`Vedlegg (${acceptedFiles.length})`}
                        </Heading>
                        <VStack as="ul" gap="3">
                            {acceptedFiles.map((file, index) => (
                                <FileUpload.Item
                                    as="li"
                                    key={index}
                                    file={file.file}
                                    button={{
                                        action: "delete",
                                        onClick: () => removeFile(file),
                                    }}
                                />
                            ))}
                        </VStack>
                    </VStack>
                )}
                {rejectedFiles.length > 0 && (
                    <VStack gap="2">
                        <Heading level="3" size="xsmall">
                            Vedlegg med feil
                        </Heading>
                        <VStack as="ul" gap="3">
                            {rejectedFiles.map((rejected, index) => (
                                <FileUpload.Item
                                    as="li"
                                    key={index}
                                    file={rejected.file}
                                    error={fileErrors[rejected.reasons[0] as FileRejectionReason]}
                                    button={{
                                        action: "delete",
                                        onClick: () => removeFile(rejected),
                                    }}
                                />
                            ))}
                        </VStack>
                    </VStack>
                )}
            </VStack>
            <Button loading={sendKlageIsLoading} type="submit">
                Send klage
            </Button>
            {isError && <Alert variant="error">{t("sendingFeilet")}</Alert>}
        </form>
    );
};

const fileErrors: Record<FileRejectionReason, string> = {
    fileType: "Filformatet støttes ikke",
    fileSize: `Filen er større enn ${MAX_SIZE_MB} MB`,
};

export default KlageForm;
