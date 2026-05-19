import { prisma } from "../config/prisma.js";
import type {
  CreateLessonPlanInput,
  UpdateLessonPlanInput,
  QueryLessonPlansInput,
} from "../validators/lesson-plan.validator.js";

export async function createLessonPlan(data: CreateLessonPlanInput) {
  const { tags, ...planData } = data;

  return prisma.lessonPlan.create({
    data: {
      ...planData,
      tags: {
        connectOrCreate: tags.map((name) => ({
          where: { name },
          create: { name },
        })),
      },
    },
    include: { tags: true },
  });
}

export async function getLessonPlans(query: QueryLessonPlansInput) {
  const {
    page,
    limit,
    search,
    discipline,
    tag,
    dateFrom,
    dateTo,
    sortBy,
    sortOrder,
  } = query;

  const where: Record<string, unknown> = {};

  if (search) {
    where.title = { contains: search, mode: "insensitive" };
  }

  if (discipline) {
    where.discipline = { equals: discipline, mode: "insensitive" };
  }

  if (tag) {
    where.tags = { some: { name: { equals: tag, mode: "insensitive" } } };
  }

  if (dateFrom || dateTo) {
    where.scheduledDate = {
      ...(dateFrom && { gte: dateFrom }),
      ...(dateTo && { lte: dateTo }),
    };
  }

  const [data, total] = await Promise.all([
    prisma.lessonPlan.findMany({
      where,
      include: { tags: true },
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.lessonPlan.count({ where }),
  ]);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getLessonPlanById(id: string) {
  return prisma.lessonPlan.findUnique({
    where: { id },
    include: { tags: true },
  });
}

export async function updateLessonPlan(
  id: string,
  data: UpdateLessonPlanInput
) {
  const { tags, ...planData } = data;

  const updateData: Record<string, unknown> = { ...planData };

  if (tags !== undefined) {
    updateData.tags = {
      set: [],
      connectOrCreate: tags.map((name) => ({
        where: { name },
        create: { name },
      })),
    };
  }

  return prisma.lessonPlan.update({
    where: { id },
    data: updateData,
    include: { tags: true },
  });
}

export async function deleteLessonPlan(id: string) {
  return prisma.lessonPlan.delete({ where: { id } });
}

export async function getDisciplines() {
  const result = await prisma.lessonPlan.findMany({
    select: { discipline: true },
    distinct: ["discipline"],
    orderBy: { discipline: "asc" },
  });
  return result.map((r) => r.discipline);
}

export async function getAllTags() {
  return prisma.tag.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
}
