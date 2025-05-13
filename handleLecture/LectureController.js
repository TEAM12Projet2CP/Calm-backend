const { PrismaClient, Gender } = require("../generated/prisma")
const prisma = new PrismaClient()


const getListOfLectures = async () => {
    try {
        const output = await prisma.lecture.findMany({
            select: {
                id: true,
                title: true,
                description: true,
            }
        });
        return { success: true, data: output };
    } catch (error) {
        console.error("Error fetching lectures:", error);
        return { success: false, error: "Failed to fetch lectures" };
    }
};


const getLecture = async ({ id }) => {
    if (!id) return { success: false, error: "Lecture ID is required" };

    try {
        const lecture = await prisma.lecture.findUnique({
            where: { id },
            include: {
                content: true,  // Include content or related tables as needed
            }
        });

        if (!lecture) {
            return { success: false, error: "Lecture not found" };
        }

        return { success: true, data: lecture };
    } catch (error) {
        console.error("Error fetching lecture:", error);
        return { success: false, error: "Failed to fetch lecture" };
    }
};


module.exports = {getLecture, getListOfLectures}