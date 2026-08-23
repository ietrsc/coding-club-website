import express, { json } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express()
app.use(cors({
    origin:["http://localhost:5173",process.env.CORS_ORIGIN],
    credentials:true
}))

app.use(express.json({
    limit:"16kb"
}))

app.use(express.urlencoded({
    extended:true,limit:"16kb"
}))
app.use(express.static("public"))

app.use(cookieParser())




import participantRoutes from "./routes/participantRoutes.js";
app.use('/api/participants',participantRoutes)

import teamRoutes from "./routes/teamRoutes.js";
app.use("/api/teams", teamRoutes);

import requestRoutes from "./routes/requestRoutes.js";
app.use("/api/requests", requestRoutes);

import invitationRoutes from "./routes/invitationRoutes.js";

app.use("/api/invitations", invitationRoutes);

import authRoutes from "./routes/authRoutes.js";

app.use("/api/auth", authRoutes);

export {app}