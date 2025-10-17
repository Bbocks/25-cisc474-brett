import { z } from 'zod';

export const courseDto = z.object({
	id: z.string(),
	code: z.string(),
	title: z.string(),
	description: z.string().optional(),
	startDate: z.string().nullable().optional(),
	endDate: z.string().nullable().optional(),
	createdAt: z.string(),
});

export const courseCreateDto = z.object({
	code: z.string().min(1),
	title: z.string().min(1),
	description: z.string().optional(),
	startDate: z.string().nullable().optional(),
	endDate: z.string().nullable().optional(),
});

export const courseUpdateDto = z.object({
	id: z.string(),
	code: z.string().min(1).optional(),
	title: z.string().min(1).optional(),
	description: z.string().optional(),
	startDate: z.string().nullable().optional(),
	endDate: z.string().nullable().optional(),
}).refine((d) => d.title !== undefined || d.description !== undefined, {
	message: 'At least one field must be provided',
});

export const courseIdDto = z.object({ id: z.string() });

export type CourseDto = z.infer<typeof courseDto>;
export type CourseCreateDto = z.infer<typeof courseCreateDto>;
export type CourseUpdateDto = z.infer<typeof courseUpdateDto>;
export type CourseIdDto = z.infer<typeof courseIdDto>;


