import React, {useState} from "react";
import PaperClipSlanted from "../ikoner/PaperClipSlanted";
import {Fil} from "../../redux/innsynsdata/innsynsdataReducer";
import {formatBytes} from "../../utils/formatting";
import VedleggModal from "./VedleggModal";
import {useTranslation} from "react-i18next";
import {REST_STATUS} from "../../utils/restUtils";
import {BodyShort, Button, Link} from "@navikt/ds-react";
import {ErrorMessage} from "../errors/ErrorMessage";
import styled from "styled-components/macro";
import {Delete} from "@navikt/ds-icons";

type ClickEvent = React.MouseEvent<HTMLAnchorElement, MouseEvent> | React.MouseEvent<HTMLButtonElement, MouseEvent>;

const MOBILE_MAXWIDTH = "40em";
const StyledErrorMessage = styled(ErrorMessage)`
    margin: 0.5rem 0 0.5rem;

    @media screen and (max-width: ${MOBILE_MAXWIDTH}) {
        margin: 0.5rem 0;
    }
`;

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

    .filikon {
        height: 20px;
        width: 20px;
        margin-right: 8px;
        margin-bottom: -2px;
    }

    a.filnavn {
        display: inline;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 20rem;
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

const FileItemView: React.FC<{
    fil: Fil;
    onDelete: (event: any, fil: Fil) => void;
}> = ({fil, onDelete}) => {
    const {t} = useTranslation();
    const storrelse: string = formatBytes(fil.file ? fil.file.size : 0);
    const [modalVises, setModalVises] = useState(false);

    const onVisVedlegg = (event: ClickEvent): void => {
        setModalVises(true);
        event.preventDefault();
    };

    return (
        <StyledLiTag>
            <StyledFilInfoOgKnapp>
                <StyledFilInfo>
                    {fil.file && (
                        <VedleggModal file={fil.file} onRequestClose={() => setModalVises(false)} synlig={modalVises} />
                    )}
                    <>
                        <Link
                            href="#"
                            className="filnavn"
                            onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => onVisVedlegg(event)}
                        >
                            <PaperClipSlanted className="filikon" />

                            {fil.filnavn}
                        </Link>
                    </>
                    <BodyShort as="span" className="filstorrelse">
                        ({storrelse})
                    </BodyShort>
                </StyledFilInfo>
                <StyledDeleteButton
                    variant="tertiary"
                    size="small"
                    onClick={(event: any) => onDelete(event, fil)}
                    iconPosition="right"
                    icon={<Delete />}
                >
                    {t("vedlegg.fjern")}
                </StyledDeleteButton>
            </StyledFilInfoOgKnapp>
            {fil.status !== REST_STATUS.INITIALISERT &&
                fil.status !== REST_STATUS.PENDING &&
                fil.status !== REST_STATUS.OK && (
                    <StyledErrorMessage>
                        {t(
                            "vedlegg.opplasting_feilmelding_" + fil.status,
                            "Vi klarte dessverre ikke lese filen din. Årsaken er ukjent."
                        )}
                    </StyledErrorMessage>
                )}
        </StyledLiTag>
    );
};

export default FileItemView;
