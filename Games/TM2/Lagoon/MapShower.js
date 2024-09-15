var result = "";
var letter = "";
var map = "";
const envi = "Lagoon"; //Select the envi

for(pre of [["A", "White"],["B", "Green"],["C", "Blue"],["D", "Red"]]) {
    letter = pre[0];
    result += '<div class="ChoiceBox">';

    result += '<div class="FlagHeader"><img src="MapPics/Flag' + letter + '.png">';
    result += '<h1 class="FlagTitle">' + pre[1] + " difficulty" + '</h1><img src="MapPics/Flag' + letter + '.png">';
    result += '</div>' // End of class: FlagHeader

    result += '<div class="ChoiceBoxFlag">';

    for(var i=0; i<15; i++){
        map = letter + (i+1).toString().padStart(2, '0');
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

console.log("test")
document.write(result);