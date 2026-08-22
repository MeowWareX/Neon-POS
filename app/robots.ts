import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/pos/", "/dashboard/", "/api/"],
      },
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: ["/pos/", "/dashboard/", "/api/"],
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: ["/pos/", "/dashboard/", "/api/"],
      },
    ],
    sitemap: "https://www.clubneon.co/sitemap.xml",
  };
}
