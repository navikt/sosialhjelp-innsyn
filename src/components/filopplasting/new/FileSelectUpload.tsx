import { Button, FileObject, FileUpload } from "@navikt/ds-react";
import { ReactNode } from "react";
import { allowedFileTypes } from "@components/filopplasting/new/consts";
import { UploadIcon } from "@navikt/aksel-icons";

interface ResponsiveFileUploadSimpleProps {
    label: ReactNode;
    description?: ReactNode;
    error?: ReactNode;
    onSelect: (files: FileObject[]) => void;
    disabled?: boolean;
}

export const FileSelectUpload = ({
    label,
    description,
    error,
    onSelect,
    disabled = false,
}: ResponsiveFileUploadSimpleProps) => {
    return (
        <>
            <div className="hidden sm:block">
                <FileUpload.Dropzone
                    className="flex flex-col"
                    // @ts-expect-error: Typen på Dropzone er string, men den sendes ned i en komponent som aksepterer ReactNode.
                    label={label}
                    description={description}
                    onSelect={onSelect}
                    accept={allowedFileTypes}
                    maxSizeInBytes={10 * 1024 * 1024}
                    multiple
                    disabled={disabled}
                    error={error}
                />
            </div>

            <div className="block sm:hidden">
                <FileUpload.Trigger
                    accept={allowedFileTypes}
                    maxSizeInBytes={10 * 1024 * 1024}
                    multiple
                    onSelect={onSelect}
                >
                    <Button variant="secondary" icon={<UploadIcon aria-hidden />} />
                </FileUpload.Trigger>
            </div>
        </>
    );
};
