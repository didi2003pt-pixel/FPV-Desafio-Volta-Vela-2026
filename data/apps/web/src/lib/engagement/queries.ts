import { prisma } from "@desafio/database";
export async function activeMissions(now = new Date()) { return prisma.mission.findMany({ where:{active:true,startsAt:{lte:now},endsAt:{gte:now}}, include:{sponsor:true,stage:true}, orderBy:{endsAt:"asc"} }); }
export async function publishedPrizes() { return prisma.prize.findMany({where:{status:"PUBLISHED"},include:{sponsor:true},orderBy:{awardAt:"asc"}}); }
export async function userNotifications(userId:string) { return prisma.notification.findMany({where:{userId},orderBy:{createdAt:"desc"},take:50}); }
