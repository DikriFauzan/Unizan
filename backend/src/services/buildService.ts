import prisma from "../config/db";

export async function createOrUpdateBuild(payload: {
  buildId: string;
  userId?: string;
  project?: string;
  branch?: string;
  status?: string;
  artifact?: string;
  logs?: string;
}) {
  const b = await prisma.build.upsert({
    where: { buildId: payload.buildId },
    update: {
      status: payload.status || "pending",
      artifact: payload.artifact || undefined,
      logs: payload.logs || undefined,
    },
    create: {
      buildId: payload.buildId,
      userId: payload.userId,
      project: payload.project,
      branch: payload.branch,
      status: payload.status || "pending",
      artifact: payload.artifact || undefined,
      logs: payload.logs || undefined,
    }
  });
  return b;
}

export async function getBuild(buildId: string) {
  return prisma.build.findUnique({ where: { buildId } });
}
