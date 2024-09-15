// ---
// --- Getting the data
// ---

// Import data / fetch

const fileUrl = 'https://raw.githubusercontent.com/Loupphok/TWRC/main/data/WRDb.csv'; // Replace with the URL or path to your CSV file
let csvData = [];

// Récupérer les paramètres de l'URL
const params = new URLSearchParams(window.location.search);

// Récupérer la valeur de l'ID
const id = params.get('id');
// Afficher ou utiliser la valeur récupérée
SelectedMap = id.replace(/_/g, ' ');

// ---
// --- Output of blocks on the page
// ---

// List insertion

document.write('<div class="MapChoiceBlock">')

document.write(createMapSelector());
document.write('<h1 class="output" id="output1">Map: '+SelectedMap+'</h1>')
const out1 = document.getElementById("output1"); // Getting what's inside "ouiput1"
document.write('</div>') // end of List block


// Leaderboard insertion

document.write('<div class="LeaderboardBlock">')
document.write("<table id='Leaderboard'><tr><th colspan='2' class='LeaderboardPlayer' id='headerPlayer'>Player</th><th class='LeaderboardTime'>Time</th><th class='LeaderboardDate'>Date</th><th class='LeaderboardInfo'>Info</th></tr></table>");
const LBtable = document.getElementById("Leaderboard");
document.write('</div>') // end of Leaderboard block

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
    data = alldata[0];

    // Split the file content by newlines to get each row
    const rows = data.split('\n').filter(row => row.trim().length > 0);
    
    // Map through each row and split by comma to get individual columns
    csvData = rows.map(row => row.split(';').filter(cell => cell.trim().length > 0));
    let myArray = csvData;

    ///////////////////
    // Fetching Nation data
    ///////////////////

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

    dataFlag = alldata[2];

    // Split the file content by newlines to get each row
    const rowsFlag = dataFlag.split('\n').filter(row => row.trim().length > 0);
    
    // Map through each row and split by comma to get individual columns
    csvDataFlag = rowsFlag.map(row => row.split(';').filter(cell => cell.trim().length > 0));
    var Flag = {};

    for (elem of csvDataFlag) {
        Flag[elem[0]] = "assets/flags/" + elem[1];
    }

    // Setup of the header of the table
    var result = "";
    result += "<tr><th colspan='2' class='LeaderboardPlayer' id='headerPlayer'>Player</th><th class='LeaderboardTime'>Time</th><th class='LeaderboardDate'>Date</th><th class='LeaderboardInfo'>Info</th></tr>";
    
    // Main loop to add each lines
    for(var i=0; i<myArray.length; i++) {
        if(myArray[i][1] == SelectedMap){
            result += "<tr>";
            var Cheat = false
            if(myArray[i][4] === "Cheated"){
                Cheat = true
            }
            for(var j=0; j<myArray[i].length; j++){
                if(j == 0){ // Player column
                    // Finding nationality
                    // result += "<td class='LeaderboardNation'>" + Nation[myArray[i][j]] + "</td>";
                    result += "<td class='LeaderboardNation'>" + '<div class="FlagPic"><img src="' + Flag[Nation[myArray[i][j]]] + '" alt=""></div>' + "</td>";
                    if(Cheat){
                        result += "<td class='LeaderboardPlayer'><span class='Cheated'>"+myArray[i][j]+"</span></td>";
                    }
                    else{
                        var redArray = '';
                        if(myArray[i][j] == "__"){
                            redArray = "<span class='Question'>__</span>";
                        }
                        else{
                            redArray=myArray[i][j];
                        }
                        result += "<td class='LeaderboardPlayer'>"+redArray+"</td>";
                    }
                }
                if(j == 2){ // Time column
                    if(Cheat){
                        result += "<td class='LeaderboardTime'><span class='Cheated'>"+myArray[i][j]+"</span></td>";
                    }
                    else{
                        var redArray = '';
                        for (elem of myArray[i][j]) {
                            if (elem === 'x') {
                                redArray += "<span class='Question'>" + elem + '</span>';
                            }
                            else {
                                redArray += elem;
                            }
                        }
                        result += "<td class='LeaderboardTime'>"+redArray+"</td>";
                    }
                }
                if(j == 3){ // Date column
                    if(Cheat){
                        result += "<td class='LeaderboardDate'><span class='Cheated'>"+myArray[i][j]+"</span></td>";
                    }
                    else{
                        var redArray = '';
                        for (elem of myArray[i][j]) {
                            if (elem === '?') {
                                redArray += "<span class='Question'>" + elem + '</span>';
                            }
                            else {
                                redArray += elem;
                            }
                        }
                        result += "<td class='LeaderboardDate'>"+redArray+"</td>";
                    }
                }
                if(j == 4){ // Info column
                    if(Cheat){
                        result += "<td class='LeaderboardInfo'><span class='Cheated'>"+myArray[i][j]+"</span></td>";
                    }
                    else{
                        if(myArray[i][j] === "."){
                            result += "<td class='LeaderboardInfo'> </td>";
                        }
                        else{
                            result += "<td class='LeaderboardInfo'>"+myArray[i][j]+"</td>";
                        }
                    }
                }
            }
            result += "</tr>";
        }
    }
    LBtable.innerHTML = result;
 
}).catch(function (error){
    console.log(error);
});

    // Adding extra lines in the end to scroll down bellow leaderboard

document.write("<p><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br></p>")
document.write("<p><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br></p>")

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

function getUniqueColumn(data, column){
    const Something = new Map()
    for(let i = 0; i < data.length; i++){
        Something.set(data[i][column], "sex");
    }
    return [...Something.keys()]

}

function MapSelector(maps){
    var result = '<select name="Maps" id="MapSelector" onchange="getSelectValue()">';
    for(let map of maps){
        result += '<option value="' + map + '">' + map + '</option>';
    }
    result += "</select>";
    return result;
}