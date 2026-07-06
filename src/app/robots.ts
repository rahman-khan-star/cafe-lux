import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://cafelux.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/menu", "/food/"],
        disallow: ["/admin", "/dashboard", "/checkout", "/api/", "/cart"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
