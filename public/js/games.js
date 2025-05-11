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
    let GamesWrCount = {};

    for (wr of mapWR) {
        if (GamesWrCount[wr[6]]) {
            GamesWrCount[wr[6]] += 1;
        } else {
            GamesWrCount[wr[6]] = 1;
        }
    }

    let WrStatTMT = document.getElementById("WrStatTMT");
    WrStatTMT.innerHTML = "> <span class='WrCount'>" + GamesWrCount["TMT"] + "</span> WR Archived";

    let WrStatTM2 = document.getElementById("WrStatTM2");
    WrStatTM2.innerHTML = "> <span class='WrCount'>" + GamesWrCount["TM2"] + "</span> WR Archived";

    let WrStatTMNF = document.getElementById("WrStatTMNF");
    WrStatTMNF.innerHTML =
        "> <span class='WrCount'>" + GamesWrCount["TMNF"] + "</span> WR Archived";
}

getData();
