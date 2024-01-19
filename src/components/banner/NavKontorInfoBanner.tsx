/*import {Alert} from "@navikt/ds-react";
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
    return hendelser?.find((tekst) => tekst.tekstArgument.includes("NAV Bergenhus"));
};

const TesterSaker = (paginerteSaker: SaksListeResponse[], fiksid?: string) => {
    if (fiksid !== undefined) {
        const test = paginerteSaker.map((item) => item.fiksDigisosId);
        //console.log("wat",test.find((tekst) => tekst.includes(fiksid)));
        if (test.includes(fiksid)) {
            const hey = paginerteSaker?.find((tekst) => (tekst.fiksDigisosId.includes(fiksid)));
            //console.log("ja", hey);
            //console.log("bah", Bare(hey.fiksDigisosId));
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

        if (hey.find((e) => e?.tekstArgument.includes("NAV Bergenhus"))) {
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

//export const NavKontorInfoBanner = (props: Props) => {
//    const {data: saker} = useHentAlleSaker();
//    console.log("saker", saker)
//    const hey = saker?.map((item) => item.fiksDigisosId);
//    console.log("hey", hey);
//    Array.from(hey).forEach((e,i) => console.log("e",e));
//    console.log("wata", wat);
//    const {data: hendelser} = useHentHendelser();
//
//};





export const NavKontorInfoBanner = (props: Props) => {
    const {data: saker} = useHentAlleSaker();
    if (saker) {
        return TesterSaker(saker, props?.fiksDigisosId);
    }
};*/
