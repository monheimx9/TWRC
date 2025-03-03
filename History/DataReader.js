// Grab all the data from the github sources
async function getData(){
    try {
        /* Fetch all the data concurrently */
        const responses = await Promise.all([
            fetch('https://raw.githubusercontent.com/Loupphok/TWRC/main/data/WRDb.csv'),
            fetch('https://raw.githubusercontent.com/Loupphok/TWRC/main/data/Nation.csv'),
            fetch('https://raw.githubusercontent.com/Loupphok/TWRC/main/data/flag.csv'),
            fetch('https://raw.githubusercontent.com/Loupphok/TWRC/refs/heads/main/otherTests/PlayerDB.json')
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
    csvData = rows.map(row => row.split(';').filter(cell => cell.trim().length > 0)); // Split the file content by newlines to get each row
    
    // Keep only relevent map
    var mapWR = [];
    for(elem of csvData){
        if(elem[1] === SelectedMap){
            mapWR.push(elem);
        }
    }
    
    mapWR.sort((a, b) => {return b[7] - a[7];}); // Sort by rank to have the current wr on top of the list

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
        Flag[elem[0]] = "../assets/flags/" + elem[1];
    }

    /* Fetching Player data */
    playerDB = JSON.parse(alldata[3]);

    showInfo(mapWR, Nation, Flag, playerDB); // Once its parsed, put the data into the table
    mapInfo(mapWR, Nation, Flag, playerDB);
}

// Show info into the already made table
function showInfo(mapWR, Nation, Flag, playerDB){

    /* Delete every <td> from the table (update from cheat toggle) */
    for (const row of LBtable.rows) {
        for (let i = row.cells.length - 1; i >= 0; i--) {
        const cell = row.cells[i];

            // Delete only if <td>, not <th>
            if (cell.tagName.toLowerCase() === 'td') {
                row.deleteCell(i);
            }
        }
    }

    let redArray;
    let indexLine = 0;
    var anyCheat = false;

    /* Creation line by line of the data */
    for(CurrentLine of mapWR){
        var Cheat = false;
        if(CurrentLine[4] === "Cheated"){
            Cheat = true;
            anyCheat = true;
            if(!CheatOn){
                continue;
            }
        }

        /* Setup line of table */
        var tableLine = document.createElement("tr");     

        if(Cheat){
            tableLine.style = "color: #e06560; font-style: italic;";
        }

        /* Index */
        indexLine += 1;
        const index = document.createElement("td");
        index.className = "LeaderboardIndex";

        if(indexLine < 5) {
            index.innerHTML = "<div class='FlagPic'><img src='assets/"+indexLine+".png' alt=''></div>";
        }
        
        else {
            index.innerHTML = indexLine;
        }
        tableLine.appendChild(index);

        /* Player column */
        const LeaderboardNation = document.createElement("td");
        LeaderboardNation.className = "LeaderboardNation";
        let drapeau = Flag[Nation[CurrentLine[0]]]; 
        if(CurrentLine[8] != "a"){
            var playerINFO = getDBID(playerDB, CurrentLine[8], CurrentLine[6]);
            drapeau = Flag[playerINFO[1]]
        }

        if(typeof(drapeau)==="undefined"){
            drapeau = "../assets/flags/question.png";
        };

        LeaderboardNation.innerHTML = '<div class="FlagPic"><img src="' + drapeau + '" alt=""></div>';
        tableLine.appendChild(LeaderboardNation);
        
        redArray = '';
        if(CurrentLine[0] == "__"){
            redArray = "<span class='Question'>__</span>";
        }
        else if(CurrentLine[8] != "a"){
            redArray = playerINFO[2]
        }
        else{
            redArray=CurrentLine[0];
        }

        const LeaderboardPlayer = document.createElement("td");
        LeaderboardPlayer.className = "LeaderboardPlayer";
        LeaderboardPlayer.innerHTML = redArray;
        tableLine.appendChild(LeaderboardPlayer);

        /* Time column */
        redArray = '';
        for (elem of CurrentLine[2]) {
            if (elem === 'x') {
                redArray += "<span class='Question'>" + elem + '</span>';
            }
            else {
                redArray += elem;
            }
        }

        const LeaderboardTime = document.createElement("td");
        LeaderboardTime.className = "LeaderboardTime"
        LeaderboardTime.innerHTML = redArray
        tableLine.appendChild(LeaderboardTime);

        /* Date column */
        redArray = '';
        for (elem of CurrentLine[3]) {
            if (elem === '?') {
                redArray += "<span class='Question'>" + elem + '</span>';
            }
            else {
                redArray += elem;
            }
        }

        const LeaderboardDate = document.createElement("td");
        LeaderboardDate.className = "LeaderboardDate"
        LeaderboardDate.innerHTML = redArray
        tableLine.appendChild(LeaderboardDate);
        
        /* Info column */
        const LeaderboardInfo = document.createElement("td");
        LeaderboardInfo.className = "LeaderboardInfo"

        if(CurrentLine[4] === "."){
            LeaderboardInfo.innerHTML = " ";
        }
        else{
            LeaderboardInfo.innerHTML = CurrentLine[4];
        }
        
        tableLine.appendChild(LeaderboardInfo);

        LBtable.appendChild(tableLine) ; // Inputing the loop into the table
    }

    var toggleCheat = document.getElementById("monDiv");
    var mapInfoColumn = document.getElementsByClassName("mapInfoColumn")[0];
    if(!anyCheat){
        toggleCheat.style = "display: none;";
    }
    else if(anyCheat){
        toggleCheat.style.removeProperty("display");
    }
}

function getDBID(playerDB, id, game){
    switch(game){
        case "TMNF":
            for(player of playerDB){
                if(typeof(player["TMNF_Id"])=="string"){
                    if(id == player["TMNF_Id"]){
                        return([player["Id"], player["Country"], player["Display_Name"]])
                    }
                }
                else{
                    if(player["TMNF_Id"].includes(id)){
                        return([player["Id"], player["Country"], player["Display_Name"]])
                    }
                }
            }
            break;
    }
}

function getFullGameName(name, envi=null){
    switch(name){
        case "TMNF":
            return"Trackmania Nations Forever";
        case "TM2":
            return"Trackmania² " + envi;
        case "TMT":
            return"Trackmania Turbo";
    }
}

function getCorrectMapName(map, game){
    switch(game){
        case "TMNF":
        case "TM2":
            return map.slice(0,3);
        case "TMT":
            return "#" + SelectedMap;
    }
}

function getCorrectFileName(map, envi=null, game=null){
    switch(game){
        case "TMNF":
            return "../assets/mapThumbnails/TMNF_" + SelectedMap.slice(0,3) + ".jpg";
        case "TM2":
            return "../assets/mapThumbnails/TM2_" + envi + "_" + getCorrectMapName(SelectedMap, game) + ".jpg";
        case "TMT":
            return"../assets/mapThumbnails/" + SelectedMap + ".jpg";
    }
}

function getDifficulty(map, game){
    switch(game){
        case "TMNF":
        case "TM2":
            return map[0];
        case "TMT":
            if(map<41){return "A"}
            else if(map<81){return "B"}
            else if(map<121){return "C"}
            else if(map<161){return "D"}
            else {return "E"};
    }
}

function mostFrequentElement(arr) {
    let count = {}; // Stock all occurrences
    let maxFreq = 0;
    let mostFrequent = null;

    for (let item of arr) {
        count[item] = (count[item] || 0) + 1; // Increments the counter

        if (count[item] > maxFreq) { // Check if its the new most represented element
            maxFreq = count[item];
            mostFrequent = item;
        }
    }
    return [mostFrequent, maxFreq];
}

function convertTimeStr(time){
    let minutesSplit = time.split(":");
    let minute = parseInt(minutesSplit[0]);
    let secondSplit = minutesSplit[1].split(".");
    let second = parseInt(secondSplit[0]);
    let decim = 1000 + parseInt(secondSplit[1].padEnd(3,"0"));
    return minute * 60000 + second * 1000 + decim - 1000;
}

function getBestImprovement(mapWR, game){
    var coolDown = 7; // Number of days after first WR to start the tracking
    if(game=="TMNF"){
        unsort = mapWR.reverse();   
        var improvement = 0;
        var wrOfBestImprovement = NaN;
        var indexOfBestImprovement = 0;
        let [day, month, year] = unsort[0][3].split("/").map(Number);
        var firstDate = new Date(year, month-1, day);
        firstDate.setDate(firstDate.getDate() + coolDown);
        
        for(wr of unsort){
            let [day, month, year] = wr[3].split("/").map(Number);
            var newDate = new Date(year, month-1, day);
            if(newDate<firstDate){
                var currentWR = convertTimeStr(wr[2]);
            }
            else{
                let currentWRTest = convertTimeStr(wr[2]+"0");
                let improvementTest = currentWR - currentWRTest;
                if(improvementTest>improvement){
                    improvement = improvementTest;
                    wrOfBestImprovement = indexOfBestImprovement;
                };
                currentWR = currentWRTest;
            };
            indexOfBestImprovement += 1;
        }
    }
    
    let thousandths = game == "TMNF";
    return [
        unsort[wrOfBestImprovement][2] + " <span class='improveSpan'>(-" + (improvement/1000).toFixed(3-thousandths)+"s)</span>",
        unsort[wrOfBestImprovement][0]
    ];
}

function getLongestStandingWR(mapWR, game){
    switch(game){
        case "TMNF":
            // 1. Trier par rang
            mapWR.sort((a, b) => a[7] - b[7]); // rang est à l'index 7

            // 2. Stocker les durées pour chaque joueur
            const durees = {};

            //Fonction pour parser la date au format DD/MM/YYYY
            const parseDate = (dataStr) => {
                const [jour, mois, annee] = dataStr.split('/').map(Number);
                return new Date(annee, mois -1, jour); //mois -1 car janvier = 0 en js
            }

            for (let i = 0; i < mapWR.length; i++) {
                const joueur = mapWR[i][0];
                const dateDebut = parseDate(mapWR[i][3]); // date à l'index 3

                // Si ce n'est pas le dernier record, on prend la date du suivant
                // Sinon, on prend la date du jour (le record est toujours valable)
                const dateFin = i < mapWR.length - 1
                    ? parseDate(mapWR[i + 1][3])
                    : new Date();

                // Calcul de la durée en jours
                const duree = Math.round((dateFin - dateDebut) / (1000 * 60 * 60 * 24));
                

                // On additionne la durée pour le joueur
                if (durees[joueur]) {
                    durees[joueur] += duree;
                } else {
                    durees[joueur] = duree;
                }
            }
            console.log(durees)

            // 3. Trouver le joueur avec la durée maximale
            let maxJoueur = null;
            let maxDuree = 0;

            for (const [joueur, duree] of Object.entries(durees)) {
                if (duree > maxDuree) {
                    maxDuree = duree;
                    maxJoueur = joueur;
                }
            }

            // 4. Pourcentage
            let firstDate = parseDate(mapWR[0][3]);
            let nbDays = Math.round((new Date() - firstDate)/(1000 * 60 * 60 * 24));
            percent = Math.round(maxDuree/nbDays*100);

            // 5. Retourner le résultat
            return [maxJoueur, maxDuree, percent];
    }
}

function convertTimeDuration(days) {
    const YEAR = 365;
    const MONTH = 30;
  
    // Calcul des années
    const years = Math.floor(days / YEAR);
    days %= YEAR;
  
    // Calcul des mois
    const month = Math.floor(days / MONTH);
    days %= MONTH;
  
    // Le reste représente les jours
    return [years, month, days];
}

function mapInfo(mapWR, Nation, Flag, playerDB){
    let envi = mapWR[0][5];
    let game = mapWR[0][6];

    var mapPic = document.getElementById("mapPic");
    mapPic.src = getCorrectFileName(SelectedMap, envi, game);

    var gameInfo = document.getElementById("gameInfo");
    gameInfo.innerHTML = getFullGameName(game, envi);

    var enviInfo = document.getElementById("enviInfo");
    enviInfo.innerHTML = "<img src= '../assets/enviLogos/" + envi + ".png' alt='' style='width: 35px; height: 35px;vertical-align:middle;'> ";
    enviInfo.innerHTML += "<span class='playerSpan'>" + envi + "<span>";

    var mapInfo = document.getElementById("mapInfo");
    mapInfo.innerHTML = "<img src= '../assets/difficultyLogos/Flag" + getDifficulty(SelectedMap, game) + ".png' alt='' style='width: 25px; height: 25px;vertical-align:middle;'> ";
    mapInfo.innerHTML += "<span class='playerSpan'>" + getCorrectMapName(SelectedMap, game) + "<span>";
    var wrHolderList = [];

    for(CurrentLine of mapWR){
        if(CurrentLine[4] === "Cheated"){
            if(!CheatOn){
                continue;
            }
        }
        wrHolderList.push(CurrentLine[0]);
    }

    var WRAmountInfo = document.getElementById("WRAmountInfo"); // AJOUTER LES INFOS EN TITLE
    WRAmountInfo.innerHTML = wrHolderList.length + " WRs";

    var dominantInfo = document.getElementById("dominantInfo");
    let dominantPlayer = mostFrequentElement(wrHolderList);
    var drapeau = Flag[Nation[dominantPlayer[0]]];

    if(mapWR[0][8] != "a"){
        let dominantId;
        for(CurrentLine of mapWR){
            if(CurrentLine[0] == dominantPlayer[0]){
                dominantId = CurrentLine[8];
            }
        }
        playerINFO = getDBID(playerDB, dominantId, game)
        drapeau = Flag[playerINFO[1]]
        dominantPlayer[0] = playerINFO[2]
    }

    if(typeof(drapeau)==="undefined"){
        drapeau = "../assets/flags/question.png";
    };

    dominantInfo.innerHTML = '<img src="' + drapeau + '" alt="" style="width: 25px; height: 25px;vertical-align:middle;"> ';
    dominantInfo.innerHTML += "<span class='playerSpan'>" + dominantPlayer[0] + " - " + dominantPlayer[1] + " WRs </span>";

    var biggestInfo = document.getElementById("biggestInfo");
    biggestInfo_results = getBestImprovement(mapWR, game);

    drapeau = Flag[Nation[biggestInfo_results[1]]];
    if(typeof(drapeau)==="undefined"){
        drapeau = "../assets/flags/question.png";
    };
    biggestInfo.innerHTML = '<img src="' + drapeau + '" alt="" style="width: 25px; height: 25px;vertical-align:middle;"> ';
    biggestInfo.innerHTML += "<span class='playerSpan'>" + biggestInfo_results[1] + " - " + biggestInfo_results[0] + "<span>";

    if(mapWR[0][8] != "a"){
        let biggesttId;
        for(CurrentLine of mapWR){
            if(CurrentLine[0] == biggestInfo_results[1]){
                biggesttId = CurrentLine[8];
            }
        }
        playerINFO = getDBID(playerDB, biggesttId, game);
        drapeau = Flag[playerINFO[1]]
        if(typeof(drapeau)==="undefined"){
            drapeau = "../assets/flags/question.png";
        };
        biggestInfo.innerHTML = '<img src="' + drapeau + '" alt="" style="width: 25px; height: 25px;vertical-align:middle;"> ';
        biggestInfo.innerHTML += "<span class='playerSpan'>" + playerINFO[2] + " - " + biggestInfo_results[0] + "<span>";
    }
    
    var longestInfo = document.getElementById("longestInfo");
    let longestInfo_results = getLongestStandingWR(mapWR, game);

    drapeau = Flag[Nation[longestInfo_results[0]]];
    if(typeof(drapeau)==="undefined"){
        drapeau = "../assets/flags/question.png";
    };
    longestInfo.innerHTML = '<img src="' + drapeau + '" alt="" style="width: 25px; height: 25px;vertical-align:middle;"> ';
    let duration = convertTimeDuration(longestInfo_results[1]);
    let durationFormated = duration[0] + "Y'" + duration[1] + "M " + longestInfo_results[2] + "%";
    longestInfo.innerHTML += "<span class='playerSpan'>" + longestInfo_results[0] + " - " + durationFormated + "<span>";

    if(mapWR[0][8] != "a"){
        let longestId;
        for(CurrentLine of mapWR){
            if(CurrentLine[0] == longestInfo_results[0]){
                longestId = CurrentLine[8];
            }
        }
        playerINFO = getDBID(playerDB, longestId, game);
        drapeau = Flag[playerINFO[1]]
        if(typeof(drapeau)==="undefined"){
            drapeau = "../assets/flags/question.png";
        };
        longestInfo.innerHTML = '<img src="' + drapeau + '" alt="" style="width: 25px; height: 25px;vertical-align:middle;"> ';
        longestInfo.innerHTML += "<span class='playerSpan'>" + playerINFO[2] + " - " + durationFormated + "<span>";
    }

    let C08hist = [];
    for(elem of csvData){
        if(elem[1] === "C08 - Stadium"){
            C08hist.push(elem);
        }
    }
    let maching = getLongestStandingWR(C08hist, "TMNF");
    console.log(maching[0], convertTimeDuration(maching[1]))
};

function lolfun(){
    
//     let maplist = [
//         "A01-Race", "A02-Race", "A03-Race", "A04-Acrobatic", "A05-Race",
//         "A06-Obstacle", "A07-Race", "A08-Endurance", "A09-Race", "A10-Acrobatic",
//         "A11-Race", "A12-Speed", "A13-Race", "A14-Race", "A15-Speed",
//         "B01-Race", "B02-Race", "B03-Race", "B04-Acrobatic", "B05-Race",
//         "B06-Obstacle", "B07-Race", "B08-Endurance", "B09-Acrobatic", "B10-Speed",
//         "B11-Race", "B12-Race", "B13-Obstacle", "B14-Speed", "B15-Race",
//         "C01-Race", "C02-Race", "C03-Acrobatic", "C04-Race", "C05-Endurance",
//         "C06-Speed", "C07-Race", "C08-Obstacle", "C09-Race", "C10-Acrobatic",
//         "C11-Race", "C12-Obstacle", "C13-Race", "C14-Endurance", "C15-Speed",
//         "D01-Endurance", "D02-Race", "D03-Acrobatic", "D04-Race", "D05-Race",
//         "D06-Obstacle", "D07-Race", "D08-Speed", "D09-Obstacle", "D10-Race",
//         "D11-Acrobatic", "D12-Speed", "D13-Race", "D14-Endurance", "D15-Endurance",
//         "E01-Obstacle", "E02-Endurance", "E03-Endurance", "E04-Obstacle", "E05-Endurance"
//     ]

//     let allDurations = [];
//     for(map of maplist){
//         var mapWR = [];
//         for(elem of csvData){
//             if(elem[1] === map){
//                 mapWR.push(elem);
//             }
//         }
//         let test = getLongestStandingWR(mapWR, "TMNF");
//         allDurations.push([test[0], convertTimeDuration(test[1])]);
//     }
//     console.log(allDurations);
// }

// // Fonction pour basculer la valeur de la variable
// function toggleVariable() {
//     CheatOn = !CheatOn;
//     getData(CheatOn);
//     if(CheatOn){
//         Togglecheat.innerHTML = "Cheater On";
//     }
//     else{
//         Togglecheat.innerHTML = "Cheater Off";
//     }
}

// Function that creates the horizontal scroller on top of the page to chose close relatives maps
function createMapSelector() {
    let firstDiv = document.createElement("div");
    firstDiv.style = 'width: 75%; overflow-x: scroll; margin: auto;';

    let mapScroller = document.createElement("div");
    mapScroller.className = "scrollmenu";
    mapScroller.id = "mapScroller";
    mapScroller.style = "width: 2630px;";

    for (let i = 1; i <= 15; i++) {
        format = i.toString().padStart(2, '0');
        let singleMap = document.createElement("div");
        singleMap.style = "background-image: url(./assets/mapThumbnails/canyonA" + format + ".jpg); background-size: 175px; width: 175px; height: 117px;";
        singleMap.innerHTML = '<a href="#home">A' + format + '</a>';

        mapScroller.appendChild(singleMap);
    }
    firstDiv.appendChild(mapScroller);

    MapChoiceBlock.insertBefore(firstDiv, output1);
}

// Function that returns a column into an array
function getUniqueColumn(data, column){
    const Something = new Map()
    for(let i = 0; i < data.length; i++){
        Something.set(data[i][column], "sex");
    }
    return [...Something.keys()]
}

/*
Start of the main code
*/

console.time("Temps d'exécution");

const leaderboardColumn = document.getElementsByClassName("leaderboardColumn")[0];
const mapInfoColumn = document.getElementsByClassName("mapInfoColumn")[0];

const buttonCheat = document.createElement("div");
buttonCheat.id = "buttonCheatBox";
buttonCheat.innerHTML = '<div id="monDiv" class="toggleCheat" onclick="toggleVariable()">Cheater On</div>';

mapInfoColumn.appendChild(buttonCheat);

var CheatOn = true; // Global variable that will get switch if there are cheated runs in the map history
const Togglecheat = document.getElementById("monDiv");

const params = new URLSearchParams(window.location.search); // Get the parameters from the URL
var SelectedMap = params.get('id').replace(/_/g, ' '); // Name of the track without underscores

/* List insertion */

// createMapSelector(); // add the experimental map selector

/* Leaderboard insertion */

// Créer un conteneur pour le leaderboard
const leaderboardBlock = document.createElement('div');
leaderboardBlock.className = 'LeaderboardBlock';

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
const LBtable = document.getElementById('Leaderboard');

getData();

// Adding extra lines in the end to scroll down bellow leaderboard
const bottomSpaces = document.createElement("p");
// bottomSpaces.innerHTML = '<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>';
document.body.appendChild(bottomSpaces);

console.timeEnd("Temps d'exécution"); //~0.614m