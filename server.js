const express = require("express");
const {injectDecoratorServerSide} = require("@navikt/nav-dekoratoren-moduler/ssr");
const path = require("path");

const decoratorParams = {
    env: process.env.DEKORATOR_MILJO || "prod",
    simple: false,
    feedback: false,
    chatbot: false,
    shareScreen: false,
    utilsBackground: "white",
    logoutUrl: process.env.INNSYN_API_SINGLE_LOGOUT_URL || undefined,
    availableLanguages: [
        {
            locale: "nb",
            handleInApp: true,
        },
        {
            locale: "nn",
            handleInApp: true,
        },
        {
            locale: "en",
            handleInApp: true,
        },
    ],
};

const dockerImage = process.env.IMAGE || process.env.NAIS_APP_IMAGE;

console.log("starter innsyn fra docker image: ", dockerImage);

const app = express(); // create express app
app.disable("x-powered-by");

const buildPath = path.resolve(__dirname, "build");

const basePath = "/sosialhjelp/innsyn";

app.use(basePath, express.static(buildPath, {index: false}));

app.get(`${basePath}/internal/isAlive|isReady`, (req, res) => res.sendStatus(200));

app.use(basePath, (req, res, next) => {
    injectDecoratorServerSide({
        filePath: `${buildPath}/index.html`,
        ...decoratorParams,
    })
        .then((html) => {
            res.send(html);
        })
        .catch((e) => {
            console.error(`Failed to get decorator: ${e}`);
            res.status(500).send("Det har oppstått en feil. Venligst prøv igjen senere.");
        });
});

// start express server on port 8080
app.listen(8080, () => {
    console.log("server started on port 8080");
});
