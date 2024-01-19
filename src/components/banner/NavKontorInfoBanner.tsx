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
    //const ble = hendelser?.map((tekst) => {
    //    return (
    //        (tekst.tekstArgument === "NAV Årstad, Årstad" || tekst.tekstArgument === "NAV Årstad, Årstad kommune") ??
    //        tekst.tekstArgument
    //    );
    //    //return tekst.tekstArgument.includes("NAV Årstad") ?? tekst.tekstArgument;
    //    //return tekst.tekstArgument.includes("NAV Årstad");
    //});

    const ble = hendelser?.find((tekst) => tekst.tekstArgument === "NAV Årstad, Årstad kommune");

    if (ble) {
        console.log("ble", ble);
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
    //console.log("fiksDigisosId",fiksDigisosId);
    const {data: hendelser} = useHentHendelser(fiksDigisosId);
    //console.log("hendelser", hendelser);
    //const ble = hendelser?.find((tekst) => tekst.tekstArgument === "NAV Årstad, Årstad kommune");
    return hendelser?.find((tekst) => tekst.tekstArgument === "NAV Årstad, Årstad kommune");
    //console.log("ble", ble);
    //return ble;
};

const BarePaginerte = (paginerteSaker: SaksListeResponse[]) => {
    //console.log("paginerteSaker", paginerteSaker);

    //paginerteSaker.map(item => console.log("map item", item));
    const hey = paginerteSaker?.map((item) => {
        return Bare(item.fiksDigisosId as string);
    });

    if (hey.find((e) => e?.tekstArgument === "NAV Årstad, Årstad kommune")) {
        console.log("hey", hey);

        //console.log("ble", ble);
        //if (ble) {
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

    //paginerteSaker.forEach( item => console.log("for item", item));
    //console.log("hey", hey);

    //const [hey, setHey] = useState(undefined);
    //let wazzzzza;
    //paginerteSaker?.forEach((value, index, array) => {
    //    console.log("val", value)
    //    console.log("index", index)
    //    console.log("array", array)
    //
    //    //console.log("value[index]?.fiksDigisosId", value[index]?.fiksDigisosId)
    //    //console.log("value.fiksDigisosId", value.fiksDigisosId)=
    //    //return (Bare(value.fiksDigisosId));
    //
    //    //console.log("val", value[index].fiksDigisosId)
    //    //let bleh = value[index]?.fiksDigisosId;
    //    let bleh = value.fiksDigisosId;
    //    //console.log("bleh?????", bleh);
    //    wazzzzza = bleh;
    //    //setHey(bleh);
    //    //setHey(wazzzzza);
    //    //console.log("arr",array)
    //})
    //
    //const sup = paginerteSaker?.map((value, index, array) => {
    //console.log("value", value);
    //console.log("index", index);
    //console.log("array", array);
    //    return value;
    //})
    //
    //console.log("sup", sup);
    //
    //console.log("hey????", hey);
    //console.log("wazzzzz", wazzzzza);
    //
    //const {data: hendelser} = useHentHendelser(wazzzzza);
    //
    //console.log("should be 1 thing", hendelser);
    //paginerteSaker.map((sak=> {
    //console.log("sak", sak.fiksDigisosId)
    //       return sak.fiksDigisosId;
    //}))
    //console.log("saker", props.paginerteSaker);
    //console.log("wat", wat);
    //return props.paginerteSaker.forEach((val)=> {
    //    return val?.fiksDigisosId;
    //
    //
    //const ble = hendelser?.find((tekst) => tekst.tekstArgument === "NAV Årstad, Årstad kommune");
    //console.log("ble", ble);
    //if(ble){
    //return (
    //    <div style={{marginBottom: "2rem"}}>
    //        <Alert variant="info">
    //            Har du lyst til å hjelpe oss med å lage gode digitale løsninger? Tirsdag 23. januar kl 09.00-15.00
    //            er vi hos NAV Ullern for å teste en ny løsning for digital klage. Kom gjerne innom!
    //        </Alert>
    //    </div>
    //);
    //}
};

export const NavKontorInfoBanner = (props: Props) => {
    //const fiksDigisosId = useFiksDigisosId();
    //const {data: saker} = useHentAlleSaker();

    //if(saker !== undefined){
    //return (BarePaginerte(saker));
    //paginerteSaker.map(item => console.log("map item", item));
    //const hey = saker.map(item =>
    //    Bare(item.fiksDigisosId)
    //);

    //if(hey.find(e => e?.tekstArgument === "NAV Årstad, Årstad kommune")){
    //    console.log("hey", hey);
    //
    //    //console.log("ble", ble);
    //    //if (ble) {
    //    return (
    //        <div style={{marginBottom: "2rem"}}>
    //            <Alert variant="info">
    //                Har du lyst til å hjelpe oss med å lage gode digitale løsninger? Tirsdag 23. januar kl 09.00-15.00
    //                er vi hos NAV Ullern for å teste en ny løsning for digital klage. Kom gjerne innom!
    //            </Alert>
    //        </div>
    //    );
    //    //}
    //}
    //}

    //return (console.log("saker", saker));
    if (props.fiksDigisosId) {
        return BareFiks(props.fiksDigisosId);
    }
    if (props.paginerteSaker) {
        return BarePaginerte(props.paginerteSaker);
    }
};

/***
export const NavKontorInfoBanner = (props: Props) => {
    const [isNAVUllern, setIsNAVUllern] = useState(false);
    //const {data: saker} = useHentAlleSaker();

    //console.log("ææææææ", props.paginerteSaker);
    //const fiksId = () => {
        //let wat;
        if (props.fiksDigisosId) {
            return BareFiks(props.fiksDigisosId);
        }
        //if(props.paginerteSaker){
        //    //props.paginerteSaker.map((sak: SaksListeResponse) => (
        //    //<li key={sak.fiksDigisosId ?? sak.soknadTittel}>
        //    //    <SakPanel
        //    //        fiksDigisosId={sak.fiksDigisosId}
        //    //        tittel={sak.soknadTittel}
        //    //        oppdatert={sak.sistOppdatert}
        //    //        url={sak.url}
        //    //        kilde={sak.kilde}
        //    //    />
        //    //</li>
        //    //))
        //    //wat =
        //    //return props.paginerteSaker.map((sak=> {
        //    //    //console.log("sak", sak.fiksDigisosId)
        //    //      return sak.fiksDigisosId;
        //    //}))
        //    //console.log("saker", props.paginerteSaker);
        //    //console.log("wat", wat);
        //    //return props.paginerteSaker.forEach((val)=> {
        //    //    return val?.fiksDigisosId;
        //    //})
        //}
        //return wat;
   // };
    //console.log("fiksid", fiksId());

    //if(fiksId().length > 1){
    //    console.log("wat")
    //}

    ////const fiksDigisosId = useFiksDigisosId();
    ////console.log("fiksdigisosid", fiksDigisosId);
    //const {data: hendelser, isLoading, isError} = useHentHendelser(fiksId());
    //console.log("hey", hendelser);
//
    //console.log("tester fungerDette", FungerDette(fiksId()))
//
    //const ble = hendelser?.map((tekst) => {
    //    return (
    //        (tekst.tekstArgument === "NAV Årstad, Årstad" || tekst.tekstArgument === "NAV Årstad, Årstad kommune") ??
    //        tekst.tekstArgument
    //    );
    //    //return tekst.tekstArgument.includes("NAV Årstad") ?? tekst.tekstArgument;
    //    //return tekst.tekstArgument.includes("NAV Årstad");
    //});
    //console.log("ble", ble);
//
    ////const hen = ble?.find((ele) => ele === "NAV Årstad");
    ////console.log("hen?", hen);


    //if (ble) {
        //return (
        //    <div style={{marginBottom: "2rem"}}>
        //        <Alert variant="info">
        //            Har du lyst til å hjelpe oss med å lage gode digitale løsninger? Tirsdag 23. januar kl 09.00-15.00
        //            er vi hos NAV Ullern for å teste en ny løsning for digital klage. Kom gjerne innom!
        //        </Alert>
        //    </div>
        //);
    //}
};*/
