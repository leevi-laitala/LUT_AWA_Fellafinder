import express, { Express } from "express";
import dotenv from "dotenv";
import cors, { CorsOptions } from "cors";
import multer from "multer";

import routes from "./routes";

dotenv.config();

const app: Express = express();
const port: number = 5001;

const upload = multer();

const corsOpts: CorsOptions = {
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200,
};

app.use(cors(corsOpts));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(upload.array());
app.use(express.static("public"));

app.use("/", routes);

app.listen(port);

export default app;
