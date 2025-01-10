import React, {useState} from "react";
import {BodyShort, Button} from "@navikt/ds-react";
import styled from "styled-components";
import {Delete} from "@navikt/ds-icons";
import {useTranslation} from "next-i18next";
import {FileCheckmarkIcon} from "@navikt/aksel-icons";

import styles from "../../styles/lists.module.css";
import LinkButton from "../linkButton/LinkButton";
import VedleggModal from "../vedlegg/VedleggModal";
import {formatBytes} from "../../utils/formatting";

import {FancyFile, Error} from "./useFilOpplasting";

type ClickEvent = React.MouseEvent<HTMLAnchorElement, MouseEvent> | React.MouseEvent<HTMLButtonElement, MouseEvent>;

const MOBILE_MAXWIDTH = "40em";

const StyledLiTag = styled.li`
    margin: 1rem 0;
    max-width: 100%;
    min-height: 38px;
    padding-bottom: 1px;
    border-bottom: 1px solid #c6c2bf;
`;

const StyledFilInfoOgKnapp = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;
`;

const StyledFilInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-width: 0;
    white-space: nowrap;
    flex-wrap: wrap;

    button.filnavn {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 20rem;
        display: flex;
        svg {
            height: 1.5rem;
            width: 1.5rem;
        }
    }
`;

const StyledDeleteButton = styled(Button)`
    white-space: nowrap;
    margin-left: auto;
    font-weight: bold;
    @media screen and (max-width: ${MOBILE_MAXWIDTH}) {
        svg {
            display: none;
        }
    }
`;

interface Props {
    filer: FancyFile[];
    onDelete: (event: React.MouseEvent<HTMLButtonElement>, fil: FancyFile) => void;
    errors: Error[];
}

const FileItemView = (props: Props) => {
    const [openFile, setOpenFile] = useState<FancyFile | null>(null);
    const {t} = useTranslation();

    const onVisVedlegg = (event: ClickEvent, file: FancyFile): void => {
        setOpenFile(file);
        event.preventDefault();
    };

    return (
        <>
            {props.filer.length > 0 ? (
                <ul className={styles.unorderedList}>
                    <VedleggModal file={openFile?.file} onRequestClose={() => setOpenFile(null)} synlig={!!openFile} />
                    {props.filer.map((fil: FancyFile) => (
                        <StyledLiTag key={fil.uuid}>
                            <StyledFilInfoOgKnapp>
                                <StyledFilInfo>
                                    <LinkButton
                                        className="filnavn"
                                        onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) =>
                                            onVisVedlegg(event, fil)
                                        }
                                    >
                                        <FileCheckmarkIcon aria-hidden title="filikon" className="filikon" />

                                        {fil.file.name}
                                    </LinkButton>
                                    <BodyShort as="span" className="filstorrelse">
                                        ({formatBytes(fil ? fil.file.size : 0)})
                                    </BodyShort>
                                </StyledFilInfo>
                                <StyledDeleteButton
                                    variant="tertiary"
                                    size="small"
                                    onClick={(event: React.MouseEvent<HTMLButtonElement>) => props.onDelete(event, fil)}
                                    iconPosition="right"
                                    icon={<Delete aria-hidden title="fjern" />}
                                    aria-label={`${t("vedlegg.fjern")} ${fil.file.name}`}
                                >
                                    {t("vedlegg.fjern")}
                                </StyledDeleteButton>
                            </StyledFilInfoOgKnapp>
                        </StyledLiTag>
                    ))}
                </ul>
            ) : null}
        </>
    );
};

export default FileItemView;
