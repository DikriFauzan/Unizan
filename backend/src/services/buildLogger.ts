import prisma from "../config/db";

export const logMessage = async (buildId: string, message: string) => {
    await prisma.buildLog.create({
        data: { buildId, message }
    });
};

export const getLogs = async (buildId: string) => {
    return prisma.buildLog.findMany({
        where: { buildId },
        orderBy: { createdAt: "asc" }
    });
};
