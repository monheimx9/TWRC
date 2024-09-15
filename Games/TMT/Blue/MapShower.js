var result = "";
var FirstMap = 81;
var map = "";
var envi = "";

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

    result += '<div class="MapThumbnailBox" id="' + map + '" onclick="location.href=' + "'" + "../../../History/map.html?id=" + map  + "'" + ';" style="cursor: pointer;">';
    result += '<div class="ThumbnailHeader">';
    result += '<h3 class="ThumbnailMapName">#' + map + '</h3>';
    result += '</div>' // End of class: ThumbnailHeader
    result += '<img class="MapThumbnail" src="MapPics/' + map + '.jpg"></img>';
    result += '<div class="ThumbnailFooter">';
    result += '<h5 class="ThumbnailWrInfo">WR: <span class="Wr">XX:XX.XXX</span> - <img class="WrFlag" src="../../../assets/flags/question.png"><span class="WrHolder"> ________</span></h5>';
    result += '</div>'; // End of class: ThumbnailFooter
    result += '</div>'; // End of class: MapThumbnailBox


    if ((i) % 10 === 0) {
        result += '</div>'; // End of class: ChoiceBoxFlag

        result += '</div>'; // End of class: ChoiceBox
    }

}

document.write(result);