import {prisma} from "@/lib/prisma"

export default async function findUser(email: string) {
    const user = await prisma.user.findUnique({where:{email:email}})

    if (!user) {
        return null
    }

    return user
}