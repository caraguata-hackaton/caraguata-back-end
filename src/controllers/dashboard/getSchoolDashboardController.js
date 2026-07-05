import { prisma } from '../../helpers/dbConnection.js'

export async function getSchoolDashboardController(req, res, next) {
    try {
        const userId = res.locals.userId

        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                school: true,
            },
        })

        if (!user) {
            return res.status(401).json({
                message: "Usuário não autenticado.",
            })
        }

        if (!user.schoolId || !user.school) {
            return res.status(403).json({
                message: "Usuário não está vinculado a nenhuma escola.",
            })
        }

        const schoolId = user.schoolId

        const [
            latestTickets,
            totalTickets,
            inProgressTickets,
            completedTickets,
        ] = await prisma.$transaction([
            prisma.ticket.findMany({
                where: {
                    schoolId,
                },
                orderBy: {
                    createdAt: "desc",
                },
                take: 5,
            }),

            prisma.ticket.count({
                where: {
                    schoolId,
                },
            }),

            prisma.ticket.count({
                where: {
                    schoolId,
                    status: "IN_PROGRESS",
                },
            }),

            prisma.ticket.count({
                where: {
                    schoolId,
                    status: "COMPLETED",
                },
            }),
        ])

        return res.status(200).json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                schoolId: user.schoolId,
            },
            school: user.school,
            stats: {
                totalTickets,
                inProgressTickets,
                completedTickets,
            },
            latestTickets,
        })
    } catch (error) {
        return next(error)
    }
}