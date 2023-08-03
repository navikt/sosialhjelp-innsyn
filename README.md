![](https://github.com/navikt/sosialhjelp-innsyn/workflows/Build%20image/badge.svg?branch=master)

# Sosialhjelp innsyn

Frontend for innsyn av søknad om sosialhjelp.

## Kjøring lokalt mot lokal utviklingsbackend

### Backend

Eksempel ihht [«Oppsett av lokalt utviklingsmiljø»](https://github.com/navikt/digisos/blob/main/oppsett-devmiljo.md#docker-compose--mock-milj%C3%B8) i digisos-repoet:

```shell
cd ../digisos-docker-compose
docker-compose up \
                  sosialhjelp-mock-alt \
                  sosialhjelp-mock-alt-api \
                  sosialhjelp-innsyn-api
```

### Github package registry

Vi bruker Github sitt package registry for npm pakker, siden flere av Nav sine pakker kun blir publisert her.

For å kunne kjøre `npm install` lokalt må du logge inn mot Github package registry:

-   Lag/forny access token med repo og read:packages rettigheter i github ( under developer settings). husk enable sso
-   Login på npm med `npm login --scope=@navikt --registry=https://npm.pkg.github.com` og benytt github brukernavn, epost og tokenet du nettopp genererte

### Frontend

#### Miljøvariabler

Lag `.env.local` på rot for miljøvariabler. Eksempel:

```
NEXT_PUBLIC_BASE_PATH=/sosialhjelp/innsyn
NEXT_PUBLIC_RUNTIME_ENVIRONMENT=local
NEXT_PUBLIC_DEKORATOR_MILJO=local
NEXT_PUBLIC_API_BASE_URL=http://localhost:8989/sosialhjelp/mock-alt-api/login-api/sosialhjelp/innsyn-api
```

#### Lokal server

```shell
npm install # Hent avhengigheter
npm run dev #  starter dev-server
npm test # Kjør enhetstestene
```

Hvis det er skjedd endringer i apiet må man også oppdatere typegenerering fra swagger-dokumentasjon. Dette gjøres via  
`npm run orval`

Swagger-docs hentes inn fra mock-miljø via kommonadoen  
`npm run fetch-api-docs`

Se også [utviklerdokumentasjonen](https://teamdigisos.intern.nav.no/docs/utviklerdokumentasjon/kom%20igang%20med%20utvikling/#frontend) vår.

## Ved endringer i innsyn-api

```shell
npm run fetch-api-docs # Hent OpenAPI definition for innsyn-api fra mock-miljø og lagrer i innsyn-api.json
npm run orval # genererer typer fra innsyn-api.json
```

Eventuelt kan innsyn-api.json genereres fra lokal backend ved å kjøre

```shell
npm run fetch-api-docs-local
```

## How-to

For å teste innsynsløsning, kan man laste opp innsynsdata som JSON til API via swaggersidene slik:

-   Gå til swagger i [mock](https://digisos.ekstern.dev.nav.no/sosialhjelp/innsyn-api/swagger-ui/index.html)
-   Velg **digisos-api-controller** og tilhørende POST-kall, og deretter **'Try it out'**
-   Lim inn dine testdata som jsonDigisosSoker (digisos-soker.json)
-   Velg en **soknadId** for dine testdata
-   Gå til status-siden i [mock](https://digisos.ekstern.dev.nav.no/sosialhjelp/innsyn/soknadId/status)
-   Endre **soknadId** i url til å matche din soknadId fra steg 4 for å se innsynsvisningen med dine testdata

## Kodestil

Dette prosjektet bruker formatering av kode med prettier. Det er lagt inn automatisk formatering av kode med en pre-commit hook.
Detaljer rundt dette ligger i `package.json`. Konfigurasjon av prettier ligger i `.prettierrc.js`.

Dersom du i tillegg ønsker å sette opp formatering av kode i IntelliJ slik at koden blir formatert før du committer kan det gjøres slik:

-   Installer Prettier plugin i IntelliJ
-   Trykk ⌥⇧⌘P for å formatere kode
-   Optional: Sette opp filewatcher og automatisk formatering. Se her `https://prettier.io/docs/en/webstorm.html#running-prettier-on-save-using-file-watcher`

## Bygg og deploy

Image bygges vha Github Actions: https://github.com/navikt/sosialhjelp-innsyn/actions/workflows/build.yml

Siden appen ikke kjører på nais lengre, se [ikke-nais deploy](https://teamdigisos.intern.nav.no/docs/utviklerdokumentasjon/ikke-nais%20deploy) for informasjon om deploy.

### Manuell deploy til dev (NB: gjelder kun dev-gcp)

Deploy til dev-gcp gjøres via Github Actions, se: https://github.com/navikt/sosialhjelp-innsyn/actions/workflows/deploy_dev.yml

## Hvordan komme i gang

[Felles dokumentasjon for våre frontend apper](https://teamdigisos.intern.nav.no/docs/utviklerdokumentasjon/kom%20igang%20med%20utvikling#frontend)
