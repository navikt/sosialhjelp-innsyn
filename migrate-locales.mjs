import l from "lodash";
import * as fs from "node:fs";

const lang = ["nb", "nn", "en"];

const abc = (lang) => [`${lang}/common.json`, `${lang}/utbetalinger.json`];

lang.forEach((it) => {
    const loadJSON = (path) => JSON.parse(fs.readFileSync(new URL(path, import.meta.url)));
    const common = loadJSON(`./public/locales/${abc(it)[0]}`);
    const utbetalinger = loadJSON(`./public/locales/${abc(it)[1]}`);
    let commonEntries = Object.entries(common).map(([key, val]) => [`common.${key}`, val]);
    let utbetalingerEntries = Object.entries(utbetalinger).map(([key, val]) => [`utbetalinger.${key}`, val]);
    const bothEntries = [...commonEntries, ...utbetalingerEntries];
    const output = bothEntries.reduce((acc, [key, value]) => l.set(acc, key, value), {});
    fs.writeFileSync(`./messages/${it}.json`, JSON.stringify(output), { encoding: "utf-8" });
});
