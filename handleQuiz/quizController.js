const { PrismaClient, Gender } = require("../generated/prisma")
const prisma = new PrismaClient()


const getListOfQuizzes = async () => {
    try {
        const data = await prisma.quiz.findMany({
            select: {
                id: true,
                title: true,
                description: true,
                level: true
            }
        });
        return { success: true, data };
    } catch (error) {
        console.error("Error fetching quiz list:", error);
        return { success: false, error: "Failed to fetch quiz list" };
    }
};


const getQuiz = async ({ id }) => {
    if (!id) return { success: false, error: "Quiz ID is required" };

    try {
        const quiz = await prisma.quiz.findUnique({
            where: { id }
        });

        if (!quiz) {
            return { success: false, error: "Quiz not found" };
        }

        return { success: true, data: quiz };
    } catch (error) {
        console.error("Error fetching quiz:", error);
        return { success: false, error: "Failed to fetch quiz" };
    }
};


module.exports = {getListOfQuizzes, getQuiz}