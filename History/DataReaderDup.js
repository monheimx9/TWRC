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
    
    mapWR.sort((a, b) => {return a[7] - b[7];}); // Sort by rank to have the current wr on top of the list

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
}

// Show info into the already made table
function showInfo(mapWR, Nation, Flag){

    /* Create and show the table */

    // Setup of the header of the table
    var result = "";
    result += "<tr><th class='LeaderboardIndex'>#</th><th colspan='2' class='LeaderboardPlayer' id='headerPlayer'>Player</th><th class='LeaderboardTime'>Time</th><th class='LeaderboardDate'>Date</th><th class='LeaderboardInfo'>Info</th></tr>";
    
    // Main loop to add each lines
    let redArray;
    let index = 0;
    let anyCheat = false;
    for(CurrentLine of mapWR) {
        var Cheat = false;
        if(CurrentLine[4] === "Cheated"){
            Cheat = true;
            anyCheat = true;
            if(!CheatOn){
                continue;
            }
        }
        index += 1;
        
        result += "<tr";
        if(Cheat){
            result += " style='color: #e06560; font-style: italic;'";
        }
        result += ">";
        //######- Index -######
        result += "<td class='LeaderboardIndex'>" + index + "</td>";
        //######- Player column -######
        // Finding nationality
        result += "<td class='LeaderboardNation'>" + '<div class="FlagPic"><img src="' + Flag[Nation[CurrentLine[0]]] + '" alt=""></div></td>';
        redArray = '';
        if(CurrentLine[0] == "__"){
            redArray = "<span class='Question'>__</span>";
        }
        else{
            redArray=CurrentLine[0];
        }
        result += "<td class='LeaderboardPlayer'>"+redArray+"</td>";
        
        //######- Time column -######
        redArray = '';
        for (elem of CurrentLine[2]) {
            if (elem === 'x') {
                redArray += "<span class='Question'>" + elem + '</span>';
            }
            else {
                redArray += elem;
            }
        }
        result += "<td class='LeaderboardTime'>"+redArray+"</td>";
        //######- Date column -######
        redArray = '';
        for (elem of CurrentLine[3]) {
            if (elem === '?') {
                redArray += "<span class='Question'>" + elem + '</span>';
            }
            else {
                redArray += elem;
            }
        }
        result += "<td class='LeaderboardDate'>"+redArray+"</td>";
        
        //######- Info column -######
        if(CurrentLine[4] === "."){
            result += "<td class='LeaderboardInfo'> </td>";
        }
        else{
            result += "<td class='LeaderboardInfo'>"+CurrentLine[4]+"</td>";
        }
        
        result += "</tr>";
    }
    // Inputing the loop into the table
    LBtable.innerHTML = result;
    if(!anyCheat){
        buttonCheat.innerHTML = "";
    }
}

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

const Corps = document.getElementsByClassName("Corps")[0];

const buttonCheat = document.createElement("div");
buttonCheat.id = "buttonCheatBox";
buttonCheat.innerHTML = '<div id="monDiv" class="toggleCheat" onclick="toggleVariable()">Cheater On</div>';

Corps.appendChild(buttonCheat);

var CheatOn = true; // Global variable that will get switch if there are cheated runs in the map history
const Togglecheat = document.getElementById("monDiv");

const params = new URLSearchParams(window.location.search); // Get the parameters from the URL
const SelectedMap = params.get('id').replace(/_/g, ' '); // Name of the track without underscores

/* List insertion */

const MapChoiceBlock = document.createElement("div");
MapChoiceBlock.className = "MapChoiceBlock";

MapChoiceBlock.innerHTML = '<h1 class="output" id="output1">Map: '+SelectedMap+'</h1>';

Corps.appendChild(MapChoiceBlock);

const output1 = document.getElementById("output1");

//createMapSelector(); // add the experimental map selector

/* Leaderboard insertion */

// Créer un conteneur pour le leaderboard
const leaderboardBlock = document.createElement('div');
leaderboardBlock.className = 'LeaderboardBlock';

// Ajouter la structure HTML directement avec innerHTML
leaderboardBlock.innerHTML = `
  <table id="Leaderboard">
    <tr>
      <th class='LeaderboardIndex'>#</th>
      <th colspan="2" class="LeaderboardPlayer" id="headerPlayer">Player</th>
      <th class="LeaderboardTime">Time</th>
      <th class="LeaderboardDate">Date</th>
      <th class="LeaderboardInfo">Info</th>
    </tr>
  </table>
`;

// Ajouter le conteneur au DOM (par exemple, dans le body)
Corps.appendChild(leaderboardBlock);

// Récupérer la table pour d'autres manipulations si nécessaire
const LBtable = document.getElementById('Leaderboard');

getData();

// Adding extra lines in the end to scroll down bellow leaderboard
const bottomSpaces = document.createElement("p");
bottomSpaces.innerHTML = '<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>';
document.body.appendChild(bottomSpaces);

console.timeEnd("Temps d'exécution"); //~0.614m