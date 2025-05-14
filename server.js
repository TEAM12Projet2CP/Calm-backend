require("dotenv").config()
const express = require("express")
const app = express()
const cors = require("cors")
const { login } = require("./handleLoginSignUp/UserControllers")
const PORT = process.env.PORT || 5000

const corsOptions = {
    origin:[ "http://localhost:5173", "http://127.0.0.1:5000", "http://localhost:3000", "https://calm-esi-v2.vercel.app"],// here we shall add the frontend url later
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}


app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use("/",require("./handleLoginSignUp/userRouter"))
app.use("/dashboard", require("./handleLeaderBoard/scoreBoardRouter"))
app.use("/lectures", require("./handleLecture/lectureRouter"))
app.use("/quizzes", require("./handleQuiz/quizRouter"))

app.get('/', (req, res) => {
  res.send('Hello to calm API')  
})





app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
