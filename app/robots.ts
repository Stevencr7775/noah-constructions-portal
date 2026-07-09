import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://noahconstructions.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/buyer/', '/seller/', '/agent/', '/corporate/', '/builder/', '/api/'],
    },
    sitemap: `\${baseUrl}/sitemap.xml`,
  };
}
