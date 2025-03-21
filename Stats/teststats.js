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

    showInfo(csvData, Nation, Flag, playerDB);
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
    }
}

function showInfo(mapWR, Nation, Flag, playerDB){
    let game = "TMNF";
    let players = [];

    // Display player count
    let playerLB = document.getElementById("playerLB");
    let playerTable = playerLB.getElementsByClassName("tableLB")[0];

    for(elem of mapWR){
        if(elem[6] != "game"){
            // if(elem[4] != "Cheated"){
                let currentPlayer = elem[0] + "|SPLIT|" + Nation[elem[0]];
                if(elem[8] != "a"){
                    let playerINFO = getDBID(playerDB, elem[8], game);
                    currentPlayer = playerINFO[2] + "|SPLIT|" + playerINFO[1];
                }
                else{
                    if(typeof(Nation[elem[0]]) == "undefined"){
                        currentPlayer=elem[0] + "|SPLIT|?";
                    }
                }
                players.push(currentPlayer);
            // }
        }
    }
    let occursPlayers = countOccurrences(players);
    console.log(Flag);
    let index = 0;
    let tieCount = 0;
    let previousCount = 0;
    for(elem of occursPlayers){
        let [driver, nationality] = elem[0].split("|SPLIT|");
        
        const line = document.createElement("tr");

        if(["riolu", "Techno", "styx", "Thoringer"].includes(driver)){
            line.style = "color: #e06560; font-style: italic;";
        }

        const LBIndex = document.createElement("td");
        LBIndex.className = "LeaderboardIndex";

        if(elem[1] == previousCount){
            tieCount += 1;
            LBIndex.style = "color:rgba(255, 255, 255, 0.7);font-size: 23px;";
        }
        else{
            index += 1 + tieCount;
            tieCount = 0;
        }
        if(index < 5) {
            LBIndex.innerHTML = "<div class='FlagPic'><img src='../assets/medalLogos/"+index+".png' alt=''></div>";
        }
        else {
            LBIndex.innerHTML = index;
        }
        line.appendChild(LBIndex);

        previousCount = elem[1];

        const LBNation = document.createElement("td");
        LBNation.className = "LeaderboardNation";
        let drapeau = Flag[nationality];
        // if(["Mebe12", "Schmaniol"].includes(driver)){drapeau = "../assets/flags/gay.png";}
        // if(driver == "riolu"){drapeau = "../assets/flags/Cheat_Engine.png";}
        LBNation.innerHTML = "<div class='FlagPic'><img src='" + drapeau + "'></img></div>";
        line.appendChild(LBNation);

        const LBPlayer = document.createElement("td");
        LBPlayer.className = "LeaderboardPlayer";
        LBPlayer.innerHTML = driver;
        line.appendChild(LBPlayer);

        const LBCount = document.createElement("td");
        LBCount.className = "LeaderboardCount";
        LBCount.innerHTML = elem[1];
        line.appendChild(LBCount);

        playerTable.appendChild(line);
    }

    // Display country count
    let countryLB = document.getElementById("countryLB");
    let countryTable = countryLB.getElementsByClassName("tableLB")[0];

    let country = [];
    for(elem of mapWR){
        if(elem[6] != "game"){
            // if(elem[4] != "Cheated"){
                let currentPlayer = Nation[elem[0]];
                if(elem[8] != "a"){
                    let playerINFO = getDBID(playerDB, elem[8], game);
                    currentPlayer = playerINFO[1];
                }
                else{
                    if(typeof(currentPlayer) == "undefined"){
                        currentPlayer="?";
                    }
                }
                country.push(currentPlayer);
            // }
        }
    }

    let occursCountries =  countOccurrences(country);

    index = 0;
    tieCount = 0;
    previousCount = 0;
    for(elem of occursCountries){
        let [driver, nationality] = [Flag[elem[0]].split("/")[3].split(".")[0], elem[0]];
        
        const line = document.createElement("tr");
        
        const LBIndex = document.createElement("td");
        LBIndex.className = "LeaderboardIndex";

        if(elem[1] == previousCount){
            tieCount += 1;
            LBIndex.style = "color:rgba(255, 255, 255, 0.7);font-size: 23px;";
        }
        else{
            index += 1 + tieCount;
            tieCount = 0;
        }
        if(index < 5) {
            LBIndex.innerHTML = "<div class='FlagPic'><img src='../assets/medalLogos/"+index+".png' alt=''></div>";
        }
        else {
            LBIndex.innerHTML = index;
        }
        line.appendChild(LBIndex);
        previousCount = elem[1];

        const LBNation = document.createElement("td");
        LBNation.className = "LeaderboardNation";
        LBNation.innerHTML = "<div class='FlagPic'><img src='" + Flag[nationality] + "'></img></div>";
        line.appendChild(LBNation);

        const LBPlayer = document.createElement("td");
        LBPlayer.className = "LeaderboardPlayer";
        LBPlayer.innerHTML = driver;
        line.appendChild(LBPlayer);

        const LBCount = document.createElement("td");
        LBCount.className = "LeaderboardCount";
        LBCount.innerHTML = elem[1];
        line.appendChild(LBCount);

        countryTable.appendChild(line);
    }
}

function countOccurrences(players) {
    const occurrences = {};

    // Compter les occurrences de chaque joueur
    players.forEach(player => {
        occurrences[player] = (occurrences[player] || 0) + 1;
    });

    // Transformer l'objet en tableau et trier par ordre décroissant des occurrences
    return Object.entries(occurrences)
        .sort((a, b) => b[1] - a[1]);
}

getData();