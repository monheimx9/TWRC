import pkg from "i18n-iso-countries";
import fs from "node:fs";
import { readFile } from "node:fs/promises";
import csvParser from "csv-parser";

const { isValid, alpha2ToAlpha3, getAlpha3Code } = pkg;

/**
 * Get data from csv into [Objects]
 * @param {String} path - ./path/to/file.csv
 * @param {Array<String>} headers - ["column1", "column2", ...]
 * @returns {Promise<Array<Object>>} */
async function getCsv(path, headers) {
    return new Promise((resolve, reject) => {
        const csv_data = [];
        fs.createReadStream(path)
            .pipe(
                csvParser({
                    headers: headers,
                    separator: ";",
                    skipLines: 0,
                }),
            )
            .on("data", (data) => csv_data.push(data))
            .on("end", () => {
                console.log("CSV data loaded:", csv_data.length, "entries");
                resolve(csv_data);
            })
            .on("error", (error) => {
                console.error("Error reading CSV:", error);
                reject(error);
            });
    });
}
/**
 * Get data from Json file
 * @param {String} path - ./path/to/file.chésõn
 */
async function getJson(path) {
    try {
        const data = await readFile(path, "utf8");
        return JSON.parse(data);
    } catch (err) {
        console.error("Error loading chésõn file:", err);
        throw err;
    }
}
/**
 *  return examples as ISO3 valid codes
 *  fra -> FRA
 *  fr -> FRA
 *  ??? -> UND
 *  sui -> CHE
 *  @param {String} fullname - Full name of the country, i.e "Albania.png"
 *  @param {String} code - Country code, either iso2, iso3, or Loupphok International Standard
 *  @return {Object} {country: "fre", img_path: "France.png", iso3: "FRA"}
 */
function normalizeCountryCode(code, fullname) {
    const country_row = { country: code, img_path: fullname, iso3: "UND" };
    if (isValid(code)) {
        const alpha3 = alpha2ToAlpha3(code.toUpperCase());
        if (alpha3) {
            country_row.iso3 = alpha3.toUpperCase();
            return country_row;
        } else {
            country_row.iso3 = code.toUpperCase();
            return country_row;
        }
    }
    //take me home, country_row, to the place, I belong

    // Try name lookup
    // New-Zealand is written New Zealand
    fullname = fullname.split(".p")[0].replace("-", " ");

    const code3 = getAlpha3Code(fullname, "en");
    if (code3) {
        country_row.iso3 = code3.toUpperCase();
        return country_row;
    }
    return country_row;
}

/**
 * Renames keys in target objects based on source mapping
 * @param {Object} source - Key mapping { oldKey: newKey }
 * @param {Array} target - Array of objects to transform
 * @returns {Array} New array
 */
function changeKeyNames(source, target) {
    if (!Array.isArray(target)) {
        throw new Error("Target must be an array");
    }
    const newArray = target.map((obj) => {
        const newObj = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const newKey = source[key] || key;
                newObj[newKey] = obj[key];
            }
        }
        return newObj;
    });
    return newArray.slice(1);
}

/**
 * Build a INSERT SQL query, handles multiple rows
 * @param {String} tableName
 * @param {Array} dataArray - Rows to insert
 * @param {Boolean} ignoreDuplicates - Ignore duplicates and avoid insert
 */
function buildInsertQuery(tableName, dataArray, ignoreDuplicates = true) {
    //Check
    if (
        !tableName ||
        typeof tableName !== "string" ||
        !dataArray ||
        typeof dataArray !== "object" ||
        Object.keys(dataArray).length === 0
    ) {
        throw new Error(
            "tableName must be a string, data must be of type Object, data must not be empty",
        );
    }

    //Inspect
    const cols = Object.keys(dataArray[0]); //only first item in array
    const invalidItems = dataArray.find((item) => {
        const itemKeys = Object.keys(item);
        return itemKeys.length !== cols.length || !cols.every((col) => itemKeys.includes(col));
    });
    if (invalidItems) {
        throw new Error("All object must have same fields");
    }

    //Build
    let dups = "";
    if (ignoreDuplicates) {
        dups = "IGNORE ";
    }
    // const dups = (ignoreDuplicates) => (ignoreDuplicates ? "IGNORE " : "");
    const binds = dataArray.map(() => `(${cols.map(() => "?").join(", ")})`).join(", ");
    const query = `INSERT ${dups}INTO ${tableName} (${cols.join(", ")}) VALUES ${binds}`;
    const params = dataArray.flatMap((item) =>
        cols.map((col) => {
            const value = item[col];
            if (value === null || value === undefined) return null;
            if (value instanceof Date) return value.toISOString().slice(0, 19).replace("T", " ");
            return value;
        }),
    );
    return { query, params };
}

/**
 * Find unique ID for TM Environment
 * @param {Array<Object>} games - [{}]
 * @param {String} map_game - TMO/TMT/TMUF/TM2
 * @param {String} map_enviro - Stadium/Canyon/Lagoon/Valley
 * @returns {Number} - TM2 Stadium = 22
 */
function getEnviroIDfromGameNameAndEnviroName(games, map_game, map_enviro) {
    const res = games.find((item) => {
        return (
            item.game.toLowerCase() === map_game.toLowerCase() &&
            item.enviro.toLowerCase() === map_enviro.toLowerCase()
        );
    });
    return res?.id ?? null;
}

/**
 * Takes an player object
 * {
 * "Id": 339,
 * "TMO": null,
 * "TMS": null,
 * "TMN": null,
 * "TMUF": null,
 * "TMNF": ["2092348", "3694178"],
 * "TM2": null,
 * "TMT": null,
 * "TM20": null
 * };
 * And return it like this
 *
 * [{"id":339,"account":"TMNF","accountkey":"2092348"},{"id":339,"account":"TMNF","accountkey":"3694178"}]
 */
function transformPlayerAccountToUniqueKeys(obj) {
    const result = [];
    Object.keys(obj).forEach((key) => {
        if (key !== "id" && obj[key] != null) {
            if (Array.isArray(obj[key])) {
                obj[key].forEach((accountkey) => {
                    result.push({ id: obj.id, game_id: key, accountkey });
                });
            } else {
                result.push({ id: obj.id, game_id: key, accountkey: obj[key] });
            }
        }
    });
    return result;
}

function mapGameNameToGameID(games, game_name) {
    const res = games.find((item) => {
        return item.short_name.toLowerCase() === game_name.toLowerCase();
    });
    return res.id;
}

export {
    normalizeCountryCode,
    changeKeyNames,
    buildInsertQuery,
    getEnviroIDfromGameNameAndEnviroName,
    getCsv,
    getJson,
    transformPlayerAccountToUniqueKeys,
    mapGameNameToGameID,
};
