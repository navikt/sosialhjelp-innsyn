import {Alert} from "@navikt/ds-react";
import {useHentHendelser} from "../../generated/hendelse-controller/hendelse-controller";
import {SaksListeResponse} from "../../generated/model";
import React from "react";
import {useHentAlleSaker} from "../../generated/saks-oversikt-controller/saks-oversikt-controller";

interface Props {
    paginerteSaker?: SaksListeResponse[];
    fiksDigisosId?: string;
}

const Bare = (fiksDigisosId: string) => {
    const {data: hendelser} = useHentHendelser(fiksDigisosId);
    return hendelser?.find(
        (tekst) => tekst.tekstArgument === "NAV Årstad, Årstad" || tekst.tekstArgument === "NAV Årstad, Årstad kommune"
    );
};

const TesterSaker = (paginerteSaker: SaksListeResponse[], fiksid?: string) => {
    if (fiksid) {
        const test = paginerteSaker.map((item) => item.fiksDigisosId);
        if (test.includes(fiksid)) {
            return (
                <div style={{marginBottom: "2rem"}}>
                    <Alert variant="info">
                        Har du lyst til å hjelpe oss med å lage gode digitale løsninger? Tirsdag 23. januar kl
                        09.00-15.00 er vi hos NAV Ullern for å teste en ny løsning for digital klage. Kom gjerne innom!
                    </Alert>
                </div>
            );
        }
    } else {
        const hey = paginerteSaker?.map((item) => {
            return Bare(item.fiksDigisosId as string);
        });

        if (
            hey.find(
                (e) => e?.tekstArgument === "NAV Årstad, Årstad kommune" || e?.tekstArgument === "NAV Årstad, Årstad"
            )
        ) {
            return (
                <div style={{marginBottom: "2rem"}}>
                    <Alert variant="info">
                        Har du lyst til å hjelpe oss med å lage gode digitale løsninger? Tirsdag 23. januar kl
                        09.00-15.00 er vi hos NAV Ullern for å teste en ny løsning for digital klage. Kom gjerne innom!
                    </Alert>
                </div>
            );
        }
    }
};

export const NavKontorInfoBanner = (props: Props) => {
    const {data: saker} = useHentAlleSaker();
    if (saker) {
        return TesterSaker(saker, props?.fiksDigisosId);
    }
};
