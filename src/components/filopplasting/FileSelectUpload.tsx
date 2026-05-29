import { Alert, BodyLong, Button, FileObject, FileUpload, Heading, VStack } from "@navikt/ds-react";
import { ReactNode } from "react";
import { allowedFileTypes } from "@components/filopplasting/consts";
import { UploadIcon } from "@navikt/aksel-icons";
import useIsMobile from "@utils/useIsMobile";

interface FileSelectUploadProps {
    label: ReactNode;
    description?: ReactNode;
    tag?: ReactNode;
    buttonText: string;
    error?: ReactNode;
    onSelect: (files: FileObject[]) => void;
    disabled?: boolean;
    currentCount: number;
    accept?: string;
    variant?: "default" | "warning";
}

export const FileSelectUpload = ({
    label,
    description,
    tag,
    buttonText,
    error,
    onSelect,
    disabled,
    currentCount,
    accept = allowedFileTypes,
    variant = "default",
}: FileSelectUploadProps) => {
    const isMobile = useIsMobile();
    const dataColor = variant === "warning" ? "warning" : undefined;

    const labelContent =
        typeof label === "string" ? (
            <Heading size="small" level="3" lang="no" data-color={dataColor}>
                {label}
            </Heading>
        ) : (
            label
        );

    const descriptionContent =
        description == null ? null : typeof description === "string" ? (
            <BodyLong lang="no" data-color={dataColor}>
                {description}
            </BodyLong>
        ) : (
            description
        );

    // Mobile: tag on top, label below (flex-col); Desktop: label left, tag right (flex-row)
    const headerSection = (
        <div className="flex flex-col ax-md:flex-row ax-md:justify-between ax-md:items-center gap-2">
            <div className="order-2 ax-md:order-1">{labelContent}</div>
            {tag && <div className="order-1 ax-md:order-2">{tag}</div>}
        </div>
    );

    return (
        <>
            {!isMobile ? (
                <FileUpload.Dropzone
                    className="flex flex-col"
                    // @ts-expect-error: Typen på Dropzone er string, men den sendes ned i en komponent som aksepterer ReactNode.
                    label={headerSection}
                    description={
                        descriptionContent ? <VStack className="mb-2">{descriptionContent}</VStack> : undefined
                    }
                    onSelect={onSelect}
                    accept={accept}
                    maxSizeInBytes={10 * 1024 * 1024}
                    fileLimit={{ max: 30, current: currentCount }}
                    multiple
                    disabled={disabled}
                    error={error}
                />
            ) : (
                <VStack gap="space-16">
                    <VStack gap="space-2">
                        {headerSection}
                        {descriptionContent}
                    </VStack>
                    <FileUpload.Trigger accept={accept} maxSizeInBytes={10 * 1024 * 1024} multiple onSelect={onSelect}>
                        <Button
                            className="self-start"
                            variant="secondary"
                            icon={<UploadIcon aria-hidden />}
                            disabled={disabled}
                            aria-label={buttonText}
                        >
                            {buttonText}
                        </Button>
                    </FileUpload.Trigger>
                    {error && (
                        <Alert variant="error" size="small">
                            {error}
                        </Alert>
                    )}
                </VStack>
            )}
        </>
    );
};
