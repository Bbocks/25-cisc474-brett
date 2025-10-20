import { z } from 'zod';

export const assignmentDto = z.object({
	id: z.string(),
	courseId: z.string(),
	title: z.string(),
	description: z.string().optional(),
	dueAt: z.string().nullable().optional(),
	totalPoints: z.number().optional(),
});

export const assignmentCreateDto = z.object({
	courseId: z.string(),
	title: z.string().min(1),
	description: z.string().optional(),
	dueAt: z.string().nullable().optional(),
	totalPoints: z.number().optional(),
});

export const assignmentUpdateDto = z.object({
	id: z.string(),
	title: z.string().min(1).optional(),
	description: z.string().optional(),
	dueAt: z.string().nullable().optional(),
	totalPoints: z.number().optional(),
}).refine((d) => d.title !== undefined || d.description !== undefined || d.dueAt !== undefined, {
	message: 'At least one field must be provided',
});

export const assignmentIdDto = z.object({ id: z.string() });

export type AssignmentDto = z.infer<typeof assignmentDto>;
export type AssignmentCreateDto = z.infer<typeof assignmentCreateDto>;
export type AssignmentUpdateDto = z.infer<typeof assignmentUpdateDto>;
export type AssignmentIdDto = z.infer<typeof assignmentIdDto>;


