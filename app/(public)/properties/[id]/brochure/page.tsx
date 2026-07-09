import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import BrochureClient from "./BrochureClient";

export const revalidate = 60;

export default async function PropertyBrochurePage({ params }: { params: { id: string } }) {
  const property = await prisma.property.findUnique({
    where: { id: params.id },
    include: {
      media: true,
      seller: {
        select: {
          name: true,
          email: true,
          mobile: true,
          type: true,
          agency: true,
          companyName: true,
        }
      }
    }
  });

  if (!property) {
    notFound();
  }

  // We fetch the base URL dynamically if possible, or assume localhost/production
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://noahconstructions.com";
  const propertyUrl = `${baseUrl}/properties/${property.id}`;

  return <BrochureClient property={property} propertyUrl={propertyUrl} />;
}
