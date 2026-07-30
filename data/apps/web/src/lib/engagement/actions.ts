"use server";
import { prisma } from "@desafio/database";
import { revalidatePath } from "next/cache";
import { requireUser } from "../session";
export async function completeMission(formData:FormData){ const user=await requireUser(); const missionId=String(formData.get("missionId")||""); const mission=await prisma.mission.findUnique({where:{id:missionId}}); if(!mission||!mission.active) throw new Error("Missão indisponível"); await prisma.missionCompletion.upsert({where:{missionId_userId:{missionId,userId:user.id}},create:{missionId,userId:user.id,status:mission.validationMode==="AUTOMATIC"?"APPROVED":"PENDING",pointsAwarded:mission.validationMode==="AUTOMATIC"?mission.points:0},update:{completedAt:new Date()}}); revalidatePath("/missoes"); }
export async function markNotificationRead(formData:FormData){ const user=await requireUser(); const id=String(formData.get("id")||""); await prisma.notification.updateMany({where:{id,userId:user.id},data:{status:"READ",readAt:new Date()}}); revalidatePath("/notificacoes"); }
