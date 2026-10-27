import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: "https://nav.no/sosialhjelp/innsyn",
            lastModified: new Date(),
            changeFrequency: "daily",
        },
    ];
}
