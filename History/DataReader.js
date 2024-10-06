///////////////////
// Getting the data
///////////////////

console.time("Temps d'exécution");

document.write('<div id="buttonCheatBox"><div id="monDiv" class="toggleCheat" onclick="toggleVariable()">Cheater On</div></div>');
const buttonCheat = document.getElementById("buttonCheatBox");

// Variable globale à switcher
let CheatOn = true;

const Togglecheat = document.getElementById("monDiv");

// Fonction pour basculer la valeur de la variable
function toggleVariable() {
    CheatOn = !CheatOn;
    everything(CheatOn);
    if(CheatOn){
        Togglecheat.innerHTML = "Cheater On";
    }
    else{
        Togglecheat.innerHTML = "Cheater Off";
    }
}

// Attacher l'événement click à la div

// Import data / fetch
const fileUrl = 'https://raw.githubusercontent.com/Loupphok/TWRC/main/data/WRDb.csv'; // Replace with the URL or path to your CSV file
let csvData = [];

// Récupérer les paramètres de l'URL
const params = new URLSearchParams(window.location.search);

// Récupérer la valeur de l'ID
const id = params.get('id');

// Afficher ou utiliser la valeur récupérée
SelectedMap = id.replace(/_/g, ' ');


///////////////////
// Output of blocks on the page
///////////////////

// List insertion
document.write('<div class="MapChoiceBlock">')

// document.write(createMapSelector());
document.write('<h1 class="output" id="output1">Map: '+SelectedMap+'</h1>')
const out1 = document.getElementById("output1"); // Getting what's inside "ouiput1"
document.write('</div>') // end of List block

// Leaderboard insertion

document.write('<div class="LeaderboardBlock">')
document.write("<table id='Leaderboard'><tr><th colspan='2' class='LeaderboardPlayer' id='headerPlayer'>Player</th><th class='LeaderboardTime'>Time</th><th class='LeaderboardDate'>Date</th><th class='LeaderboardInfo'>Info</th></tr></table>");
const LBtable = document.getElementById("Leaderboard");
document.write('</div>') // end of Leaderboard block


everything(CheatOn)

function everything(CheatOn){
    ///////////////////
    // Parse and show data
    ///////////////////
    Promise.all([
        fetch('https://raw.githubusercontent.com/Loupphok/TWRC/main/data/WRDb.csv'),
        fetch('https://raw.githubusercontent.com/Loupphok/TWRC/main/data/Nation.csv'),
        fetch('https://raw.githubusercontent.com/Loupphok/TWRC/main/data/flag.csv')
    ]).then(function (responses) {
        return Promise.all(responses.map(function(response){
            return response.text();
        }))
    }).then(function (alldata){

        ///////////////////
        // Fetching HISTORY data
        ///////////////////

        // Import data from WRDb.csv
        data = alldata[0];

        // Split the file content by newlines to get each row
        const rows = data.split('\n').filter(row => row.trim().length > 0);

        // Map through each row and split by comma to get individual columns
        csvData = rows.map(row => row.split(';').filter(cell => cell.trim().length > 0));
        
        // Keep only relevent maps
        let myArray = [];
        for(elem of csvData){
            if(elem[1] === SelectedMap){
                myArray.push(elem);
            }
        }

        // Sort by rank to have the current wr on top of the list
        myArray.sort((a, b) => {
            return a[7] - b[7];
        });

        ///////////////////
        // Fetching Nation data
        ///////////////////

        // Import data from Nation.csv
        dataNation = alldata[1];

        // Split the file content by newlines to get each row
        const rowsNation = dataNation.split('\n').filter(row => row.trim().length > 0);
        
        // Map through each row and split by comma to get individual columns
        csvDataNation = rowsNation.map(row => row.split(';').filter(cell => cell.trim().length > 0));
        var Nation = {};

        for (elem of csvDataNation) {
            Nation[elem[0]] = elem[1];
        }

        ///////////////////
        // Fetching Flag data
        ///////////////////

        // Import data from Flag.csv
        dataFlag = alldata[2];

        // Split the file content by newlines to get each row
        const rowsFlag = dataFlag.split('\n').filter(row => row.trim().length > 0);
        
        // Map through each row and split by comma to get individual columns
        csvDataFlag = rowsFlag.map(row => row.split(';').filter(cell => cell.trim().length > 0));
        var Flag = {};

        for (elem of csvDataFlag) {
            Flag[elem[0]] = "assets/flags/" + elem[1];
        }

        ///////////////////
        // Create and show the table
        ///////////////////

        // Setup of the header of the table
        var result = "";
        result += "<tr><th class='LeaderboardIndex'>#</th><th colspan='2' class='LeaderboardPlayer' id='headerPlayer'>Player</th><th class='LeaderboardTime'>Time</th><th class='LeaderboardDate'>Date</th><th class='LeaderboardInfo'>Info</th></tr>";
        
        // Main loop to add each lines
        let redArray;
        let index = 0;
        let anyCheat = false;
        for(CurrentLine of myArray) {
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
    
    }).catch(function (error){
        console.log(error);
    });
}


// Adding extra lines in the end to scroll down bellow leaderboard
document.write("<p><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br></p>")
document.write("<p><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br></p>")

// Function that creates the horizontal scroller on top of the page to chose close relatives maps
function createMapSelector() {
    code = '';
    code += '<div style="width: 75%; overflow-x: scroll; margin: auto;">';
    code += '<div class="scrollmenu", id="mapScroller" style="width: 2630px;">';
    for (let i = 1; i <= 15; i++) {
        format = i.toString().padStart(2, '0');
        code += '<div style="background-image: url(./assets/mapThumbnails/canyonA' + format + '.jpg); background-size: 175px; width: 175px; height: 117px;">';
        code += '<a href="#home">A' + format + '</a>';
        code += '</div>';
    }
    code += '</div></div>';
    return code;
}

console.timeEnd("Temps d'exécution"); //0.614ms

// Function that returns a column into an array
function getUniqueColumn(data, column){
    const Something = new Map()
    for(let i = 0; i < data.length; i++){
        Something.set(data[i][column], "sex");
    }
    return [...Something.keys()]
}