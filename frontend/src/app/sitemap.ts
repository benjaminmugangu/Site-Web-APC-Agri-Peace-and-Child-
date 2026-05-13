import { MetadataRoute } from 'next'
import { listProjects } from '@/lib/api/projects'
import { listArticles } from '@/lib/api/articles'


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://apc-agripeace.org'

  // Fetch projects and articles for dynamic routes with safety
  let projectsRes = { data: [] };
  let articlesRes = { data: [] };

  try {
    [projectsRes, articlesRes] = await Promise.all([
      listProjects({ perPage: 100 }),
      listArticles({ perPage: 100 })
    ])
  } catch (error) {
    console.error("Sitemap generation error:", error);
  }

  const projectUrls = (projectsRes.data || []).map((project: any) => ({

    url: `${baseUrl}/projets/${project.slug}`,
    lastModified: new Date(project.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const articleUrls = articlesRes.data.map((article: any) => ({
    url: `${baseUrl}/actualites/${article.slug}`,
    lastModified: new Date(article.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  const routes = [
    '',
    '/a-propos',
    '/projets',
    '/services',
    '/actualites',
    '/contact',
    '/nous-rejoindre',
    '/appels-d-offres',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.9,
  }))

  return [...routes, ...projectUrls, ...articleUrls]
}
