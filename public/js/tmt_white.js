var result = "";
var FirstMap = 1;
var map = "";
var envi = "";

// Grab all the data from the github sources
async function getData() {
    try {
        /* Fetch all the data concurrently */
        const responses = await Promise.all([
            fetch("https://raw.githubusercontent.com/Loupphok/TWRC/main/data/WRDb.csv"),
            fetch("https://raw.githubusercontent.com/Loupphok/TWRC/main/data/Nation.csv"),
            fetch("https://raw.githubusercontent.com/Loupphok/TWRC/main/data/flag.csv"),
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
    const range = (start, end) => {
        const length = end - start;
        return Array.from({ length }, (_, i) => start + i);
    };

    for (elem of myArray) {
        if (range(FirstMap, FirstMap + 40).includes(Number(elem[1]))) {
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

    showInfo(wrdata, Nation, Flag); // Once its parsed, put the data into the table
}

function showInfo(wrdata, Nation, Flag) {
    for (var i = FirstMap; i < 40 + FirstMap; i++) {
        map = i.toString().padStart(3, "0");
        if (i < 10 + FirstMap) {
            envi = "Canyon";
        } else if (i < 20 + FirstMap) {
            envi = "Valley";
        } else if (i < 30 + FirstMap) {
            envi = "Lagoon";
        } else {
            envi = "Stadium";
        }

        if ((i - 1) % 10 === 0) {
            var ChoiceBox = document.createElement("div");
            ChoiceBox.className = "ChoiceBox";

            var FlagHeader = document.createElement("div");
            FlagHeader.className = "FlagHeader";
            let enviLogo = '<img src="/assets/enviLogos/' + envi + 'Turbo.png">';
            let enviName = '<h1 class="FlagTitle">' + envi + "</h1>";
            FlagHeader.innerHTML = enviLogo + enviName + enviLogo;
            ChoiceBox.appendChild(FlagHeader);

            TOUT.appendChild(ChoiceBox);

            var ChoiceBoxFlag = document.createElement("div");
            ChoiceBoxFlag.className = "ChoiceBoxFlag";
        }

        let current_data;
        for (record of wrdata) {
            if (record[1] === map) {
                current_data = record;
            }
        }

        var MapThumbnailBox = document.createElement("div");
        MapThumbnailBox.className = "MapThumbnailBox";
        MapThumbnailBox.id = map;
        MapThumbnailBox.style = "cursor: pointer;";
        MapThumbnailBox.onclick = function () {
            window.location.href = "/map?id=" + this.id;
        };

        MapThumbnailBox.innerHTML =
            '<div class="ThumbnailHeader"><h3 class="ThumbnailMapName">' + map + "</h3></div>";

        var MapThumbnail = document.createElement("img");
        MapThumbnail.className = "MapThumbnail";
        MapThumbnail.src = "/assets/mapThumbnails/" + map + ".jpg";

        MapThumbnailBox.appendChild(MapThumbnail);

        var ThumbnailFooter = document.createElement("div");
        ThumbnailFooter.className = "ThumbnailFooter";

        var ThumbnailWrInfo = document.createElement("h5");
        ThumbnailWrInfo.className = "ThumbnailWrInfo";
        ThumbnailWrInfo.innerHTML =
            'WR: <span class="Wr">' + current_data[2] + "</span> - "; /* "WR: " + the WR time */
        let drapeau = Flag[Nation[current_data[0]]];
        if (typeof drapeau === "undefined") {
            drapeau = "/assets/flags/question.png";
        }

        ThumbnailWrInfo.innerHTML +=
            '<img class="WrFlag" src="' + drapeau + '">'; /* Adding the flag */
        ThumbnailWrInfo.innerHTML +=
            '<span class="WrHolder"> ' + current_data[0] + "</span>"; /* Adding the wr holder */
        ThumbnailFooter.appendChild(ThumbnailWrInfo);

        MapThumbnailBox.appendChild(ThumbnailFooter);

        ChoiceBoxFlag.appendChild(MapThumbnailBox);

        ChoiceBox.appendChild(ChoiceBoxFlag);
    }
}

const Corps = document.getElementsByClassName("Corps")[0];

const TOUT = document.createElement("div");
TOUT.id = "TOUT";
Corps.appendChild(TOUT);

getData();
