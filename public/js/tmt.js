// Grab all the data from the github sources
async function getData() {
    try {
        /* Fetch all the data concurrently */
        const responses = await Promise.all([
            fetch("https://raw.githubusercontent.com/Loupphok/TWRC/main/data/WRDb.csv"),
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

    showInfo(csvData);
}

function showInfo(mapWR) {
    let EnviWrCount = {};

    for (wr of mapWR) {
        if (wr[6] == "TMT") {
            let map = Number(wr[1]);
            let diff;
            if (map < 41) {
                diff = "A";
            } else if (map < 81) {
                diff = "B";
            } else if (map < 121) {
                diff = "C";
            } else if (map < 161) {
                diff = "D";
            } else {
                diff = "E";
            }
            if (EnviWrCount[diff]) {
                EnviWrCount[diff] += 1;
            } else {
                EnviWrCount[diff] = 1;
            }
        }
    }

    let WrStatTMTWhite = document.getElementById("WrStatTMTWhite");
    WrStatTMTWhite.innerHTML =
        "> <span class='WrCount'>" + EnviWrCount["A"] + "</span> WR Archived";

    let WrStatTMTGreen = document.getElementById("WrStatTMTGreen");
    WrStatTMTGreen.innerHTML =
        "> <span class='WrCount'>" + EnviWrCount["B"] + "</span> WR Archived";

    let WrStatTMTBlue = document.getElementById("WrStatTMTBlue");
    WrStatTMTBlue.innerHTML = "> <span class='WrCount'>" + EnviWrCount["C"] + "</span> WR Archived";

    let WrStatTMTRed = document.getElementById("WrStatTMTRed");
    WrStatTMTRed.innerHTML = "> <span class='WrCount'>" + EnviWrCount["D"] + "</span> WR Archived";

    let WrStatTMTBlack = document.getElementById("WrStatTMTBlack");
    WrStatTMTBlack.innerHTML =
        "> <span class='WrCount'>" + EnviWrCount["E"] + "</span> WR Archived";
}

getData();
