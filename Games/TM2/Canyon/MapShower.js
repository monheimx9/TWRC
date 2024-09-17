var result = "";
var letter = "";
var map = "";
const envi = "Canyon"; //Select the envi

document.write("<div id='TOUT'></div>");
tout = document.getElementById("TOUT");

Promise.all([
    fetch('https://raw.githubusercontent.com/Loupphok/TWRC/refs/heads/main/data/WRDb.csv'),
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
        Flag[elem[0]] = "../../../assets/flags/" + elem[1];
    }

    ///////////////////
    // Showing the data
    ///////////////////

    for(pre of [["A", "White"],["B", "Green"],["C", "Blue"],["D", "Red"]]) {
        // Select the letter of each maps
        letter = pre[0];

        // Setup of the header of each flag
        result += '<div class="ChoiceBox">';
    
        result += '<div class="FlagHeader"><img src="MapPics/Flag' + letter + '.png">';
        result += '<h1 class="FlagTitle">' + pre[1] + " difficulty" + '</h1><img src="MapPics/Flag' + letter + '.png">';
        result += '</div>' // End of class: FlagHeader
    
        result += '<div class="ChoiceBoxFlag">';
    
        for(var i=0; i<15; i++){
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
            result += '<div class="MapThumbnailBox" id="' + map + '" onclick="location.href=' + "'" + "../../../History/map.html?id=" + map + "_-_" + envi + "'" + ';" style="cursor: pointer;">';
            result += '<div class="ThumbnailHeader">';
            result += '<h3 class="ThumbnailMapName">' + map + '</h3>';
            result += '</div>' // End of class: ThumbnailHeader
            result += '<img class="MapThumbnail" src="MapPics/TM2_' + envi + '_' + map + '.jpg"></img>';
            result += '<div class="ThumbnailFooter">';
            result += '<h5 class="ThumbnailWrInfo">WR: <span class="Wr">'+current_data[2]+'</span> - <img class="WrFlag" src="'+Flag[Nation[current_data[0]]]+'"><span class="WrHolder"> '+current_data[0]+'</span></h5>';
            result += '</div>'; // End of class: ThumbnailFooter
            result += '</div>'; // End of class: MapThumbnailBox
        }
    
        result += '</div>'; // End of class: ChoiceBoxFlag
    
        result += '</div>'; // End of class: ChoiceBox
    
    }
    
    // E maps
    letter = "E";

    // Setup of the header of each flag
    result += '<div class="ChoiceBox">';
    
    result += '<div class="FlagHeader"><img src="MapPics/Flag' + letter + '.png">';
    result += '<h1 class="FlagTitle">' + "Black difficulty" + '</h1><img src="MapPics/Flag' + letter + '.png">';
    result += '</div>' // End of class: FlagHeader
    
    result += '<div class="ChoiceBoxFlag">';
    
    for(var i=0; i<5; i++){
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
        result += '<div class="MapThumbnailBox" id="' + map + '" onclick="location.href=' + "'" + "../../../History/map.html?id=" + map + "_-_" + envi + "'" + ';" style="cursor: pointer;">';
        result += '<div class="ThumbnailHeader">';
        result += '<h3 class="ThumbnailMapName">' + map + '</h3>';
        result += '</div>' // End of class: ThumbnailHeader
        result += '<img class="MapThumbnail" src="MapPics/TM2_' + envi + '_' + map + '.jpg"></img>';
        result += '<div class="ThumbnailFooter">';
        result += '<h5 class="ThumbnailWrInfo">WR: <span class="Wr">'+current_data[2]+'</span> - <img class="WrFlag" src="'+Flag[Nation[current_data[0]]]+'"><span class="WrHolder"> '+current_data[0]+'</span></h5>';
        result += '</div>'; // End of class: ThumbnailFooter
        result += '</div>'; // End of class: MapThumbnailBox
    }
    
    result += '</div>'; // End of class: ChoiceBoxFlag
    
    result += '</div>'; // End of class: ChoiceBox

    // Send the result to the previously created 'TOUT' div
    // Forced to do that because a document.write() will ommit css
    tout.innerHTML = result;
 
}).catch(function (error){
    console.log(error);
});