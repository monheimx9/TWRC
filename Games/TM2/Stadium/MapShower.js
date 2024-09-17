var result = "";
var letter = "";
var map = "";
const envi = "Stadium"; //Select the envi

document.write("<div id='TOUT'></div>");
tout = document.getElementById("TOUT");

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
    let myArray = csvData;
    console.log(myArray);


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

    // console.log(myArray);
    // console.log(Nation);
    // console.log(Flag);

    for(pre of [["A", "White"],["B", "Green"],["C", "Blue"],["D", "Red"]]) {
        letter = pre[0];
        result += '<div class="ChoiceBox">';
    
        result += '<div class="FlagHeader"><img src="MapPics/Flag' + letter + '.png">';
        result += '<h1 class="FlagTitle">' + pre[1] + " difficulty" + '</h1><img src="MapPics/Flag' + letter + '.png">';
        result += '</div>' // End of class: FlagHeader
    
        result += '<div class="ChoiceBoxFlag">';
    
        for(var i=0; i<15; i++){
            map = letter + (i+1).toString().padStart(2, '0');
            // map_data = map + " - " + envi;
            // for(record of myArray){
            //     console.log(record[1]);
            //     if(record[1] === map_data){
            //         console.log(record);
            //     }
            // }

            result += '<div class="MapThumbnailBox" id="' + map + '" onclick="location.href=' + "'" + "../../../History/map.html?id=" + map + "_-_" + envi + "'" + ';" style="cursor: pointer;">';
            result += '<div class="ThumbnailHeader">';
            result += '<h3 class="ThumbnailMapName">' + map + '</h3>';
            result += '</div>' // End of class: ThumbnailHeader
            result += '<img class="MapThumbnail" src="MapPics/TM2_' + envi + '_' + map + '.jpg"></img>';
            result += '<div class="ThumbnailFooter">';
            result += '<h5 class="ThumbnailWrInfo">WR: <span class="Wr">XX:XX.XXX</span> - <img class="WrFlag" src="../../../assets/flags/question.png"><span class="WrHolder"> ________</span></h5>';
            result += '</div>'; // End of class: ThumbnailFooter
            result += '</div>'; // End of class: MapThumbnailBox
        }
    
        result += '</div>'; // End of class: ChoiceBoxFlag
    
        result += '</div>'; // End of class: ChoiceBox
    
    }
    
    // E maps
    letter = "E";
    result += '<div class="ChoiceBox">';
    
    result += '<div class="FlagHeader"><img src="MapPics/Flag' + letter + '.png">';
    result += '<h1 class="FlagTitle">' + "Black difficulty" + '</h1><img src="MapPics/Flag' + letter + '.png">';
    result += '</div>' // End of class: FlagHeader
    
    result += '<div class="ChoiceBoxFlag">';
    
    for(var i=0; i<5; i++){
        map = letter + (i+1).toString().padStart(2, '0');
        result += '<div class="MapThumbnailBox" id="' + map + '" onclick="location.href=' + "'" + "../../../History/map.html?id=" + map + "_-_" + envi + "'" + ';" style="cursor: pointer;">';
        result += '<div class="ThumbnailHeader">';
        result += '<h3 class="ThumbnailMapName">' + map + '</h3>';
        result += '</div>' // End of class: ThumbnailHeader
        result += '<img class="MapThumbnail" src="MapPics/TM2_' + envi + '_' + map + '.jpg"></img>';
        result += '<div class="ThumbnailFooter">';
        result += '<h5 class="ThumbnailWrInfo">WR: <span class="Wr">X:XX.XXX</span> - <span class="WrHolder">________</span></h5>';
        result += '</div>'; // End of class: ThumbnailFooter
        result += '</div>'; // End of class: MapThumbnailBox
    }
    
    result += '</div>'; // End of class: ChoiceBoxFlag
    
    result += '</div>'; // End of class: ChoiceBox

    tout.innerHTML = result;
 
}).catch(function (error){
    console.log(error);
});