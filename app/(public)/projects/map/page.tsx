import { prisma } from "@/lib/prisma";
import ProjectMapView from "./ProjectMapView";

export const revalidate = 60;

export default async function ProjectMapPage() {
  const projects = await prisma.project.findMany({
    include: {
      builder: { select: { companyName: true } },
      properties: {
        where: { latitude: { not: null }, longitude: { not: null } },
        take: 1,
        select: { latitude: true, longitude: true, locality: true, city: true }
      }
    }
  });

  // Filter out projects with no properties that have coordinates
  const validProjects = projects
    .filter(p => p.properties.length > 0)
    .map(p => ({
       id: p.id,
       title: p.title,
       description: p.description,
       status: p.status,
       progress: p.progress,
       builderName: p.builder?.companyName,
       latitude: p.properties[0].latitude,
       longitude: p.properties[0].longitude,
       locality: p.properties[0].locality,
       city: p.properties[0].city
    }));

  return (
    <div style={{ height: "calc(100vh - 80px)", marginTop: "80px" }}>
      <ProjectMapView projects={validProjects} />
    </div>
  );
}
