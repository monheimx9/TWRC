import express from "express";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";

//if it's a file:
//import stuff from './your_module.js'

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
app.get("/", (req, res) => {
    res.render("index");
});
app.get("/about", (req, res) => {
    res.render("about");
});
app.get("/stats", (req, res) => {
    res.render("stats");
});
app.get("/playerstats", (req, res) => {
    res.render("playerstats");
});
app.get("/games", (req, res) => {
    res.render("games/games");
});
app.get("/tmnf", (req, res) => {
    res.render("games/tmnf");
});
app.get("/tm2", (req, res) => {
    res.render("games/tm2");
});
app.get("/tm2/:slug", (req, res) => {
    res.render("games/tm2/" + req.params.slug);
});
app.get("/tmt", (req, res) => {
    res.render("games/tmt");
});
app.get("/tmt/:slug", (req, res) => {
    res.render("games/tmt/" + req.params.slug);
});
app.get("/map", (req, res) => {
    res.render("map");
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
