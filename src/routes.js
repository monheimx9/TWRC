import express from "express";

const routes = express.Router();

routes.get("/", (req, res) => {
    res.render("index");
});
routes.get("/about", (req, res) => {
    res.render("about");
});
routes.get("/stats", (req, res) => {
    res.render("stats");
});
routes.get("/playerstats", (req, res) => {
    res.render("playerstats");
});
routes.get("/games", (req, res) => {
    res.render("games/games");
});
routes.get("/tmnf", (req, res) => {
    res.render("games/tmnf");
});
routes.get("/tm2", (req, res) => {
    res.render("games/tm2");
});
routes.get("/tm2/:slug", (req, res) => {
    res.render("games/tm2/" + req.params.slug);
});
routes.get("/tmt", (req, res) => {
    res.render("games/tmt");
});
routes.get("/tmt/:slug", (req, res) => {
    res.render("games/tmt/" + req.params.slug);
});
routes.get("/map", (req, res) => {
    res.render("map");
});

export default routes;
