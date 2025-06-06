import React, { ReactElement } from "react";
import { useTranslations } from "next-intl";
import styled, { css } from "styled-components";
import { BodyShort, Label, ErrorMessage } from "@navikt/ds-react";

import ErrorMessageWrapper from "../errors/ErrorMessageWrapper";

import FileItemView from "./FileItemView";
import ErrorMessagesSummary, { dedupeErrorsByProp } from "./ErrorMessagesSummary";
import { Error, errorStatusToMessage, ErrorWithFile, FancyFile } from "./useFilOpplasting";
import styles from "./filopplasting.module.css";

const StyledFrame = styled.div<{ $hasError?: boolean; $hasFiler?: boolean }>`
    background-color: var(--a-gray-50);
    border-radius: 4px;

    ${(props) => {
        if (props.$hasError && props.$hasFiler) {
            return css`
                padding-bottom: 16px;
            `;
        } else if (!props.$hasError) {
            return css`
                padding-bottom: 16px;
            `;
        }
    }}

    // FileItemView
    ul:last-child {
        padding-inline: 16px;
    }

    .errorwrapper {
        padding-inline: 16px;
        padding-block: 16px 0;

        ${({ $hasError }) =>
            $hasError &&
            css`
                background-color: var(--a-red-50);
                border: 1px solid var(--a-red-500);
                border-radius: 4px;
            `}
    }
`;

interface Props {
    tittel?: string | null;
    beskrivelse?: string | null;
    addFileButton?: React.ReactElement;
    filer: FancyFile[];
    onDelete: (event: React.MouseEvent<HTMLButtonElement>, fil: FancyFile) => void;
    errors: (Error | ErrorWithFile)[];
}

const FilOpplastingBlokk = (props: Props): ReactElement => {
    const { addFileButton } = props;
    const uniqueErrors = dedupeErrorsByProp(props.errors, "feil");
    const t = useTranslations("common");

    return (
        <StyledFrame
            $hasError={props.errors.length > 0}
            $hasFiler={props.filer.length > 0}
            aria-invalid={props.errors.length > 0}
        >
            <div className="errorwrapper">
                <div className={styles.tekstWrapping}>
                    {props.tittel ? (
                        <Label as="p" lang="no">
                            {props.tittel}
                        </Label>
                    ) : (
                        <></>
                    )}
                    {props.beskrivelse ? (
                        <BodyShort spacing lang="no">
                            {props.beskrivelse}
                        </BodyShort>
                    ) : (
                        <></>
                    )}
                </div>
                {addFileButton}
                <ErrorMessageWrapper>
                    {props.errors.length > 0 ? (
                        <>
                            <ErrorMessagesSummary
                                errors={props.errors.filter((error) => "fil" in error && "filnavn" in error)}
                            />
                            <ul className={styles.feilListe}>
                                {uniqueErrors.map((key, i) => (
                                    <li key={i}>
                                        <ErrorMessage>{t(errorStatusToMessage[key.feil])}</ErrorMessage>
                                    </li>
                                ))}
                            </ul>
                        </>
                    ) : (
                        <></>
                    )}
                </ErrorMessageWrapper>
            </div>

            <FileItemView errors={props.errors} filer={props.filer} onDelete={props.onDelete} />
        </StyledFrame>
    );
};

export default FilOpplastingBlokk;
