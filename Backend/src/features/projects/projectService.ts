import prisma from '../../config/database';

interface CreateProjectInput {
  freelancerId: string;
  title: string;
  description?: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
}

export async function createProject(input: CreateProjectInput) {
  const project = await prisma.project.create({
    data: {
      freelancerId: input.freelancerId,
      title: input.title,
      description: input.description,
      clientName: input.clientName,
      clientEmail: input.clientEmail,
      clientPhone: input.clientPhone,
      status: 'active',
    },
  });

  return project;
}
