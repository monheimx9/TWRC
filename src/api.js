import express from "express";
import pool from "./db.js";

const router = express.Router();

router.get("/players", async (_, res) => {
    const [rows] = await pool.query("");
    res.json("");
});
router.get("/player/:id", async (req, res) => {
    console.log(req.id);
    res.json("");
});

router.get("/maps", async (_, res) => {
    res.json("");
});
router.get("/maps/:game/:envi", async (req, res) => {
    res.json("");
});
router.get("/map/:id", async (req, res) => {
    res.json("");
});

export default router;
