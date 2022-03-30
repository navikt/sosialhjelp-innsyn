import {filterDokumentasjonkrav, filterVilkar, SaksUtbetaling, skalViseAlleHvisUtbetalingIkkeUtgaatt} from "./Oppgaver";
import {DokumentasjonKrav, Vilkar} from "../../redux/innsynsdata/innsynsdataReducer";

test("Utbetalingsperioden er forbigått med 21 dager og er utbetalt, vilkår/dok.krav filtreres bort", () => {
    const utbetalingsReferanser = ["abc"];
    const saksutbetalinger: SaksUtbetaling = {
        abc: {
            fom: "2022-02-04",
            tom: "2022-03-01",
            utbetlingsreferanse: "abc",
            status: "UTBETALT",
        },
    };
    const todaysDate = new Date("2022-03-22");
    const filtrerteUtbetalinger = skalViseAlleHvisUtbetalingIkkeUtgaatt(
        utbetalingsReferanser,
        saksutbetalinger,
        todaysDate
    );
    expect(filtrerteUtbetalinger).toBe(false);
});

test("Utbetalingsperioden er ikke forbigått med 21 dager og er utbetalt, vilkår/dok.krav vises fortsatt", () => {
    const utbetalingsReferanser = ["abc"];
    const saksutbetalinger: SaksUtbetaling = {
        abc: {
            fom: "2022-02-04",
            tom: "2022-03-15",
            utbetlingsreferanse: "abc",
            status: "UTBETALT",
        },
    };
    const todaysDate = new Date("2022-03-22");
    const filtrerteUtbetalinger = skalViseAlleHvisUtbetalingIkkeUtgaatt(
        utbetalingsReferanser,
        saksutbetalinger,
        todaysDate
    );
    expect(filtrerteUtbetalinger).toBe(true);
});

test("Utbetalingsperioden er forbigått med 21 dager for en utbetaling, vilkår/dok.krav med utb.ref til den utbetalingen fjernes", () => {
    const utbetalingsReferanser = ["abc", "def", ""];
    const saksutbetalinger: SaksUtbetaling = {
        abc: {
            fom: "2022-02-04",
            tom: "2022-03-01",
            utbetlingsreferanse: "abc",
            status: "UTBETALT",
        },
        def: {
            fom: "2022-02-04",
            tom: "2022-03-15",
            utbetlingsreferanse: "def",
            status: "UTBETALT",
        },
    };
    const todaysDate = new Date("2022-03-22");
    const filtrerteUtbetalinger = skalViseAlleHvisUtbetalingIkkeUtgaatt(
        utbetalingsReferanser,
        saksutbetalinger,
        todaysDate
    );
    expect(filtrerteUtbetalinger).toBe(true);
});

test("vilkår/dok.krav uten urb.ref blir ikke filtrert bort", () => {
    const utbetalingsReferanser: string[] = [];
    const saksutbetalinger: SaksUtbetaling = {
        abc: {
            fom: "2022-02-04",
            tom: "2022-03-01",
            utbetlingsreferanse: "",
            status: "UTBETALT",
        },
    };
    const todaysDate = new Date("2022-03-23");
    const filtrerteUtbetalinger = skalViseAlleHvisUtbetalingIkkeUtgaatt(
        utbetalingsReferanser,
        saksutbetalinger,
        todaysDate
    );
    expect(filtrerteUtbetalinger).toBe(true);
});

test("alle dok.krav vises når utbetalingsperioden til en utb.ref ikke er forbigått med 21 dager", () => {
    const dokumentasjonkrav: DokumentasjonKrav[] = [
        {
            dokumentasjonkravId: "1",
            dokumentasjonkravElementer: [
                {
                    hendelsetype: undefined,
                    dokumentasjonkravReferanse: "dokumentasjonkravReferanse",
                    status: "UTBETALT",
                    utbetalingsReferanse: ["utbetalingsReferanse1"],
                },
            ],
        },
        {
            dokumentasjonkravId: "2",
            dokumentasjonkravElementer: [
                {
                    hendelsetype: undefined,
                    dokumentasjonkravReferanse: "dokumentasjonkravReferanse",
                    status: "UTBETALT",
                    utbetalingsReferanse: ["utbetalingsReferanse2"],
                },
            ],
        },
    ];
    const saksutbetalinger: SaksUtbetaling = {
        utbetalingsReferanse1: {
            fom: "2022-02-04",
            tom: "2022-03-01",
            utbetlingsreferanse: "utbetalingsReferanse1",
            status: "UTBETALT",
        },
        utbetalingsReferanse2: {
            fom: "2022-02-04",
            tom: "2022-03-15",
            utbetlingsreferanse: "utbetalingsReferanse2",
            status: "UTBETALT",
        },
    };

    const todaysDate = new Date("2022-03-22");
    const filtrerteUtbetalinger = filterDokumentasjonkrav(dokumentasjonkrav, saksutbetalinger, todaysDate);
    expect(filtrerteUtbetalinger).toBe(dokumentasjonkrav);
});

test("alle vilkår vises når utbetalingsperioden til en utb.ref ikke er forbigått med 21 dager", () => {
    const vilkar: Vilkar[] = [
        {hendelsetidspunkt: "", vilkarReferanse: "", status: "", utbetalingsReferanse: ["utbetalingsReferanse1"]},
        {hendelsetidspunkt: "", vilkarReferanse: "", status: "", utbetalingsReferanse: ["utbetalingsReferanse2"]},
    ];
    const saksutbetalinger: SaksUtbetaling = {
        utbetalingsReferanse1: {
            fom: "2022-02-04",
            tom: "2022-03-01",
            utbetlingsreferanse: "utbetalingsReferanse1",
            status: "UTBETALT",
        },
        utbetalingsReferanse2: {
            fom: "2022-02-04",
            tom: "2022-03-15",
            utbetlingsreferanse: "utbetalingsReferanse2",
            status: "UTBETALT",
        },
    };

    const todaysDate = new Date("2022-03-22");
    const filtrerteUtbetalinger = filterVilkar(vilkar, saksutbetalinger, todaysDate);
    expect(filtrerteUtbetalinger).toBe(vilkar);
});

test("dok.krav fjernes når utbetalingsperiode for begge utbetalinger er forbigått med 21 dager og har status utbetalt", () => {
    const dokumentasjonkrav: DokumentasjonKrav[] = [
        {
            dokumentasjonkravId: "1",
            dokumentasjonkravElementer: [
                {
                    hendelsetype: undefined,
                    dokumentasjonkravReferanse: "dokumentasjonkravReferanse",
                    status: "UTBETALT",
                    utbetalingsReferanse: ["utbetalingsReferanse1"],
                },
            ],
        },
        {
            dokumentasjonkravId: "2",
            dokumentasjonkravElementer: [
                {
                    hendelsetype: undefined,
                    dokumentasjonkravReferanse: "dokumentasjonkravReferanse",
                    status: "UTBETALT",
                    utbetalingsReferanse: ["utbetalingsReferanse2"],
                },
            ],
        },
    ];
    const saksutbetalinger: SaksUtbetaling = {
        utbetalingsReferanse1: {
            fom: "2022-02-01",
            tom: "2022-02-28",
            utbetlingsreferanse: "utbetalingsReferanse1",
            status: "UTBETALT",
        },
        utbetalingsReferanse2: {
            fom: "2022-02-01",
            tom: "2022-02-28",
            utbetlingsreferanse: "utbetalingsReferanse2",
            status: "UTBETALT",
        },
    };

    const todaysDate = new Date("2022-03-31");
    const filtrerteUtbetalinger = filterDokumentasjonkrav(dokumentasjonkrav, saksutbetalinger, todaysDate);
    expect(filtrerteUtbetalinger.length).toBe(0);
});

test("vilkår fjernes når utbetalingsperiode for begge utbetalinger er forbigått med 21 dager og har status utbetalt", () => {
    const vilkar: Vilkar[] = [
        {hendelsetidspunkt: "", vilkarReferanse: "", status: "", utbetalingsReferanse: ["utbetalingsReferanse1"]},
        {hendelsetidspunkt: "", vilkarReferanse: "", status: "", utbetalingsReferanse: ["utbetalingsReferanse2"]},
    ];
    const saksutbetalinger: SaksUtbetaling = {
        utbetalingsReferanse1: {
            fom: "2022-02-01",
            tom: "2022-02-28",
            utbetlingsreferanse: "utbetalingsReferanse1",
            status: "UTBETALT",
        },
        utbetalingsReferanse2: {
            fom: "2022-02-01",
            tom: "2022-02-28",
            utbetlingsreferanse: "utbetalingsReferanse2",
            status: "UTBETALT",
        },
    };

    const todaysDate = new Date("2022-03-31");
    const filtrerteUtbetalinger = filterVilkar(vilkar, saksutbetalinger, todaysDate);
    expect(filtrerteUtbetalinger.length).toBe(0);
});

test("viser alle dok.krav hvis en mangler utb.ref", () => {
    const dokumentasjonkrav: DokumentasjonKrav[] = [
        {
            dokumentasjonkravId: "1",
            dokumentasjonkravElementer: [
                {
                    hendelsetidspunkt: "",
                    hendelsetype: undefined,
                    dokumentasjonkravReferanse: "dokumentasjonkravReferanse",
                    status: "RELEVANT",
                    utbetalingsReferanse: ["utbetalingsReferanse1"],
                },
                {
                    hendelsetidspunkt: "",
                    hendelsetype: undefined,
                    dokumentasjonkravReferanse: "dokumentasjonkravReferanse",
                    status: "RELEVANT",
                    utbetalingsReferanse: ["utbetalingsReferanse2"],
                },
                {
                    hendelsetidspunkt: "",
                    hendelsetype: undefined,
                    dokumentasjonkravReferanse: "dokumentasjonkravReferanse",
                    status: "RELEVANT",
                    utbetalingsReferanse: [],
                },
            ],
        },
    ];
    const saksutbetalinger: SaksUtbetaling = {
        utbetalingsReferanse1: {
            fom: "2022-02-01",
            tom: "2022-02-28",
            utbetlingsreferanse: "utbetalingsReferanse1",
            status: "UTBETALT",
        },
        utbetalingsReferanse2: {
            fom: "2022-02-01",
            tom: "2022-02-28",
            utbetlingsreferanse: "utbetalingsReferanse2",
            status: "UTBETALT",
        },
    };

    const todaysDate = new Date("2022-03-31");
    const filtrerteUtbetalinger = filterDokumentasjonkrav(dokumentasjonkrav, saksutbetalinger, todaysDate);
    expect(filtrerteUtbetalinger).toBe(dokumentasjonkrav);
});

test("viser alle vilkår hvis en mangler utb.ref", () => {
    const vilkar: Vilkar[] = [
        {hendelsetidspunkt: "", vilkarReferanse: "", status: "", utbetalingsReferanse: ["utbetalingsReferanse1"]},
        {hendelsetidspunkt: "", vilkarReferanse: "", status: "", utbetalingsReferanse: ["utbetalingsReferanse2"]},
        {hendelsetidspunkt: "", vilkarReferanse: "", status: "", utbetalingsReferanse: []},
    ];
    const saksutbetalinger: SaksUtbetaling = {
        utbetalingsReferanse1: {
            fom: "2022-02-01",
            tom: "2022-02-28",
            utbetlingsreferanse: "utbetalingsReferanse1",
            status: "UTBETALT",
        },
        utbetalingsReferanse2: {
            fom: "2022-02-01",
            tom: "2022-02-28",
            utbetlingsreferanse: "utbetalingsReferanse2",
            status: "UTBETALT",
        },
    };
    const todaysDate = new Date("2022-03-31");
    const filtrerteUtbetalinger = filterVilkar(vilkar, saksutbetalinger, todaysDate);
    expect(filtrerteUtbetalinger).toBe(vilkar);
});

test("hvorfor ting fjernes", () => {
    const dokumentasjonkrav: DokumentasjonKrav[] = [
        {
            dokumentasjonkravElementer: [
                {
                    hendelsetype: undefined,
                    dokumentasjonkravReferanse: "f4rfd2c9-tmvy-3v9a-gund-mgam3ijm4plk",
                    status: "RELEVANT",
                    utbetalingsReferanse: ["2o9g9avk-kasl-1nja-d3s4-1j7knpdrjhuo"],
                },
                {
                    hendelsetype: undefined,
                    dokumentasjonkravReferanse: "42zzrcjz-39fk-qwgx-0uk2-qttnm4c73xu6",
                    status: "RELEVANT",
                    utbetalingsReferanse: ["gln4440d-azzt-bqcv-cpra-ur50f8hawfy9"],
                },
            ],
            dokumentasjonkravId: "d3f9e91299c2f5635ca4669c0605a4e745f3eda833477cf1039cc9eb48dd0ff2",
        },
    ];

    const utbetalinger: SaksUtbetaling = {
        "2o9g9avk-kasl-1nja-d3s4-1j7knpdrjhuo": {
            status: "UTBETALT",
            fom: "2022-02-01",
            tom: "2022-02-28",
            utbetlingsreferanse: "2o9g9avk-kasl-1nja-d3s4-1j7knpdrjhuo",
        },
        "gln4440d-azzt-bqcv-cpra-ur50f8hawfy9": {
            status: "UTBETALT",
            fom: "2022-05-23",
            tom: "2022-06-13",
            utbetlingsreferanse: "gln4440d-azzt-bqcv-cpra-ur50f8hawfy9",
        },
    };

    const todaysDate = new Date("2022-03-30");
    const filterDokkrav = filterDokumentasjonkrav(dokumentasjonkrav, utbetalinger, todaysDate);
    expect(filterDokkrav).toBe(dokumentasjonkrav);
});
