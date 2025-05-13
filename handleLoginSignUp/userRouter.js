const router = require('express').Router();
const { login, signUp, deleteUser, updateUser , getCounts} = require("./UserControllers");
const { verifyToken } = require('./generateTokens');  // Adjust the path if necessary

// User login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const data = await login(email, password);
    
    if (data.error) {
        return res.status(400).json({ success: false, error: data.error });
    }
    return res.status(200).json({ success: true, data: data, counts: await getCounts()});
});

// User signup
router.post('/signup', async (req, res) => {
    const { name, email, password, username, lastName, gender, age } = req.body;

    const data = await signUp({ name, email, password, username, lastName, gender, age });
    console.log(data)
    if (data.error) {
        return res.status(400).json({ success: false, error: data.error });
    }
    return res.status(200).json({ success: true, data: data, counts: await getCounts() });
});

// User logout

// User update
router.put('/update' , async (req, res) => {
    try {
        const { id, ...updates } = req.body;

        const result = await updateUser({id, updates})

        /*const result = await prisma.user.update({
            where: { id },
            data: {
                name,
                lastName,
                email,
                username,
                gender,
                university,
                yearOfStudy,
                ...(points !== undefined && { points }),
                ...(Array.isArray(solvedQuizzes) && { solvedQuizzes: { set: solvedQuizzes.map(id => ({ id })) } }),
                ...(Array.isArray(achievements) && { achievements }),
                ...(Array.isArray(savedNotes) && { savedNotes }),
                ...(Array.isArray(savedPrograms) && { savedPrograms: { set: savedPrograms.map(id => ({ id })) } }),
                ...(Array.isArray(readLectures) && { readLectures: { set: readLectures.map(id => ({ id })) } }),
              }
        }); */

        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error("Update error:", error);
        return res.status(500).json({ success: false, error: "Server error during update" });
    }
});


// Delete user
router.post('/delete', verifyToken, async (req, res) => {
    const { id } = req.body;
    const result = await deleteUser(id);

    if (result.error) {
        return res.status(400).json({ success: false, error: result.error });
    }

    return res.status(200).json({ success: true });
});

module.exports = router;
