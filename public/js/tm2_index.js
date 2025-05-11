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
        if (wr[6] == "TM2") {
            if (EnviWrCount[wr[5]]) {
                EnviWrCount[wr[5]] += 1;
            } else {
                EnviWrCount[wr[5]] = 1;
            }
        }
    }

    let WrStatLagoon = document.getElementById("WrStatLagoon");
    WrStatLagoon.innerHTML =
        "> <span class='WrCount'>" + EnviWrCount["Lagoon"] + "</span> WR Archived";

    let WrStatStadium = document.getElementById("WrStatStadium");
    WrStatStadium.innerHTML =
        "> <span class='WrCount'>" + EnviWrCount["Stadium"] + "</span> WR Archived";

    let WrStatValley = document.getElementById("WrStatValley");
    WrStatValley.innerHTML =
        "> <span class='WrCount'>" + EnviWrCount["Valley"] + "</span> WR Archived";

    let WrStatCanyon = document.getElementById("WrStatCanyon");
    WrStatCanyon.innerHTML =
        "> <span class='WrCount'>" + EnviWrCount["Canyon"] + "</span> WR Archived";
}

getData();
