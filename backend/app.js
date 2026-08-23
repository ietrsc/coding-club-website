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

// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================
// Without this, every ApiError thrown inside an
// asyncHandler falls through to Express's default
// error page (HTML + stack trace) instead of JSON,
// which breaks every `response.json()` call on the
// frontend and leaks server file paths.
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    if (process.env.NODE_ENV !== "production") {
        console.error(err);
    }

    return res.status(statusCode).json({
        success: false,
        message,
        errors: err.errors || [],
        data: err.data || null,
    });
});

export {app}