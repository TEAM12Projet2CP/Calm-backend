const bcrypt = require("bcrypt")
const { PrismaClient, Gender } = require("../generated/prisma")
const prisma = new PrismaClient()
const { generateToken } = require("./generateTokens")
const nodemailer = require("nodemailer")
const { text } = require("express")

const getCounts = async () => {
    const quizzes = await prisma.quiz.count()
    const lectures = await prisma.lecture.count()

    return { quizCount: quizzes || 0 , lectureCount: lectures || 0}
}
const login = async (email, password) => {
    if (!email || !password) {
        return { error: "Email and password are required" };
    }
    
    try {
        
        const user = await prisma.user.findUnique({ 
            where: { email: email } , 
            include: {
               savedPrograms: true,
               readLectures: true,
               solvedQuizzes: true  
            }
        });

        if (!user) {
            return { error: "User not found" };
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return { error: "Invalid password" };
        }

        const token = generateToken(user.username);

        // Remove password before returning
        const { password: _pw, ...userSafe } = user;

        return { success: true, data: userSafe, token };
    } catch (error) {
        console.error("Login error:", error);
        return { error: "Server error during login" };
    }
}



const signUp = async (data) => {
    const { name, lastName, email, password, username, gender, age } = data;

    if (!name || !email || !password || !username || !lastName || !gender) {
        return { error: "All fields are required" };
    }

    try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { email }});
        if (existingUser) {
            return { error: "Email is already registered" };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name,
                lastName,
                email,
                username,
                age,
                password: hashedPassword,
                gender: gender.toUpperCase() === "MALE" ? Gender.MALE : Gender.FEMALE,
                points: 0,
                pfpUrl: "",
            },
        });
        const fullUser = await prisma.user.findUnique({
            where: {email: email},
            include:{
                savedPrograms:true,
                readLectures:true,
                solvedQuizzes:true
            }
        })
/*
        // Send welcome email (can make this async without awaiting)
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: "Welcome to Calm",
            text: `Hello ${name},\n\nWelcome to Calm! We're happy to have you.\n\n– The Calm Team`,
        });
*/
        const token = generateToken(username);
        console.log("generated token")
        const { password: _pw, ...userSafe } = fullUser;
        return { success: true, data: userSafe, token };
    } catch (error) {
        console.error("Signup error:", error);
        return { error: "Server error during sign up" };
    }
}


const updateUser = async ({ id, updates }) => {
    try {
      // Normalize gender if present
      console.log(updates)
      if (updates.gender) {
        updates.gender = updates.gender.toUpperCase() === "MALE" ? "MALE" : "FEMALE";
      }
  
      // Handle relation fields properly
      const relationFields = {};
  
      if (Array.isArray(updates.solvedQuizzes)) {
        relationFields.solvedQuizzes = {
          set: updates.solvedQuizzes.map(q => ({ id: typeof q === "object" ? q.id : q })),
        };
      }
  
      if (Array.isArray(updates.savedPrograms)) {
        relationFields.savedPrograms = { set: updates.savedPrograms.map(id => ({ id })) };
        delete updates.savedPrograms;
      }
  
      if (Array.isArray(updates.readLectures)) {
        relationFields.readLectures = { set: updates.readLectures.map(id => ({ id })) };
        delete updates.readLectures;
      }
  
      // Basic array fields (not relations)
      const optionalArrays = ["achievements", "savedNotes"];
      optionalArrays.forEach(field => {
        if (Array.isArray(updates[field])) {
          // Keep as is
        } else {
          delete updates[field];
        }
      });
  
      // Final update
      console.log(id)
        console.log(updates)
      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          ...updates,
          ...relationFields,
        },
        include: {
          solvedQuizzes: true,
          savedPrograms: true,
          readLectures: true,
        },
      });
  
      const { password, ...userSafe } = updatedUser;
      return { success: true, data: userSafe };
    } catch (error) {
      console.error("Update error:", error);
      return { error: "Failed to update user info" };
    }
  };


const deleteUser = async (id) => {
    if (!id) return { error: "User ID is required" };

    try {
        await prisma.user.delete({
            where: { id },
        });

        return { success: true };
    } catch (error) {
        console.error("Delete user error:", error);

        // If user not found
        if (error.code === "P2025") {
            return { error: "User not found" };
        }

        return { error: "Failed to delete user" };
    }
};


module.exports = { login, signUp, updateUser, deleteUser, getCounts };