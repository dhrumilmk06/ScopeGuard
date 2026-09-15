import { Request, Response } from 'express';
import { createProject } from './projectService';

export async function createProjectHandler(req: Request, res: Response) {
  try {
    const { title, description, clientName, clientEmail, clientPhone, freelancerId } = req.body;
    
    // Note: Once auth is implemented, freelancerId will come from req.user.id
    if (!freelancerId) {
      throw new Error("freelancerId is required in the body until auth is implemented.");
    }

    const project = await createProject({
      freelancerId,
      title,
      description,
      clientName,
      clientEmail,
      clientPhone
    });

    res.status(201).json(project);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}
