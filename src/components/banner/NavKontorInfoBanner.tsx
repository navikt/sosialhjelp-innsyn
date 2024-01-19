import {Alert} from "@navikt/ds-react";
import {useHentHendelser} from "../../generated/hendelse-controller/hendelse-controller";
import {SaksListeResponse} from "../../generated/model";
import React from "react";

interface Props {
    paginerteSaker?: SaksListeResponse[];
    fiksDigisosId?: string;
}

const BareFiks = (fiksId: string) => {
    const {data: hendelser} = useHentHendelser(fiksId);
    const ble = hendelser?.find((tekst) => tekst.tekstArgument === "NAV Årstad, Årstad kommune");
    if (ble) {
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

const Bare = (fiksDigisosId: string) => {
    const {data: hendelser} = useHentHendelser(fiksDigisosId);
    return hendelser?.find((tekst) => tekst.tekstArgument === "NAV Årstad, Årstad kommune");
};

const BarePaginerte = (paginerteSaker: SaksListeResponse[]) => {
    const hey = paginerteSaker?.map((item) => {
        return Bare(item.fiksDigisosId as string);
    });

    if (hey.find((e) => e?.tekstArgument === "NAV Årstad, Årstad kommune")) {
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
        return BareFiks(props.fiksDigisosId);
    }
    if (props.paginerteSaker) {
        return BarePaginerte(props.paginerteSaker);
    }
};
