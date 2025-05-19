import express from "express";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";

import api from "./src/api.js";
import routes from "./src/routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = 3000;

app.use(express.static("public"));
//Use .html files for templating, not .ejs
app.engine(".html", ejs.renderFile);
app.set("view engine", "html");

//views are stored in the pages directory
app.set("views", path.join(__dirname, "pages"));

app.use(routes);
app.use("/api", api);

app.listen(port, () => {
    console.log(`Example routes listening on port ${port}`);
});
