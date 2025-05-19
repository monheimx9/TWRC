import {
    normalizeCountryCode,
    changeKeyNames,
    buildInsertQuery,
    getEnviroIDfromGameNameAndEnviroName,
    getCsv,
    getJson,
    transformPlayerAccountToUniqueKeys,
    mapGameNameToGameID,
} from "./utils.js";
import pool from "./db.js";

async function getMaps() {
    let maps = await getCsv("./data/maps.csv", [
        "UID",
        "NameDisplay",
        "ShortName",
        "Difficulty",
        "Enviro",
        "Game",
        "Mode",
    ]);
    const sqlFieldNames = {
        UID: "id",
        NameDisplay: "fullname",
        ShortName: "short_name",
        Difficulty: "difficulty",
        Enviro: "enviro",
        Game: "game_id",
        Mode: "map_mode",
    };
    maps = changeKeyNames(sqlFieldNames, maps);
    const [games, _] = await pool.query("SELECT game, enviro, id FROM twrc.v_enviro;"); //[0] only get rows, no table def
    maps = maps.map((item) => {
        item.enviro = getEnviroIDfromGameNameAndEnviroName(games, item.game_id, item.enviro);
        return item;
    });
    maps.map((obj) => {
        //field no longer necessary
        delete obj["game_id"];
        return obj;
    });

    return maps;
}

async function getFlags() {
    let flags = await getCsv("./data/flag.csv", ["country_code", "image_path"]);
    flags = flags.map((item) => normalizeCountryCode(item.country_code, item.image_path));
    return flags;
}

async function getPlayers() {
    const p = await getJson("./otherTests/PlayerDB.json");
    const players = p.map((item) => {
        const i = { id: item.Id, displayname: item.Display_Name, country: item.Country };
        return i;
    });
    return players;
}

async function getPlayerAccounts() {
    const p = await getJson("./otherTests/PlayerDB.json");
    const [games, _] = await pool.query("SELECT short_name, id FROM twrc.game;"); //[0] only get rows, no table def
    const accounts = p.map((item) => {
        const i = {
            id: item.Id,
            TMO: item.TMO_Id,
            TMS: item.TMS_Id,
            ESWC: item.TMN_Id,
            TMUF: item.TMUF_Id,
            TMNF: item.TMNF_Id,
            TM2: item.TM2_Id,
            TMT: item.TMT_Id,
            TM20: item.TM20_Id,
        };
        if (i.id === p.length) {
            console.log(i);
        }
        return i;
    });
    let processed = [];
    accounts.forEach((item) => {
        const i = transformPlayerAccountToUniqueKeys(item);
        i.forEach((elem) => {
            elem.game_id = mapGameNameToGameID(games, elem.game_id);
            processed.push(elem);
        });
    });
    return processed;
}

/**
 * Run all parsers and import data into the concerned table
 */
async function runAll() {
    let data = await getFlags();
    let query = buildInsertQuery("twrc.flag", data, true);
    pool.execute(query.query, query.params);
    data = await getMaps();
    query = buildInsertQuery("twrc.maps", data, true);
    pool.execute(query.query, query.params);
    data = await getPlayers();
    query = buildInsertQuery("twrc.player", data, true);
    pool.execute(query.query, query.params);
    data = await getPlayerAccounts();
    query = buildInsertQuery("twrc.player_accounts", data, true);
    pool.execute(query.query, query.params);
    // console.log(data);
}

export { runAll };
