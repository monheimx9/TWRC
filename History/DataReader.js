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
        Flag[elem[0]] = "assets/flags/" + elem[1];
    }

    showInfo(mapWR, Nation, Flag); // Once its parsed, put the data into the table
    mapInfo(mapWR, Nation, Flag);
}

// Show info into the already made table
function showInfo(mapWR, Nation, Flag){

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
            // if(indexLine == 4){
            //     tableLine.style.backgroundColor = "#312a20";
            // }
            // else if (indexLine == 3){
            //     tableLine.style.backgroundColor = "#313131";
            // }
            // else if(indexLine == 2){
            //     tableLine.style.backgroundColor = "#3d3320";
            // }
            // else{
            //     tableLine.style.backgroundColor = "#273127";
            // }
        }
        else {
            index.innerHTML = indexLine;
        }
        tableLine.appendChild(index);

        /* Player column */
        const LeaderboardNation = document.createElement("td");
        LeaderboardNation.className = "LeaderboardNation";
        LeaderboardNation.innerHTML = '<div class="FlagPic"><img src="' + Flag[Nation[CurrentLine[0]]] + '" alt=""></div>';
        tableLine.appendChild(LeaderboardNation);
        
        redArray = '';
        if(CurrentLine[0] == "__"){
            redArray = "<span class='Question'>__</span>";
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
    console.log(anyCheat);

    var toggleCheat = document.getElementById("monDiv");
    var mapInfoColumn = document.getElementsByClassName("mapInfoColumn")[0];
    console.log(mapInfoColumn.style);
    if(!anyCheat){
        toggleCheat.style = "visibility: hidden;";
        mapInfoColumn.style.height = "580px";
    }
    else if(anyCheat){
        toggleCheat.style = "visibility: visible;";
        mapInfoColumn.style.height = "640px";
    }
    console.log(mapInfoColumn.style);
}

function getFullGameName(name, envi=null){
    if(name=="TM2"){
        return "Trackmania² "+envi;
    };

    if(name=="TMT"){
        return "Trackmania Turbo";
    };

    return name;
}

function getCorrectMapName(map, game){
    if(game=="TM2"){
        return map.slice(0,3);
    };

    if(game=="TMT"){
        return "#" + SelectedMap;
    };

    return map;
}

function getCorrectFileName(map, envi=null, game=null){
    if(game=="TM2"){
        return "../assets/mapThumbnails/TM2_" + envi + "_" + getCorrectMapName(SelectedMap, game) + ".jpg";
    };

    if(game=="TMT"){
        return"../assets/mapThumbnails/" + SelectedMap + ".jpg";
    };

    return map;
}

function getDifficulty(map, game){
    if(game=="TM2"){
        return map[0];
    }
    if(game=="TMT"){
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
    return mostFrequent;
}

function mapInfo(mapWR, Nation, Flag){
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
    WRAmountInfo.innerHTML = wrHolderList.length;

    var dominantInfo = document.getElementById("dominantInfo");
    let dominantPlayer = mostFrequentElement(wrHolderList);
    dominantInfo.innerHTML = '<img src="' + Flag[Nation[dominantPlayer]] + '" alt="" style="width: 25px; height: 25px;vertical-align:middle;"> ';
    dominantInfo.innerHTML += "<span class='playerSpan'>" + dominantPlayer + "<span>";
};

// Fonction pour basculer la valeur de la variable
function toggleVariable() {
    CheatOn = !CheatOn;
    getData(CheatOn);
    if(CheatOn){
        Togglecheat.innerHTML = "Cheater On";
    }
    else{
        Togglecheat.innerHTML = "Cheater Off";
    }
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