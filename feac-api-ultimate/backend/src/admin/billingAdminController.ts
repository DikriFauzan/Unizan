import prisma from "../config/db";

export const getAllUsersBilling = async () => {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            role: true,
            tier: true,
            quota: true,
            used: true
        }
    });
    return users;
};

export const adjustQuota = async (userId: string, amount: number) => {
    return prisma.user.update({
        where: { id: userId },
        data: { quota: amount }
    });
};

export const ownerTopUp = async (userId: string, amount: number) => {
    return prisma.user.update({
        where: { id: userId },
        data: { quota: { increment: amount } }
    });
};

export const adminTokenTransfer = async (fromId: string, toId: string, amount: number) => {
    await prisma.user.update({
        where: { id: fromId },
        data: { quota: { decrement: amount } }
    });

    return prisma.user.update({
        where: { id: toId },
        data: { quota: { increment: amount } }
    });
};
