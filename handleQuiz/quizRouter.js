const quizRouter = require("express").Router();

const { getListOfQuizzes, getQuiz } = require("./quizController");
const { verifyToken, renewToken } = require("../handleLoginSignUp/generateTokens"); // Assuming you have this function for token validation and renewal

// Get the list of quizzes
quizRouter.get("/list", async (req, res) => {
    const data = await getListOfQuizzes();
    if (!data.success) {
        return res.status(500).json({ success: false, error: data.error });
    }
    return res.status(200).json({ success: true, data: data.data });
});

// Get a specific quiz by ID
quizRouter.get("/unique", async (req, res) => {
    const  id  = Number(req.query.id); // Expecting ID as a query parameter (e.g., /unique?id=1)

    if (!id) {
        return res.status(400).json({ success: false, error: "Quiz ID is required" });
    }

    const quiz = await getQuiz({ id });
    if (!quiz.success) {
        return res.status(404).json({ success: false, error: quiz.error });
    }

    // If the token has expired, renew the token and send it in the response
    /*const newToken = renewToken(req.header('Authorization').replace("Bearer ", ""), req.body.username);
    if (newToken) {
        res.setHeader("Authorization", "Bearer " + newToken); // Update token in the response header
    } */

    return res.status(200).json({ success: true, data: quiz.data });
});

module.exports = quizRouter;
