import React, {ReactElement} from "react";
import {v4 as uuidv4} from "uuid";
import {BodyShort, Label} from "@navikt/ds-react";
import styled from "styled-components";
import AddFileButton, {TextAndButtonWrapper} from "../vedlegg/AddFileButton";

const StyledFrame = styled.div<{hasError?: boolean; padTop?: boolean}>`
    padding: 1rem;
    ${(props) => (props.padTop ? "margin-top: 16px" : "")};
    background-color: ${(props) => (props.hasError ? "var(--a-red-50)" : "var(--a-gray-200)")};
    border-radius: 2px;
    border-color: ${(props) => (props.hasError ? "var(--a-red-500)" : "var(--a-gray-200)")};
    border-width: 1px;
    border-style: solid;
`;

interface Props {
    tittel: string;
    beskrivelse?: string | null;

    hasError?: boolean;
    onChange: (files: FileList | null) => void;
    showAddFileButton?: boolean;
    children?: ReactElement;
    padTop?: boolean;
    resetErrors: () => void;
}

const UploadElementView = ({
    tittel,
    beskrivelse,
    hasError,
    onChange,
    showAddFileButton,
    children,
    padTop = true,
    resetErrors,
}: Props): ReactElement => {
    const uuid = uuidv4();
    return (
        <StyledFrame hasError={hasError} padTop={padTop}>
            <TextAndButtonWrapper>
                <div className={"tekst-wrapping"}>
                    <Label as="p">{tittel}</Label>
                    {beskrivelse && <BodyShort>{beskrivelse}</BodyShort>}
                </div>

                {showAddFileButton && (
                    <AddFileButton
                        onChange={(event) => {
                            const files = event.currentTarget.files;
                            onChange(files);
                        }}
                        id={uuid}
                        resetErrors={resetErrors}
                    />
                )}
            </TextAndButtonWrapper>

            {children}
        </StyledFrame>
    );
};

export default UploadElementView;
