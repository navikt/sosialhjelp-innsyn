import {Alert} from "@navikt/ds-react";
import {useHentHendelser} from "../../generated/hendelse-controller/hendelse-controller";
import {SaksListeResponse} from "../../generated/model";
import React from "react";

interface Props {
    paginerteSaker?: SaksListeResponse[];
    fiksDigisosId?: string;
}

const UsingFiksId = (fiksId: string) => {
    const {data: hendelser} = useHentHendelser(fiksId);
    const isNavUllern = hendelser?.find((tekst) => tekst?.tekstArgument?.includes("NAV Ullern"));
    if (isNavUllern) {
        return (
            <div style={{marginBottom: "2rem"}}>
                <Alert variant="info">
                    Har du lyst til å hjelpe oss med å lage gode digitale løsninger? Tirsdag 23. januar kl 09.00-15.00
                    er vi hos NAV Ullern for å teste en ny løsning for digital klage. Kom gjerne innom!
                </Alert>
            </div>
        );
    }
};

const UsingFiksDigisosIdFromPaginerteSaker = (fiksDigisosId: string) => {
    const {data: hendelser} = useHentHendelser(fiksDigisosId);
    return hendelser?.find((tekst) => tekst?.tekstArgument?.includes("NAV Ullern"));
};

const UsingPaginerteSaker = (paginerteSaker: SaksListeResponse[]) => {
    const isNavUllern = paginerteSaker.map((item) => {
        return UsingFiksDigisosIdFromPaginerteSaker(item.fiksDigisosId as string);
    });

    if (isNavUllern.find((e) => e?.tekstArgument?.includes("NAV Ullern"))) {
        return (
            <div style={{marginBottom: "2rem"}}>
                <Alert variant="info">
                    Har du lyst til å hjelpe oss med å lage gode digitale løsninger? Tirsdag 23. januar kl 09.00-15.00
                    er vi hos NAV Ullern for å teste en ny løsning for digital klage. Kom gjerne innom!
                </Alert>
            </div>
        );
        //}
    }
};

export const NavKontorInfoBanner = (props: Props) => {
    if (props.fiksDigisosId) {
        return UsingFiksId(props.fiksDigisosId);
    }
    if (props.paginerteSaker) {
        return UsingPaginerteSaker(props.paginerteSaker);
    }
};
