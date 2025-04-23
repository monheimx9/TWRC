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
    csvData = csvData.slice(1, csvData.length+1);

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

function compilDate(dateStr) {
    let [day, month, year] = dateStr.split("/");
    
    if (year === "????") return null; // Cas où l'année est inconnue
    if (month === "??") month = "01"; // Par défaut, janvier
    if (day === "??") day = "01"; // Par défaut, premier jour du mois
    
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
}

function sortByDate(listOfLists) {
    return listOfLists.sort((a, b) => {
        let dateA = compilDate(a[3]);
        let dateB = compilDate(b[3]);
        
        if (dateA === null && dateB === null) return 0; // Les deux sont inconnues
        if (dateA === null) return 1; // dateA inconnue va après
        if (dateB === null) return -1; // dateB inconnue va après
        
        return dateB.getTime() - dateA.getTime();
    });
}

function getOverallStats(data){
    // Initialisation
    const environnements = new Set();
    const jeux = new Set();
    const nomsPistes = new Set();
    const compteurPistes = {};
    const compteurJeux = {};
    const compteurEnvis = {};
    let cheatedCount = 0;

    // Traitement
    data.forEach(entry => {
    const [ , nomPiste, , , infos, environnement, jeu ] = entry;

    environnements.add(environnement);
    jeux.add(jeu);
    nomsPistes.add(nomPiste);

    compteurPistes[nomPiste] = (compteurPistes[nomPiste] || 0) + 1;
    compteurJeux[jeu] = (compteurJeux[jeu] || 0) + 1;
    compteurEnvis[environnement] = (compteurEnvis[environnement] || 0) + 1;

    if (infos === "Cheated") {
        cheatedCount++;
    }
    });

    // Recherche des pistes les plus fréquentes
    const maxOccurrences = Math.max(...Object.values(compteurPistes));
    const pistesPlusFrequentes = Object.entries(compteurPistes)
    .filter(([_, count]) => count === maxOccurrences)
    .map(([piste]) => piste);

    // Recherche des jeux les plus fréquentes
    const maxOccurrences_jeux = Math.max(...Object.values(compteurJeux));
    const pistesPlusFrequentes_jeux = Object.entries(compteurJeux)
    .filter(([_, count]) => count === maxOccurrences_jeux)
    .map(([jeux]) => jeux);

    // Recherche des envis les plus fréquentes
    const maxOccurrences_envi = Math.max(...Object.values(compteurEnvis));
    const pistesPlusFrequentes_envi = Object.entries(compteurEnvis)
    .filter(([_, count]) => count === maxOccurrences_envi)
    .map(([envi]) => envi);

    // Résultats
    const listeEnvironnements = Array.from(environnements);
    const listeJeux = Array.from(jeux);
    const listeNomsPistes = nomsPistes;
    const pisteFrequentInfo = [pistesPlusFrequentes, maxOccurrences];
    const nombreCheated = cheatedCount;
    const jeuxFrequentInfo = [pistesPlusFrequentes_jeux, maxOccurrences_jeux];
    const envisFrequentInfo = [pistesPlusFrequentes_envi, maxOccurrences_envi];

    // Affichage (ou utilisations futures)
    console.log("Environnements:", listeEnvironnements);
    console.log("Jeux:", listeJeux);
    console.log("Noms des pistes:", listeNomsPistes);
    console.log("Piste(s) la/les plus fréquente(s) + nombre d'occurrences:", pisteFrequentInfo);
    console.log("Nombre de 'Cheated':", nombreCheated);
    console.log("Jeu(x) la/les plus fréquente(s) + nombre d'occurrences:", jeuxFrequentInfo);
    console.log("Envi(s) la/les plus fréquente(s) + nombre d'occurrences:", envisFrequentInfo);

    return [listeEnvironnements, listeJeux, Array.from(listeNomsPistes), pisteFrequentInfo, nombreCheated, jeuxFrequentInfo, envisFrequentInfo];
}

function showInfo(mapWR, Nation, Flag, playerDB){
    const params = new URLSearchParams(window.location.search); // Get the parameters from the URL
    var selectedPlayer = params.get('id').replace(/_/g, ' '); // Name of the player
    if(typeof(selectedPlayer) == "undefined"){selectedPlayer = "hylis"}
    lowerSelectedPlayer = selectedPlayer.toLowerCase();
    let tableID;
    let playerTableInfo;

    for(elem of playerDB){
        if(elem["Display_Name"].toLowerCase() == lowerSelectedPlayer){
            playerTableInfo = elem;
            tableID = elem["TMNF_Id"];
        }
    }

    let playerWrList = [];
    for(wr of mapWR){
        if(wr[8] == "a"){
            if(wr[0].toLowerCase() == lowerSelectedPlayer){
                playerWrList.push(wr);
            }
        }
        else{
            if(tableID == wr[8]){
                playerINFO = 
                playerWrList.push(wr);
            }
        }
    }
    playerWrList = sortByDate(playerWrList);

    // Info side
    const infoHeader = document.getElementById("infoHeader");
    console.log(selectedPlayer)
    drapeau = Flag[Nation[selectedPlayer]];
    if(typeof(drapeau)==="undefined"){
        drapeau = Flag[playerTableInfo["Country"]];
        if(typeof(drapeau)==="undefined"){
            drapeau = "../assets/flags/question.png";
        }
    }
    let playerFlag = "<img src='../" + drapeau + "'>";
    infoHeader.innerHTML = playerFlag + selectedPlayer;
    
    // Big table
    const tableLB = document.getElementsByClassName("tableLB")[0];

    for(elem of playerWrList){
        const line = document.createElement("tr");
        line.className = "lineLB";
        // Modify the order of the wrs

        // Map
        const mapInfo = document.createElement("td");
        mapInfo.className = "mapInfo";
        let mapGame = "<span class='mapGameSpan'>" + elem[6] + "</span>";
        let mapEnvi = "<img class='enviTable' src='../../assets/enviLogos/" + elem[5] + ".png'>";
        let mapName = getCorrectMapName(elem[1], elem[6]);
        mapInfo.innerHTML = mapEnvi + mapGame + mapName;
        line.appendChild(mapInfo);

        // Time
        const mapTime = document.createElement("td");
        mapTime.className = "mapTime";
        mapTime.innerHTML = elem[2];
        line.appendChild(mapTime);

        // Date
        const mapDate = document.createElement("td");
        mapDate.className = "mapDate";
        mapDate.innerHTML = elem[3];
        line.appendChild(mapDate);

        // Info
        const mapDesc = document.createElement("td");
        mapDesc.className = "mapDesc";
        let mapDescDisplay = elem[4];
        if(elem[4] == "."){mapDescDisplay = ""}
        mapDesc.innerHTML = mapDescDisplay;
        line.appendChild(mapDesc);

        tableLB.appendChild(line);
    }

    console.log(playerWrList);

    let overallStats = getOverallStats(playerWrList); /////////////////////////////

    /* gamesInfo */
    const gamesInfo = document.getElementById("gamesInfo");
    let gamesInfo_setup = "";
    for(elem of overallStats[1]){gamesInfo_setup += "<span class='mapGameSpan'>" + elem + "</span>" + "/ ";}
    gamesInfo.innerHTML = gamesInfo_setup.slice(0, -2);

    /* envisInfo */
    const envisInfo = document.getElementById("envisInfo");
    let envisInfo_setup = "";
    for(elem of overallStats[0]){envisInfo_setup += "<img src='../../assets/enviLogos/" + elem + ".png' style='height: 22px; padding-top: 5px;'>";}
    envisInfo.innerHTML = envisInfo_setup;
    
    /* wrCountInfo */
    const wrCountInfo = document.getElementById("wrCountInfo");
    wrCountInfo.innerHTML = playerWrList.length + " WRs";

    /* wrCountCurrentInfo */
    const wrCountCurrentInfo = document.getElementById("wrCountCurrentInfo");

    /* uniqueMapCountInfo */
    const uniqueMapCountInfo = document.getElementById("uniqueMapCountInfo");
    uniqueMapCountInfo.innerHTML = overallStats[2].length + " Maps";

    /* prolificMapInfo */
    const prolificMapInfo = document.getElementById("prolificMapInfo");
    let prolificMapInfo_setup = "";
    for(elem of overallStats[3][0]){prolificMapInfo_setup += elem + " / ";}
    prolificMapInfo.innerHTML = prolificMapInfo_setup.slice(0, -3) + " · " + overallStats[3][1] + " WRs";

    /* prolificGameInfo */
    const prolificGameInfo = document.getElementById("prolificGameInfo");
    let prolificGameInfo_setup = "";
    for(elem of overallStats[5][0]){prolificGameInfo_setup += "<span class='mapGameSpan'>" + elem + "</span>/ ";}
    prolificGameInfo.innerHTML = prolificGameInfo_setup.slice(0, -2) + " · " + overallStats[5][1] + " WRs";

    /* prolificEnviInfo */
    const prolificEnviInfo = document.getElementById("prolificEnviInfo");
    let prolificEnviInfo_setup = "";
    for(elem of overallStats[6][0]){prolificEnviInfo_setup += "<img src='../../assets/enviLogos/" + elem + ".png' style='height: 23px; vertical-align: bottom;'> / ";}
    prolificEnviInfo.innerHTML = prolificEnviInfo_setup.slice(0, -3) + " · " + overallStats[6][1] + " WRs";

    /* longestWrInfo */
    const longestWrInfo = document.getElementById("longestWrInfo");

    /* firstWrInfo */
    const firstWrInfo = document.getElementById("firstWrInfo");
    let firstWrInfo_setup;
    for(let i = 1; i < playerWrList.length; i++){
        let testdate = playerWrList[playerWrList.length - i];
        if(testdate[3] != "??/??/????"){firstWrInfo_setup = testdate; break;}
    }
    firstWrInfo.innerHTML = firstWrInfo_setup[1] + " · " + firstWrInfo_setup[2] + " · " + firstWrInfo_setup[3];

    /* latestWrInfo */
    const latestWrInfo = document.getElementById("latestWrInfo");
    latestWrInfo.innerHTML = playerWrList[0][1] + " · " + playerWrList[0][2] + " · " + playerWrList[0][3];
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

function getCorrectMapName(map, game){
    switch(game){
        case "TMNF":
            // return map;
        case "TM2":
            return map.slice(0,3);
        case "TMT":
            return "#" + map;
    }
}

getData();