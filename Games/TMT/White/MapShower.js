var result = "";
var FirstMap = 1;
var map = "";
var envi = "";

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
    const range = (start, end) => {
        const length = end - start;
        return Array.from({ length }, (_, i) => start + i);
    }

    for(elem of myArray){
        if(range(FirstMap,FirstMap+40).includes(Number(elem[1]))){
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


    for(var i=FirstMap; i<40+FirstMap; i++){
        map = i.toString().padStart(3, '0');
        if(i<10+FirstMap){
            envi = "Canyon";
        }
        else if(i<20+FirstMap){
            envi = "Valley";
        }

        else if(i<30+FirstMap){
            envi = "Lagoon";
        }

        else {
            envi = "Stadium";
        }

        if ((i - 1) % 10 === 0) {
            result += '<div class="ChoiceBox">';

            result += '<div class="FlagHeader"><img src="MapPics/' + envi + '.png">';
            result += '<h1 class="FlagTitle">' + envi + '</h1><img src="MapPics/' + envi + '.png">';
            result += '</div>' // End of class: FlagHeader

            result += '<div class="ChoiceBoxFlag">';
        }

        let current_data;
        for(record of wrdata){
            if(record[1] === map){
                current_data = record;
            }
        }

        result += '<div class="MapThumbnailBox" id="' + map + '" onclick="location.href=' + "'" + "../../../History/map.html?id=" + map  + "'" + ';" style="cursor: pointer;">';
        result += '<div class="ThumbnailHeader">';
        result += '<h3 class="ThumbnailMapName">#' + map + '</h3>';
        result += '</div>' // End of class: ThumbnailHeader
        result += '<img class="MapThumbnail" src="MapPics/' + map + '.jpg"></img>';
        result += '<div class="ThumbnailFooter">';
        result += '<h5 class="ThumbnailWrInfo">WR: <span class="Wr">'+current_data[2]+'</span> - <img class="WrFlag" src="'+Flag[Nation[current_data[0]]]+'"><span class="WrHolder"> '+current_data[0]+'</span></h5>';
        result += '</div>'; // End of class: ThumbnailFooter
        result += '</div>'; // End of class: MapThumbnailBox


        if ((i) % 10 === 0) {
            result += '</div>'; // End of class: ChoiceBoxFlag

            result += '</div>'; // End of class: ChoiceBox
        }

    }


    // Send the result to the previously created 'TOUT' div
    // Forced to do that because a document.write() will ommit css
    tout.innerHTML = result;
 
}).catch(function (error){
    // console.log(error);
});