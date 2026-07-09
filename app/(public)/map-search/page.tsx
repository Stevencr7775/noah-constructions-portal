import { prisma } from "@/lib/prisma";
import MapSearchView from "./MapSearchView";

export const revalidate = 60;

export default async function MapSearchPage() {
  const properties = await prisma.property.findMany({
    where: {
      latitude: { not: null },
      longitude: { not: null }
    },
    select: {
      id: true,
      propertyId: true,
      title: true,
      latitude: true,
      longitude: true,
      totalPrice: true,
      locality: true,
      city: true,
      status: true,
      propertyType: true,
      media: {
        where: { type: 'image' },
        take: 1,
        select: { url: true }
      }
    }
  });

  return (
    <div style={{ height: "calc(100vh - 80px)", marginTop: "80px" }}>
      <MapSearchView properties={properties} />
    </div>
  );
}
