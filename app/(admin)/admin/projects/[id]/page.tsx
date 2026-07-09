import { prisma } from "@/lib/prisma";
import ProjectForm from "../ProjectForm";
import { notFound } from "next/navigation";

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const project = await prisma.project.findUnique({
    where: { id: params.id }
  });

  if (!project) {
    notFound();
  }

  return <ProjectForm project={project} isNew={false} />;
}
