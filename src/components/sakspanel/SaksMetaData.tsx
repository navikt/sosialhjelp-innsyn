import {Detail} from "@navikt/ds-react";
import DatoOgKlokkeslett from "../tidspunkt/DatoOgKlokkeslett";
import React from "react";

interface Props {
    status: string;
    oppdatert: string;
}
const SaksMetaData = (props: Props) => {
    return (
        <>
            <Detail as="span">{props.status}</Detail>
            <span aria-hidden="true"> ● </span>
            <Detail as="span">
                oppdatert <DatoOgKlokkeslett tidspunkt={props.oppdatert} bareDato={true} />
            </Detail>
        </>
    );
};
export default SaksMetaData;
