import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: "https://nav.no/sosialhjelp/innsyn",
            lastModified: new Date(),
            changeFrequency: "daily",
            alternates: {
                languages: {
                    nb: "https://nav.no/sosialhjelp/innsyn/nb",
                    nn: "https://nav.no/sosialhjelp/innsyn/nn",
                    en: "https://nav.no/sosialhjelp/innsyn/en",
                },
            },
        },
    ];
}
