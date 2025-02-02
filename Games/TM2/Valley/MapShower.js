var result = "";
var letter = "";
var map = "";
const envi = "Valley"; //Select the envi

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
    
    let myArray = csvData;
    var finalarray = [];

    // Only keep the relevant data into the database
    for(elem of myArray){
        if(elem[1].split(" - ")[1] === envi){
            finalarray.push(elem);
        }
    }

    // Create a database with all wrs
    let wrdata = [];

    for(elem of finalarray){
        if(elem[7] === "1"){
            wrdata.push(elem);
        }
    }

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
        Flag[elem[0]] = "../../../assets/flags/" + elem[1];
    }

    showInfo(wrdata, Nation, Flag); // Once its parsed, put the data into the table
}

function showInfo(wrdata, Nation, Flag){
    for(pre of [["A", "White"],["B", "Green"],["C", "Blue"],["D", "Red"],["E", "Black"]]) {
        // Select the letter of each maps
        letter = pre[0];

        // Setup of the header of each flag
        const ChoiceBox = document.createElement("div");
        ChoiceBox.className = "ChoiceBox";

        const FlagHeader = document.createElement("div");
        FlagHeader.className = "FlagHeader";
        let drapeau = "<img src='MapPics/Flag" + letter + ".png'>";
        let diff = "<h1 class='FlagTitle'>" + pre[1] + " difficulty</h1>";
        FlagHeader.innerHTML = drapeau + diff + drapeau;
        ChoiceBox.appendChild(FlagHeader);

        TOUT.appendChild(ChoiceBox);
    
        const ChoiceBoxFlag = document.createElement("div");
        ChoiceBoxFlag.className = "ChoiceBoxFlag";

        ChoiceBox.appendChild(ChoiceBoxFlag);
    
        let nbMaps = 15;
        if(letter == "E"){nbMaps = 5};
        for(var i=0; i<nbMaps; i++){
            // Finding the only relevent record
            map = letter + (i+1).toString().padStart(2, '0');
            map_data = map + " - " + envi;
            let current_data;
            for(record of wrdata){
                if(record[1] === map_data){
                    current_data = record;
                }
            }

            // Setup of each individual map boxes
            var MapThumbnailBox = document.createElement("div");
            MapThumbnailBox.className = "MapThumbnailBox";
            MapThumbnailBox.id = map;
            MapThumbnailBox.style = "cursor: pointer;";
            MapThumbnailBox.onclick = function(){
                window.location.href = "../../../History/map.html?id=" + this.id + "_-_" + envi;
            };

            MapThumbnailBox.innerHTML = '<div class="ThumbnailHeader"><h3 class="ThumbnailMapName">' + map + '</h3></div>';
            
            var MapThumbnail = document.createElement("img");
            MapThumbnail.className = "MapThumbnail";
            MapThumbnail.src = "MapPics/TM2_" + envi + "_" + map + ".jpg";

            MapThumbnailBox.appendChild(MapThumbnail);

            var ThumbnailFooter = document.createElement("div");
            ThumbnailFooter.className = "ThumbnailFooter";
            
            var ThumbnailWrInfo = document.createElement("h5");
            ThumbnailWrInfo.className = "ThumbnailWrInfo";
            ThumbnailWrInfo.innerHTML = 'WR: <span class="Wr">'+current_data[2]+'</span> - '; /* "WR: " + the WR time */
            ThumbnailWrInfo.innerHTML += '<img class="WrFlag" src="' + Flag[Nation[current_data[0]]] + '">'; /* Adding the flag */
            ThumbnailWrInfo.innerHTML += '<span class="WrHolder"> '+current_data[0]+'</span>'; /* Adding the wr holder */
            ThumbnailFooter.appendChild(ThumbnailWrInfo);

            MapThumbnailBox.appendChild(ThumbnailFooter);

            ChoiceBoxFlag.appendChild(MapThumbnailBox);
        }
    }
}

const Corps = document.getElementsByClassName("Corps")[0];

const TOUT = document.createElement("div");
TOUT.id = "TOUT";
Corps.appendChild(TOUT);

getData();
console.log("test");