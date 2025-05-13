const lectureRouter = require('express').Router();

const { getListOfLectures, getLecture } = require('./LectureController');
const { verifyToken } = require('../handleLoginSignUp/generateTokens');  // Adjust the path if necessary

// Get the list of lectures (requires authentication)
lectureRouter.get("/list", verifyToken, async (req, res) => {
    try {
        const data = await getListOfLectures();
        if (!data.success) {
            return res.status(500).json({ success: false, error: data.error });
        }
        return res.status(200).json({ success: true, data: data });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message || "Internal server error" });
    }
});

// Get a specific lecture by ID (requires authentication)
lectureRouter.get("/specific", verifyToken, async (req, res) => {
    const { id } = req.query;  // Expecting ID as a query parameter (e.g., /specific?id=1)

    if (!id) {
        return res.status(400).json({ success: false, error: "Lecture ID is required" });
    }

    try {
        const lecture = await getLecture({ id });

        if (!lecture) {
            return res.status(404).json({ success: false, error: "Lecture not found" });
        }

        return res.status(200).json({ success: true, data: lecture });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message || "Internal server error" });
    }
});

module.exports = lectureRouter;
