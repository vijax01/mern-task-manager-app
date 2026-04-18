// Initializes and configures the Express application.
// Sets up middlewares for CORS, JSON & URL-encoded parsing, cookies, and static file serving.





import express from 'express';
const app = express();





import cors from 'cors';

app.use(cors({
     origin: process.env.CORS_ORIGIN,
     credentials: true,
}));





app.use(express.json({
     limit: "16kb"
}));


app.use(express.urlencoded({
     extended: true,
     limit: "16kb"
}))





// public folder me ham apne static files , images rakhte hain.
app.use(express.static("public"));





// define routes here
import TaskRouter from "../Routes/TaskRouter.js";
app.use('/api/tasks', TaskRouter);





export { app };
