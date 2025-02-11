// Grab all the data from the github sources
async function getData(){
    try {
        /* Fetch all the data concurrently */
        const responses = await Promise.all([
            fetch('https://raw.githubusercontent.com/Loupphok/TWRC/main/data/WRDb.csv'),
            fetch('https://raw.githubusercontent.com/Loupphok/TWRC/main/data/Nation.csv'),
            fetch('https://raw.githubusercontent.com/Loupphok/TWRC/main/data/flag.csv')
        ]);

        /* Extract the text from each response */
        const alldata = await Promise.all(responses.map(response => response.text()));

        parseData(alldata); // Parse the data

    } catch (error) {
        console.error(error);
    }
}

// Parse the data so we can use it (convert from csv to list of lists)
function parseData(alldata){

    /* Fetching HISTORY data */
    data = alldata[0]; // Import data from WRDb.csv
    const rows = data.split('\n').filter(row => row.trim().length > 0); // Split the file content by newlines to get each row
    mapWR = rows.map(row => row.split(';').filter(cell => cell.trim().length > 0)); // Split the file content by newlines to get each row
    // mapWR = mapWR.slice(0,4264);

    /* Fetching Nation data */
    dataNation = alldata[1];  // Import data from Nation.csv
    const rowsNation = dataNation.split('\n').filter(row => row.trim().length > 0); // Split the file content by newlines to get each row
    
    csvDataNation = rowsNation.map(row => row.split(';').filter(cell => cell.trim().length > 0));
    var Nation = {};
    for (elem of csvDataNation) {
        Nation[elem[0]] = elem[1];
    }
    
    /* Fetching Flag data */
    dataFlag = alldata[2]; // Import data from Flag.csv
    const rowsFlag = dataFlag.split('\n').filter(row => row.trim().length > 0); // Split the file content by newlines to get each row
    csvDataFlag = rowsFlag.map(row => row.split(';').filter(cell => cell.trim().length > 0));
    var Flag = {};
    for (elem of csvDataFlag) {
        Flag[elem[0]] = "assets/flags/" + elem[1];
    }

    getInfo(mapWR, Nation, Flag); // Once its parsed, put the data into the page
}

function convertDate(dateStr){
    const [jour, mois, annee] = dateStr.split("/"); 
    return new Date(annee, mois - 1, jour);
}

function getCorrectFileName(map, envi=null, game=null){
    if(game=="TMNF"){
        return "assets/mapThumbnails/TMNF_" + map.slice(0,3) + ".jpg";
    };

    if(game=="TM2"){
        return "assets/mapThumbnails/TM2_" + envi + "_" + getCorrectMapName(map, game) + ".jpg";
    };

    if(game=="TMT"){
        return"assets/mapThumbnails/" + map + ".jpg";
    };

    return map;
}

function getCorrectMapName(map, game){
    if(game=="TMNF" || game=="TM2"){
        return map.slice(0,3);
    };

    if(game=="TMT"){
        return "#" + map;
    };

    return map;
}

function getInfo(mapWR, Nation, Flag){
    // Number of WR archived
    let wrBox = document.getElementsByClassName("wrBox")[0];
    wrBox.innerHTML = mapWR.length;

    // Find latest WR
    console.log(mapWR)
    let latestWR;
    let latestWRDate = convertDate("01/01/2000");
    for(wr of mapWR){
        if(!(wr[3].includes("?") | wr[3].includes("-"))){
            let currentDate = convertDate(wr[3]);
            if(currentDate > latestWRDate){
                latestWRDate = currentDate;
                latestWR = wr;
            }
        }
    }
    console.log(getMostRecentLists(mapWR));

    let latestThumbnail = document.getElementById("latestThumbnail");
    latestThumbnail.innerHTML = "<img src='" + getCorrectFileName(latestWR[1], latestWR[5], latestWR[6]) + "'>";

    let latestMap = document.getElementById("latestMap");
    latestMap.innerHTML = latestWR[1];

    let latestHolder = document.getElementById("latestHolder");
    let drapeau = Flag[Nation[latestWR[0]]];
    if(typeof(drapeau)==="undefined"){
        drapeau = "assets/flags/question.png";
    };
    latestHolder.innerHTML = "by " + latestWR[0] + " <img class='flagLatestWR' src='" + drapeau + "'>";

    let latestDate = document.getElementById("latestDate");
    latestDate.innerHTML = latestWR[3];
}

function parseDate(dateStr) {
    const [day, month, year] = dateStr.split("/").map(Number);
    return year && month && day ? new Date(year, month - 1, day) : null;
}

function getMostRecentLists(lists, k = 5) {
    return lists
        .filter(list => {
            const dateStr = list[3];
            return dateStr && !/[?-]/.test(dateStr);
        })
        .map(list => ({ list, date: parseDate(list[3]) }))
        .filter(item => item.date !== null)
        .sort((a, b) => b.date - a.date)
        .slice(0, k)
        .map(item => item.list);
}

getData()