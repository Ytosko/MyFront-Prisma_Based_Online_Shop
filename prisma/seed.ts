import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const email = 'admin@example.com'
    const password = await bcrypt.hash('password123', 10)

    const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            email,
            password,
            role: 'ADMIN',
        },
    })

    const config = await prisma.storeConfig.findFirst()
    if (!config) {
        await prisma.storeConfig.create({
            data: {
                storeName: "White Label Shop",
                primaryColor: "#007acc",
                currency: "USD"
            }
        })
    }

    console.log({ user })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
