import express from "express";
import { appRoutes } from "./routes";

const app = express();

app.use(appRoutes);

app.listen(3000, () => console.log('🚀 - listening on port 3000'))