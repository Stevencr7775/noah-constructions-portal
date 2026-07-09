import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://noahconstructions.com';

  // Fetch dynamic routes
  const projects = await prisma.project.findMany({
    select: { id: true, updatedAt: true }
  });

  const properties = await prisma.property.findMany({
    select: { id: true, updatedAt: true }
  });

  const blogs = await prisma.blogPost.findMany({
    select: { slug: true, updatedAt: true },
    where: { status: 'Published' }
  });

  const projectUrls = projects.map((p) => ({
    url: `\${baseUrl}/projects/\${p.id}`,
    lastModified: p.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const propertyUrls = properties.map((p) => ({
    url: `\${baseUrl}/properties/\${p.id}`,
    lastModified: p.updatedAt,
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  const blogUrls = blogs.map((b) => ({
    url: `\${baseUrl}/blogs/\${b.slug}`,
    lastModified: b.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const staticUrls = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1 },
    { url: `\${baseUrl}/about-us`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `\${baseUrl}/contact-us`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `\${baseUrl}/search`, lastModified: new Date(), changeFrequency: 'always' as const, priority: 0.9 },
    { url: `\${baseUrl}/buy-properties`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
  ];

  return [...staticUrls, ...projectUrls, ...propertyUrls, ...blogUrls];
}
