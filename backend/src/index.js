import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./utils/db.js";
import { router } from "./routes/userRoute.js";
import { propertyRouter } from "./routes/propertyRouter.js";
import { bookingRouter } from "./routes/bookingRouter.js";
import { notificationRouter } from "./routes/notificationRouter.js";
import { hostRouter } from "./routes/hostRouter.js";
import { adminRouter } from "./routes/adminRouter.js";


dotenv.config();

const app = express();

app.use(cors());

//express.json
app.use(express.json({limit: "100mb"}))

//urlencoded
app.use(express.urlencoded({limit: "100mb", extended: true}))

//cookie parser
app.use(cookieParser())


const port = process.env.PORT || 8080;



//one test route
app.get("/", (req, res)=>{ 
    res.send("HomelyHub server is running")
})

app.use("/api/v1/rent/user",router)
app.use("/api/v1/rent/listing",propertyRouter)
app.use("/api/v1/rent/user/booking", bookingRouter);
app.use("/api/v1/notifications", notificationRouter);
app.use("/api/v1/host", hostRouter);
app.use("/api/v1/admin", adminRouter);




connectDB();

app.listen(port, () => {
    console.log(`App is running on port no:${port}`);
})
