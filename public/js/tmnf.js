var result = "";
var letter = "";
var map = "";
var game = "TMNF";
const envi = "Stadium"; //Select the envi

// Grab all the data from the github sources
async function getData() {
    try {
        /* Fetch all the data concurrently */
        const responses = await Promise.all([
            fetch("https://raw.githubusercontent.com/Loupphok/TWRC/main/data/WRDb.csv"),
            fetch("https://raw.githubusercontent.com/Loupphok/TWRC/main/data/flag.csv"),
            fetch(
                "https://raw.githubusercontent.com/Loupphok/TWRC/refs/heads/main/data/mapList.json",
            ),
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

    let myArray = csvData;
    var finalarray = [];

    // Only keep the relevant data into the database
    for (elem of myArray) {
        if (elem[6] === game) {
            finalarray.push(elem);
        }
    }

    // Create a database with all wrs
    let wrdata = [];
    let prevRank = 0;
    for (elem of finalarray.reverse()) {
        if (Number(elem[7]) >= prevRank) {
            wrdata.push(elem);
        }
        prevRank = elem[7];
    }

    /* Fetching Flag data */
    dataFlag = alldata[1]; // Import data from Flag.csv
    const rowsFlag = dataFlag.split("\n").filter((row) => row.trim().length > 0); // Split the file content by newlines to get each row
    csvDataFlag = rowsFlag.map((row) => row.split(";").filter((cell) => cell.trim().length > 0));
    var Flag = {};
    for (elem of csvDataFlag) {
        Flag[elem[0]] = "/assets/flags/" + elem[1];
    }

    /* Fetching Maps data */
    let allMaps = JSON.parse(alldata[2]);
    var mapList = [];
    for (thing of allMaps) {
        if (thing["game"] == game) {
            mapList = thing["maplist"];
        }
    }

    /* Fetching Player data */
    playerDB = JSON.parse(alldata[3]);

    showInfo(wrdata, Flag, mapList, playerDB); // Once its parsed, put the data into the table
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

function showInfo(wrdata, Flag, mapList, playerDB) {
    let mapIndex = 0;

    for (pre of [
        ["A", "White"],
        ["B", "Green"],
        ["C", "Blue"],
        ["D", "Red"],
        ["E", "Black"],
    ]) {
        // Select the letter of each maps
        letter = pre[0];

        // Setup of the header of each flag
        const ChoiceBox = document.createElement("div");
        ChoiceBox.className = "ChoiceBox";

        const FlagHeader = document.createElement("div");
        FlagHeader.className = "FlagHeader";
        let drapeau = "<img src='/assets/difficultyLogos/Flag" + letter + ".png'>";
        let diff = "<h1 class='FlagTitle'>" + pre[1] + " difficulty</h1>";
        FlagHeader.innerHTML = drapeau + diff + drapeau;
        ChoiceBox.appendChild(FlagHeader);

        TOUT.appendChild(ChoiceBox);

        const ChoiceBoxFlag = document.createElement("div");
        ChoiceBoxFlag.className = "ChoiceBoxFlag";

        ChoiceBox.appendChild(ChoiceBoxFlag);

        let nbMaps = 15;
        if (letter == "E") {
            nbMaps = 5;
        }
        for (var i = 0; i < nbMaps; i++) {
            mapIndex += 1;
            // Finding the only relevent record
            map = letter + (i + 1).toString().padStart(2, "0");
            map_data = mapList[mapIndex - 1];
            let current_data;
            for (record of wrdata) {
                if (record[1] === map_data) {
                    current_data = record;
                }
            }

            // Setup of each individual map boxes
            var MapThumbnailBox = document.createElement("div");
            MapThumbnailBox.className = "MapThumbnailBox";
            MapThumbnailBox.id = map_data;
            MapThumbnailBox.style = "cursor: pointer;";
            MapThumbnailBox.onclick = function () {
                window.location.href = "/map?id=" + this.id;
            };

            MapThumbnailBox.innerHTML =
                '<div class="ThumbnailHeader"><h3 class="ThumbnailMapName">' +
                map_data +
                "</h3></div>";

            var MapThumbnail = document.createElement("img");
            MapThumbnail.className = "MapThumbnail";
            MapThumbnail.src = "/assets/mapThumbnails/TMNF_" + map + ".jpg";

            MapThumbnailBox.appendChild(MapThumbnail);

            var ThumbnailFooter = document.createElement("div");
            ThumbnailFooter.className = "ThumbnailFooter";

            var ThumbnailWrInfo = document.createElement("h5");
            ThumbnailWrInfo.className = "ThumbnailWrInfo";
            ThumbnailWrInfo.innerHTML =
                'WR: <span class="Wr">' + current_data[2] + "</span> - "; /* "WR: " + the WR time */

            /* Get player's id */
            playerINFO = getDBID(playerDB, current_data[8], "TMNF");
            let drapeau = Flag[playerINFO[1]];
            if (typeof drapeau === "undefined") {
                drapeau = "/assets/flags/question.png";
            }
            ThumbnailWrInfo.innerHTML +=
                '<img class="WrFlag" src="' + drapeau + '">'; /* Adding the flag */
            ThumbnailWrInfo.innerHTML +=
                '<span class="WrHolder"> ' + playerINFO[2] + "</span>"; /* Adding the wr holder */
            ThumbnailFooter.appendChild(ThumbnailWrInfo);

            MapThumbnailBox.appendChild(ThumbnailFooter);

            ChoiceBoxFlag.appendChild(MapThumbnailBox);
        }
    }
}

const Corps = document.getElementsByClassName("Corps")[0];

const TOUT = document.createElement("div");
TOUT.id = "TOUT";
Corps.appendChild(TOUT);

getData();
