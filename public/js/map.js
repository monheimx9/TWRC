// Grab all the data from the github sources
async function getData() {
    try {
        /* Fetch all the data concurrently */
        const responses = await Promise.all([
            fetch("https://raw.githubusercontent.com/Loupphok/TWRC/main/data/WRDb.csv"),
            fetch("https://raw.githubusercontent.com/Loupphok/TWRC/main/data/Nation.csv"),
            fetch("https://raw.githubusercontent.com/Loupphok/TWRC/main/data/flag.csv"),
            fetch(
                "https://raw.githubusercontent.com/Loupphok/TWRC/refs/heads/main/otherTests/PlayerDB.json",
            ),
        ]);

        /* Extract the text from each response */
        const alldata = await Promise.all(responses.map((response) => response.text()));

        parseData(alldata); // Parse the data
    } catch (error) {
        console.error(error);
    }
}

// Parse the data so we can use it (convert from csv to list of lists)
function parseData(alldata) {
    /* Fetching HISTORY data */
    data = alldata[0]; // Import data from WRDb.csv
    const rows = data.split("\n").filter((row) => row.trim().length > 0); // Split the file content by newlines to get each row
    csvData = rows.map((row) => row.split(";").filter((cell) => cell.trim().length > 0)); // Split the file content by newlines to get each row

    // Keep only relevent map
    var mapWR = [];
    for (elem of csvData) {
        if (elem[1] === SelectedMap) {
            mapWR.push(elem);
        }
    }

    mapWR.sort((a, b) => {
        return b[7] - a[7];
    }); // Sort by rank to have the current wr on top of the list

    /* Fetching Nation data */
    dataNation = alldata[1]; // Import data from Nation.csv
    const rowsNation = dataNation.split("\n").filter((row) => row.trim().length > 0); // Split the file content by newlines to get each row

    csvDataNation = rowsNation.map((row) =>
        row.split(";").filter((cell) => cell.trim().length > 0),
    );
    var Nation = {};
    for (elem of csvDataNation) {
        Nation[elem[0]] = elem[1];
    }

    /* Fetching Flag data */
    dataFlag = alldata[2]; // Import data from Flag.csv
    const rowsFlag = dataFlag.split("\n").filter((row) => row.trim().length > 0); // Split the file content by newlines to get each row
    csvDataFlag = rowsFlag.map((row) => row.split(";").filter((cell) => cell.trim().length > 0));
    var Flag = {};
    for (elem of csvDataFlag) {
        Flag[elem[0]] = "/assets/flags/" + elem[1];
    }

    /* Fetching Player data */
    playerDB = JSON.parse(alldata[3]);

    showInfo(mapWR, Nation, Flag, playerDB); // Once its parsed, put the data into the table
    mapInfo(mapWR, Nation, Flag, playerDB);
}

// Show info into the already made table
function showInfo(mapWR, Nation, Flag, playerDB) {
    /* Delete every <td> from the table (update from cheat toggle) */
    for (const row of LBtable.rows) {
        for (let i = row.cells.length - 1; i >= 0; i--) {
            const cell = row.cells[i];

            // Delete only if <td>, not <th>
            if (cell.tagName.toLowerCase() === "td") {
                row.deleteCell(i);
            }
        }
    }

    let redArray;
    let indexLine = 0;
    var anyCheat = false;

    /* Creation line by line of the data */
    for (CurrentLine of mapWR) {
        console.log(CurrentLine);
        var Cheat = false;
        if (CurrentLine[4] === "Cheated") {
            Cheat = true;
            anyCheat = true;
            if (!CheatOn) {
                continue;
            }
        }

        /* Setup line of table */
        var tableLine = document.createElement("tr");

        if (Cheat) {
            tableLine.style = "color: #e06560; font-style: italic;";
        }

        /* Index */
        indexLine += 1;
        const index = document.createElement("td");
        index.className = "LeaderboardIndex";

        if (indexLine < 5) {
            index.innerHTML =
                "<div class='FlagPic'><img src='/assets/" + indexLine + ".png' alt=''></div>";
        } else {
            index.innerHTML = indexLine;
        }
        tableLine.appendChild(index);

        /* Player column */
        const LeaderboardNation = document.createElement("td");
        LeaderboardNation.className = "LeaderboardNation";
        let drapeau = Flag[Nation[CurrentLine[0]]];
        if (CurrentLine[8] != "a") {
            var playerINFO = getDBID(playerDB, CurrentLine[8], CurrentLine[6]);
            drapeau = Flag[playerINFO[1]];
        }

        if (typeof drapeau === "undefined") {
            drapeau = "/assets/flags/question.png";
        }

        /* Adding the clickability to lines to check player stats page */
        let playerName;
        if (CurrentLine[8] != "a") {
            playerName = playerINFO[2];
        } else {
            playerName = CurrentLine[0];
        }
        tableLine.onclick = function () {
            window.location.href = "/playerstats?id=" + playerName;
        };

        LeaderboardNation.innerHTML =
            '<div class="FlagPic"><img src="' + drapeau + '" alt=""></div>';
        tableLine.appendChild(LeaderboardNation);

        redArray = "";
        if (CurrentLine[0] == "__") {
            redArray = "<span class='Question'>__</span>";
        } else if (CurrentLine[8] != "a") {
            redArray = playerINFO[2];
        } else {
            redArray = CurrentLine[0];
        }

        const LeaderboardPlayer = document.createElement("td");
        LeaderboardPlayer.className = "LeaderboardPlayer";
        LeaderboardPlayer.innerHTML = redArray;
        tableLine.appendChild(LeaderboardPlayer);

        /* Time column */
        redArray = "";
        for (elem of CurrentLine[2]) {
            if (elem === "x") {
                redArray += "<span class='Question'>" + elem + "</span>";
            } else {
                redArray += elem;
            }
        }

        const LeaderboardTime = document.createElement("td");
        LeaderboardTime.className = "LeaderboardTime";
        LeaderboardTime.innerHTML = redArray;
        tableLine.appendChild(LeaderboardTime);

        /* Date column */
        redArray = "";
        for (elem of CurrentLine[3]) {
            if (elem === "?") {
                redArray += "<span class='Question'>" + elem + "</span>";
            } else {
                redArray += elem;
            }
        }

        const LeaderboardDate = document.createElement("td");
        LeaderboardDate.className = "LeaderboardDate";
        LeaderboardDate.innerHTML = redArray;
        tableLine.appendChild(LeaderboardDate);

        /* Info column */
        const LeaderboardInfo = document.createElement("td");
        LeaderboardInfo.className = "LeaderboardInfo";

        if (CurrentLine[4] === ".") {
            LeaderboardInfo.innerHTML = " ";
        } else {
            LeaderboardInfo.innerHTML = CurrentLine[4];
        }

        tableLine.appendChild(LeaderboardInfo);

        LBtable.appendChild(tableLine); // Inputing the loop into the table
    }

    var toggleCheat = document.getElementById("monDiv");
    var mapInfoColumn = document.getElementsByClassName("mapInfoColumn")[0];
    if (!anyCheat) {
        toggleCheat.style = "display: none;";
    } else if (anyCheat) {
        toggleCheat.style.removeProperty("display");
    }
}

function getDBID(playerDB, id, game) {
    switch (game) {
        case "TMNF":
            for (player of playerDB) {
                if (typeof player["TMNF_Id"] == "string") {
                    if (id == player["TMNF_Id"]) {
                        return [player["Id"], player["Country"], player["Display_Name"]];
                    }
                } else {
                    if (player["TMNF_Id"].includes(id)) {
                        return [player["Id"], player["Country"], player["Display_Name"]];
                    }
                }
            }
    }
}

function getFullGameName(name, envi = null) {
    switch (name) {
        case "TMNF":
            return "Trackmania Nations Forever";
        case "TM2":
            return "Trackmania² " + envi;
        case "TMT":
            return "Trackmania Turbo";
    }
}

function getCorrectMapName(map, game) {
    switch (game) {
        case "TMNF":
        case "TM2":
            return map.slice(0, 3);
        case "TMT":
            return "#" + SelectedMap;
    }
}

function getCorrectFileName(envi = null, game = null) {
    switch (game) {
        case "TMNF":
            return "/assets/mapThumbnails/TMNF_" + SelectedMap.slice(0, 3) + ".jpg";
        case "TM2":
            return (
                "/assets/mapThumbnails/TM2_" +
                envi +
                "_" +
                getCorrectMapName(SelectedMap, game) +
                ".jpg"
            );
        case "TMT":
            return "/assets/mapThumbnails/" + SelectedMap + ".jpg";
    }
}

function getDifficulty(map, game) {
    switch (game) {
        case "TMNF":
        case "TM2":
            return map[0];
        case "TMT":
            if (map < 41) {
                return "A";
            } else if (map < 81) {
                return "B";
            } else if (map < 121) {
                return "C";
            } else if (map < 161) {
                return "D";
            } else {
                return "E";
            }
    }
}

function mostFrequentElement(arr) {
    let count = {}; // Stock all occurrences
    let maxFreq = 0;
    let mostFrequent = null;

    for (let item of arr) {
        count[item] = (count[item] || 0) + 1; // Increments the counter

        if (count[item] > maxFreq) {
            // Check if its the new most represented element
            maxFreq = count[item];
            mostFrequent = item;
        }
    }
    return [mostFrequent, maxFreq];
}

function convertTimeStr(time) {
    if (!time.includes(":")) {
        time = "0:" + time;
    }
    let minutesSplit = time.split(":");
    let minute = parseInt(minutesSplit[0]);
    let secondSplit = minutesSplit[1].split(".");
    let second = parseInt(secondSplit[0]);
    let decim = 1000 + parseInt(secondSplit[1].padEnd(3, "0"));
    return minute * 60000 + second * 1000 + decim - 1000;
}

function speculation(date_str1, date_str2, game) {
    if (date_str1 == date_str2) {
        return "???";
    }

    let [day1, month1, year1] = date_str1.split("/");
    let [day2, month2, year2] = date_str2.split("/");

    //harmonisation année
    if (!(year1 == "????" || year2 == "????")) {
        //on part du fait que si on connait pas l'année, on sait pas le mois
        if (year1 != year2) {
            if (month1 == "??") {
                month1 = "12";
            }
            if (month2 == "??") {
                month2 = "01";
            }
        }
    } else {
        if (year1 == "????") {
            return "???";
        } else if (game == "TM2") {
            if (Number(year1) < 2017 || (Number(year1) == 2017 && Number(month1) < 5)) {
                [year2, month2, day2] = ["2017", "05", "07"];
            }
        } else {
            return "???";
        }
    }
    if (year1 != year2) {
        if (month1 != month2) {
            if (day1 == "??") {
                if (["01", "03", "05", "07", "08", "10", "12"].includes(month1)) {
                    day1 = "31";
                } else if (month1 == "02") {
                    if (Number(year1) % 4 == 0) {
                        day1 = "29";
                    } else {
                        day1 = "28";
                    }
                } else {
                    day1 = "30";
                }
            }
            if (day2 == "??") {
                day2 = "01";
            }
        }
    } else {
        if (month1 != month2 && !(month1 == "??" || month2 == "??")) {
            if (day1 == "??") {
                if (["01", "03", "05", "07", "08", "10", "12"].includes(month1)) {
                    day1 = "31";
                } else if (month1 == "02") {
                    if (Number(year1) % 4 == 0) {
                        day1 = "29";
                    } else {
                        day1 = "28";
                    }
                } else {
                    day1 = "30";
                }
            }
            if (day2 == "??") {
                day2 = "01";
            }
        } else {
            return "???";
        }
    }

    return [
        [day1, month1, year1],
        [day2, month2, year2],
    ];
}

function compare_dates(date_str1, date_str2, game) {
    let [day1, month1, year1] = date_str1.split("/");
    let [day2, month2, year2] = date_str2.split("/");
    let specu_preciser = 0;

    // Vérifier si une des dates contient des "?"
    if ((day1 + month1 + year1 + day2 + month2 + year2).includes("?")) {
        let newdates = speculation(date_str1, date_str2, game);
        if (newdates == "???") {
            return "???";
        }
        specu_preciser = 1;
        [day1, month1, year1] = [newdates[0][0], newdates[0][1], newdates[0][2]];
        [day2, month2, year2] = [newdates[1][0], newdates[1][1], newdates[1][2]];
    }

    // Convertir les parties de date en entiers
    [day1, month1, year1] = [Number(day1), Number(month1), Number(year1)];
    [day2, month2, year2] = [Number(day2), Number(month2), Number(year2)];

    // Créer des objets datetime
    date1 = new Date(year1, month1 - 1, day1);
    date2 = new Date(year2, month2 - 1, day2);

    // Calculer la différence en jours
    delta = Math.round((date2 - date1) / (1000 * 60 * 60 * 24));
    return [delta * -1, specu_preciser];
}

function time_delta(former, newer) {
    let [former_x_pos, newer_x_pos] = [x_detector(former), x_detector(newer)];
    let diff = String(
        convertTimeStr(remplacer_caractere(former, former_x_pos, "0")) -
            convertTimeStr(remplacer_caractere(newer, newer_x_pos, "0")) +
            1000,
    );

    if (Number(diff) < 1000) {
        return "Reseted";
    } else {
        let affichage =
            "-" +
            (diff.slice(-5, -3) - 1) +
            "." +
            diff.slice(-3, -2) +
            diff.slice(-2, -1) +
            diff.slice(-1);
        return remplacer_caractere(affichage, former_x_pos + newer_x_pos, "?") + "s";
    }
}

function x_detector(time) {
    const x_pos = [];
    let index = 0;

    for (elem of time) {
        if (elem.includes("x")) {
            x_pos.push(index);
        }
        index += 1;
    }

    return x_pos;
}

function remplacer_caractere(chaine, position, nouveau_caractere) {
    let liste_caracteres = chaine.split(""); // Convertir la chaîne en une liste de caractères

    for (elem of position) {
        liste_caracteres[elem] = nouveau_caractere; // Remplacer le caractère à la position spécifiée
    }

    let nouvelle_chaine = liste_caracteres.join(""); // Reconvertir la liste en une chaîne de caractères
    return nouvelle_chaine;
}

function getBestImprovement(mapWR, game, envi) {
    var coolDown = 7; // Number of days after first WR to start the tracking
    switch (game) {
        case "TMNF":
            unsort = mapWR.reverse();
            var improvement = 0;
            var wrOfBestImprovement = NaN;
            var indexOfBestImprovement = 0;
            let [day, month, year] = unsort[0][3].split("/").map(Number);
            var firstDate = new Date(year, month - 1, day);
            firstDate.setDate(firstDate.getDate() + coolDown);

            for (wr of unsort) {
                let [day, month, year] = wr[3].split("/").map(Number);
                var newDate = new Date(year, month - 1, day);
                if (newDate < firstDate) {
                    var currentWR = convertTimeStr(wr[2]);
                } else {
                    let currentWRTest = convertTimeStr(wr[2] + "0");
                    let improvementTest = currentWR - currentWRTest;
                    if (improvementTest > improvement) {
                        improvement = improvementTest;
                        wrOfBestImprovement = indexOfBestImprovement;
                    }
                    currentWR = currentWRTest;
                }
                indexOfBestImprovement += 1;
            }
            let thousandths = game == "TMNF";
            return [
                unsort[wrOfBestImprovement][2] +
                    " <span class='improveSpan'>(-" +
                    (improvement / 1000).toFixed(3 - thousandths) +
                    "s)</span>",
                unsort[wrOfBestImprovement][0],
            ];
        case "TM2":
        case "TMT":
            unsort = mapWR.reverse();
            var improvement = "-0.000s";
            var wrOfBestImprovement = NaN;
            var indexOfBestImprovement = 0;
            var FirstWR = unsort[0][2];
            for (let i = 0; i < unsort.length - 1; i++) {
                nextWR = unsort[i + 1][2];
                if (nextWR == "???") {
                    FirstWR = unsort[i + 2][2];
                    nextWR = unsort[i + 3][2];
                    i += 2;
                    continue;
                }

                if (game == "TM2" && ["Canyon", "Valley"].includes(envi)) {
                    if (
                        unsort[i + 1][3].slice(-4) == "2017" &&
                        Number(unsort[i][3].slice(-4)) < 2017
                    ) {
                        FirstWR = unsort[i + 1][2];
                        nextWR = unsort[i + 2][2];
                        i += 1;
                        continue;
                    }
                }

                let improvementTest = time_delta(FirstWR, nextWR);
                FirstWR = nextWR;

                for (let j = 0; j < improvementTest.length; j++) {
                    if (typeof Number(improvementTest[j]) == "number") {
                        if (Number(improvement[j]) < Number(improvementTest[j])) {
                            improvement = improvementTest;
                            wrOfBestImprovement = i + 1;
                            break;
                        } else if (Number(improvement[j]) > Number(improvementTest[j])) {
                            break;
                        }
                    }
                }
            }
            return [
                unsort[wrOfBestImprovement][2] +
                    " <span class='improveSpan'>(" +
                    improvement +
                    ")</span>",
                unsort[wrOfBestImprovement][0],
            ];
    }
}

function parseDate(dataStr) {
    const [jour, mois, annee] = dataStr.split("/").map(Number);
    return new Date(annee, mois - 1, jour); //mois -1 car janvier = 0 en js
}

function getLongestStandingWR(mapWR, game) {
    const durees = {};
    let maxJoueur = null;
    let maxDuree = 0;
    let firstDate;
    let nbDays;
    let percent;

    switch (game) {
        case "TMNF":
            for (let i = 0; i < mapWR.length; i++) {
                const joueur = mapWR[i][0];
                const dateDebut = parseDate(mapWR[i][3]); // date à l'index 3
                const dateFin = i < mapWR.length - 1 ? parseDate(mapWR[i + 1][3]) : new Date();

                const duree = Math.round((dateFin - dateDebut) / (1000 * 60 * 60 * 24));
                if (durees[joueur]) {
                    durees[joueur] += duree;
                } else {
                    durees[joueur] = duree;
                }
            }

            for (const [joueur, duree] of Object.entries(durees)) {
                if (duree > maxDuree) {
                    maxDuree = duree;
                    maxJoueur = joueur;
                }
            }
            firstDate = parseDate(mapWR[0][3]);
            nbDays = Math.round((new Date() - firstDate) / (1000 * 60 * 60 * 24));
            percent = Math.round((maxDuree / nbDays) * 100);
            return [maxJoueur, maxDuree, percent];
        case "TMT":
        case "TM2":
            for (let i = 0; i < mapWR.length; i++) {
                let date1 = mapWR[i][3];
                let date2 = i < mapWR.length - 1 ? mapWR[i + 1][3] : new Date();
                const formattedDate2 =
                    date2 instanceof Date
                        ? `${String(date2.getDate()).padStart(2, "0")}/${String(date2.getMonth() + 1).padStart(2, "0")}/${date2.getFullYear()}`
                        : date2; // Si `mapWR[i+1][3]` est déjà une date formatée
                let resultCompar = compare_dates(formattedDate2, date1, game);
                if (resultCompar == "???") {
                    continue;
                }
                if (durees[mapWR[i][0]]) {
                    durees[mapWR[i][0]] += resultCompar[0];
                } else {
                    durees[mapWR[i][0]] = resultCompar[0];
                }
            }
            for (const [joueur, duree] of Object.entries(durees)) {
                if (duree > maxDuree) {
                    maxDuree = duree;
                    maxJoueur = joueur;
                }
            }
            firstDate = parseDate(mapWR[0][3]);
            nbDays = Math.round((new Date() - firstDate) / (1000 * 60 * 60 * 24));
            percent = Math.round((maxDuree / nbDays) * 100);
            return [maxJoueur, maxDuree, percent];
    }
}

function getLongestStandingIndividualWR(mapWR, game) {
    let maxDuree = 0;
    let maxTime;
    let maxJoueur;
    switch (game) {
        case "TMNF":
            for (let i = 0; i < mapWR.length; i++) {
                const joueur = mapWR[i][0];
                const dateDebut = parseDate(mapWR[i][3]); // date à l'index 3
                const dateFin = i < mapWR.length - 1 ? parseDate(mapWR[i + 1][3]) : new Date();
                const duree = Math.round((dateFin - dateDebut) / (1000 * 60 * 60 * 24));
                if (duree > maxDuree) {
                    maxDuree = duree;
                    indexMax = i;
                    maxJoueur = joueur;
                    maxTime = mapWR[i][2];
                }
            }
            return [maxJoueur, maxDuree, maxTime];
        case "TM2":
        case "TMT":
            let specul;

            for (let i = 0; i < mapWR.length; i++) {
                let date1 = mapWR[i][3];
                let date2 = i < mapWR.length - 1 ? mapWR[i + 1][3] : new Date();
                const formattedDate2 =
                    date2 instanceof Date
                        ? `${String(date2.getDate()).padStart(2, "0")}/${String(date2.getMonth() + 1).padStart(2, "0")}/${date2.getFullYear()}`
                        : date2; // Si `mapWR[i+1][3]` est déjà une date formatée
                let resultCompar = compare_dates(formattedDate2, date1, game);
                if (resultCompar == "???") {
                    continue;
                }
                if (resultCompar[0] > maxDuree) {
                    maxDuree = resultCompar[0];
                    maxTime = mapWR[i][2];
                    maxJoueur = mapWR[i][0];
                    specul = resultCompar[1];
                }
            }
            return [maxJoueur, maxDuree, maxTime, specul];
    }
}

function convertTimeDuration(days) {
    const YEAR = 365;
    const MONTH = 30;

    const years = Math.floor(days / YEAR);
    days %= YEAR;

    const month = Math.floor(days / MONTH);
    days %= MONTH;

    return [years, month, days];
}

function mapInfo(mapWR, Nation, Flag, playerDB) {
    // console.log(speculation("??/??/2018", "01/06/2018"));
    let envi = mapWR[0][5];
    let game = mapWR[0][6];

    // THUMBNAIL
    var mapPic = document.getElementById("mapPic");
    mapPic.src = getCorrectFileName(envi, game);

    // WHAT GAME
    var gameInfo = document.getElementById("gameInfo");
    gameInfo.innerHTML = getFullGameName(game, envi);

    // WHAT ENVI
    var enviInfo = document.getElementById("enviInfo");
    enviInfo.innerHTML =
        "<img src= '/assets/enviLogos/" +
        envi +
        ".png' alt='' style='width: 35px; height: 35px;vertical-align:middle;'> ";
    enviInfo.innerHTML += "<span class='playerSpan'>" + envi + "<span>";

    // WHAT MAP
    var mapInfo = document.getElementById("mapInfo");
    mapInfo.innerHTML =
        "<img src= '/assets/difficultyLogos/Flag" +
        getDifficulty(SelectedMap, game) +
        ".png' alt='' style='width: 25px; height: 25px;vertical-align:middle;'> ";
    mapInfo.innerHTML +=
        "<span class='playerSpan'>" + getCorrectMapName(SelectedMap, game) + "<span>";
    var wrHolderList = [];

    for (CurrentLine of mapWR) {
        if (CurrentLine[4] === "Cheated") {
            if (!CheatOn) {
                continue;
            }
        }
        wrHolderList.push(CurrentLine[0]);
    }

    // HOW MANY WORLD RECORDS
    var WRAmountInfo = document.getElementById("WRAmountInfo"); // AJOUTER LES INFOS EN TITLE
    WRAmountInfo.innerHTML = wrHolderList.length + " WRs";

    // MOST PROLOFIC PLAYER
    var dominantInfo = document.getElementById("dominantInfo");
    let dominantPlayer = mostFrequentElement(wrHolderList);
    var drapeau = Flag[Nation[dominantPlayer[0]]];

    if (mapWR[0][8] != "a") {
        let dominantId;
        for (CurrentLine of mapWR) {
            if (CurrentLine[0] == dominantPlayer[0]) {
                dominantId = CurrentLine[8];
            }
        }
        playerINFO = getDBID(playerDB, dominantId, game);
        drapeau = Flag[playerINFO[1]];
        dominantPlayer[0] = playerINFO[2];
    }

    if (typeof drapeau === "undefined") {
        drapeau = "/assets/flags/question.png";
    }

    dominantInfo.innerHTML =
        '<img src="' +
        drapeau +
        '" alt="" style="width: 25px; height: 25px;vertical-align:middle;"> ';
    dominantInfo.innerHTML +=
        "<span class='playerSpan'>" +
        dominantPlayer[0] +
        " · " +
        dominantPlayer[1] +
        " WRs </span>";

    // BIGGEST IMPROVEMENT
    let cheatLess = [];
    for (line of mapWR) {
        if (line[4] != "Cheated") {
            cheatLess.push(line);
        }
    }

    var biggestInfo = document.getElementById("biggestInfo");
    biggestInfo_results = getBestImprovement(cheatLess, game, envi);

    drapeau = Flag[Nation[biggestInfo_results[1]]];
    if (typeof drapeau === "undefined") {
        drapeau = "/assets/flags/question.png";
    }
    biggestInfo.innerHTML =
        '<img src="' +
        drapeau +
        '" alt="" style="width: 25px; height: 25px;vertical-align:middle;"> ';
    biggestInfo.innerHTML +=
        "<span class='playerSpan'>" +
        biggestInfo_results[1] +
        " · " +
        biggestInfo_results[0] +
        "<span>";

    if (cheatLess[0][8] != "a") {
        let biggesttId;
        for (CurrentLine of cheatLess) {
            if (CurrentLine[0] == biggestInfo_results[1]) {
                biggesttId = CurrentLine[8];
            }
        }
        playerINFO = getDBID(playerDB, biggesttId, game);
        drapeau = Flag[playerINFO[1]];
        if (typeof drapeau === "undefined") {
            drapeau = "../assets/flags/question.png";
        }
        biggestInfo.innerHTML =
            '<img src="' +
            drapeau +
            '" alt="" style="width: 25px; height: 25px;vertical-align:middle;"> ';
        biggestInfo.innerHTML +=
            "<span class='playerSpan'>" + playerINFO[2] + " · " + biggestInfo_results[0] + "<span>";
    }

    // PLAYER WITH THE LONGEST TIME AS WORLD RECORD
    var longestInfo = document.getElementById("longestInfo");
    let longestInfo_results = getLongestStandingWR(cheatLess, game);

    drapeau = Flag[Nation[longestInfo_results[0]]];
    if (typeof drapeau === "undefined") {
        drapeau = "../assets/flags/question.png";
    }
    longestInfo.innerHTML =
        '<img src="' +
        drapeau +
        '" alt="" style="width: 25px; height: 25px;vertical-align:middle;"> ';
    let duration = convertTimeDuration(longestInfo_results[1]);
    let durationFormated = duration[0] + "Y'" + duration[1] + "M · " + longestInfo_results[2] + "%";
    longestInfo.innerHTML +=
        "<span class='playerSpan'>" + longestInfo_results[0] + " · " + durationFormated + "<span>";

    if (cheatLess[0][8] != "a") {
        let longestId;
        for (CurrentLine of cheatLess) {
            if (CurrentLine[0] == longestInfo_results[0]) {
                longestId = CurrentLine[8];
            }
        }
        playerINFO = getDBID(playerDB, longestId, game);
        drapeau = Flag[playerINFO[1]];
        if (typeof drapeau === "undefined") {
            drapeau = "/assets/flags/question.png";
        }
        longestInfo.innerHTML =
            '<img src="' +
            drapeau +
            '" alt="" style="width: 25px; height: 25px;vertical-align:middle;"> ';
        longestInfo.innerHTML +=
            "<span class='playerSpan'>" + playerINFO[2] + " · " + durationFormated + "<span>";
    }

    // LONGEST STANDING WORLD RECORD
    var longestWRInfo = document.getElementById("longestWRInfo");
    let longestWRInfo_results = getLongestStandingIndividualWR(cheatLess, game);

    drapeau = Flag[Nation[longestWRInfo_results[0]]];
    if (typeof drapeau === "undefined") {
        drapeau = "../assets/flags/question.png";
    }
    longestWRInfo.innerHTML =
        '<img src="' +
        drapeau +
        '" alt="" style="width: 25px; height: 25px;vertical-align:middle;"> ';
    duration = convertTimeDuration(longestWRInfo_results[1]);
    durationFormated =
        longestWRInfo_results[2] +
        " · " +
        "~".repeat(longestWRInfo_results[3]) +
        duration[0] +
        "Y'" +
        duration[1] +
        "M";
    longestWRInfo.innerHTML +=
        "<span class='playerSpan'>" +
        longestWRInfo_results[0] +
        " · " +
        durationFormated +
        "<span>";

    if (cheatLess[0][8] != "a") {
        let longestId;
        for (CurrentLine of cheatLess) {
            if (CurrentLine[0] == longestWRInfo_results[0]) {
                longestId = CurrentLine[8];
            }
        }
        playerINFO = getDBID(playerDB, longestId, game);
        drapeau = Flag[playerINFO[1]];
        if (typeof drapeau === "undefined") {
            drapeau = "../assets/flags/question.png";
        }
        longestWRInfo.innerHTML =
            '<img src="' +
            drapeau +
            '" alt="" style="width: 25px; height: 25px;vertical-align:middle;"> ';
        longestWRInfo.innerHTML +=
            "<span class='playerSpan'>" + playerINFO[2] + " · " + durationFormated + "<span>";
    }
}

function lolfun() {
    // let maplist = [
    //     "A01-Race", "A02-Race", "A03-Race", "A04-Acrobatic", "A05-Race",
    //     "A06-Obstacle", "A07-Race", "A08-Endurance", "A09-Race", "A10-Acrobatic",
    //     "A11-Race", "A12-Speed", "A13-Race", "A14-Race", "A15-Speed",
    //     "B01-Race", "B02-Race", "B03-Race", "B04-Acrobatic", "B05-Race",
    //     "B06-Obstacle", "B07-Race", "B08-Endurance", "B09-Acrobatic", "B10-Speed",
    //     "B11-Race", "B12-Race", "B13-Obstacle", "B14-Speed", "B15-Race",
    //     "C01-Race", "C02-Race", "C03-Acrobatic", "C04-Race", "C05-Endurance",
    //     "C06-Speed", "C07-Race", "C08-Obstacle", "C09-Race", "C10-Acrobatic",
    //     "C11-Race", "C12-Obstacle", "C13-Race", "C14-Endurance", "C15-Speed",
    //     "D01-Endurance", "D02-Race", "D03-Acrobatic", "D04-Race", "D05-Race",
    //     "D06-Obstacle", "D07-Race", "D08-Speed", "D09-Obstacle", "D10-Race",
    //     "D11-Acrobatic", "D12-Speed", "D13-Race", "D14-Endurance", "D15-Endurance",
    //     "E01-Obstacle", "E02-Endurance", "E03-Endurance", "E04-Obstacle", "E05-Endurance"
    // ]
    // let maplist = [
    //     'A01 - Stadium', 'A02 - Stadium', 'A03 - Stadium', 'A04 - Stadium', 'A05 - Stadium',
    //     'A06 - Stadium', 'A07 - Stadium', 'A08 - Stadium', 'A09 - Stadium', 'A10 - Stadium',
    //     'A11 - Stadium', 'A12 - Stadium', 'A13 - Stadium', 'A14 - Stadium', 'A15 - Stadium',
    //     'B01 - Stadium', 'B02 - Stadium', 'B03 - Stadium', 'B04 - Stadium', 'B05 - Stadium',
    //     'B06 - Stadium', 'B07 - Stadium', 'B08 - Stadium', 'B09 - Stadium', 'B10 - Stadium',
    //     'B11 - Stadium', 'B12 - Stadium', 'B13 - Stadium', 'B14 - Stadium', 'B15 - Stadium',
    //     'C01 - Stadium', 'C02 - Stadium', 'C03 - Stadium', 'C04 - Stadium', 'C05 - Stadium',
    //     'C06 - Stadium', 'C07 - Stadium', 'C08 - Stadium', 'C09 - Stadium', 'C10 - Stadium',
    //     'C11 - Stadium', 'C12 - Stadium', 'C13 - Stadium', 'C14 - Stadium', 'C15 - Stadium',
    //     'D01 - Stadium', 'D02 - Stadium', 'D03 - Stadium', 'D04 - Stadium', 'D05 - Stadium',
    //     'D06 - Stadium', 'D07 - Stadium', 'D08 - Stadium', 'D09 - Stadium', 'D10 - Stadium',
    //     'D11 - Stadium', 'D12 - Stadium', 'D13 - Stadium', 'D14 - Stadium', 'D15 - Stadium',
    //     'E01 - Stadium', 'E02 - Stadium', 'E03 - Stadium', 'E04 - Stadium', 'E05 - Stadium'
    // ]
    // let allDurations = [];
    // for(map of maplist){
    //     var mapWR = [];
    //     for(elem of csvData){
    //         if(elem[1] === map){
    //             mapWR.push(elem);
    //         }
    //     }
    //     let test = getLongestStandingWR(mapWR, "TM2");
    //     allDurations.push([test[0], convertTimeDuration(test[1])][0]);
    // }
    // console.log(allDurations);
}

// Fonction pour basculer la valeur de la variable
function toggleVariable() {
    CheatOn = !CheatOn;
    getData(CheatOn);
    if (CheatOn) {
        Togglecheat.innerHTML = "Cheater On";
    } else {
        Togglecheat.innerHTML = "Cheater Off";
    }
}

// TODO: Deprecated?
// Function that returns a column into an array
function getUniqueColumn(data, column) {
    const Something = new Map();
    for (let i = 0; i < data.length; i++) {
        Something.set(data[i][column], "sex");
    }
    return [...Something.keys()];
}

/*
Start of the main code
*/

console.time("Temps d'exécution");

const leaderboardColumn = document.getElementsByClassName("leaderboardColumn")[0];
const mapInfoColumn = document.getElementsByClassName("mapInfoColumn")[0];

const buttonCheat = document.createElement("div");
buttonCheat.id = "buttonCheatBox";
buttonCheat.innerHTML =
    '<div id="monDiv" class="toggleCheat" onclick="toggleVariable()">Cheater On</div>';

mapInfoColumn.appendChild(buttonCheat);

var CheatOn = true; // Global variable that will get switch if there are cheated runs in the map history
const Togglecheat = document.getElementById("monDiv");

const params = new URLSearchParams(window.location.search); // Get the parameters from the URL
var SelectedMap = params.get("id").replace(/_/g, " "); // Name of the track without underscores

/* Leaderboard insertion */

// Créer un conteneur pour le leaderboard
const leaderboardBlock = document.createElement("div");
leaderboardBlock.className = "LeaderboardBlock";

// Ajouter la structure HTML directement avec innerHTML
leaderboardBlock.innerHTML = `
  <table id="Leaderboard">
    <tr>
      <th class='LeaderboardIndex'>#</th>
      <th colspan="2" class="LeaderboardPlayer" id="headerPlayer" style="text-align: left;">Player</th>
      <th class="LeaderboardTime">Time</th>
      <th class="LeaderboardDate">Date</th>
      <th class="LeaderboardInfo">Info</th>
    </tr>
  </table>
`;

// Ajouter le conteneur au DOM (par exemple, dans le body)
leaderboardColumn.appendChild(leaderboardBlock);

// Récupérer la table pour d'autres manipulations si nécessaire
const LBtable = document.getElementById("Leaderboard");

getData();

// Adding extra lines in the end to scroll down bellow leaderboard
const bottomSpaces = document.createElement("p");
// bottomSpaces.innerHTML = '<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>';
document.body.appendChild(bottomSpaces);

console.timeEnd("Temps d'exécution"); //~0.614m
