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
    fetch('https://raw.githubusercontent.com/Loupphok/TWRC/main/data/Nation.csv')
]).then(function (responses) {
    return Promise.all(responses.map(function(response){
        return response.text();
    }))
}).then(function (alldata){
    data = alldata[0];
    console.log(alldata[1]);
    // Split the file content by newlines to get each row
    const rows = data.split('\n').filter(row => row.trim().length > 0);
    
    // Map through each row and split by comma to get individual columns
    csvData = rows.map(row => row.split(';').filter(cell => cell.trim().length > 0));
    let myArray = csvData;
    // Get both the Nation and Flag dictionnaries
    var Nation = getNationality();
    var Flag = getFlag();
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

// ---
// --- Introduction of the data inside variables
// ---

// Get the nationality of each players
function getNationality() {
    return {
        "Guillaume" : "?",
        "J & B" : "?",
        "__" : "?",
        "Tha Base" : "?",
        "Smashy" : "?",
        "Wilson" : "?",
        "fo'camo" : "?",
        "TnT" : "?",
        "Dragon" : "?",
        "Tatu" : "?",
        "Totor" : "?",
        "Jadooky" : "?",
        "cuzynot" : "?",
        "SzNaJdeR" : "?",
        "Mad.dox" : "?",
        "Wouter" : "?",
        "Guillaume41" : "?",
        "Beliskner999" : "?",
        "lumatom" : "?",
        "YxalagOiram" : "?",
        "Alexony" : "?",
        "CretinusMania" : "?",
        "trace_8" : "?",
        "Alepede" : "?",
        "Globo" : "?",
        "BoktorBanane" : "?",
        "Firop" : "?",
        "ColdM4mba" : "?",
        "Pillday" : "?",
        "Melkey" : "?",
        "Qfireball" : "?",
        "milchshakee" : "?",
        "Nize" : "?",
        "Pascow" : "?",
        "Ludo" : "?",
        "Greenius" : "?",
        "Dean091" : "?",
        "mctavish01" : "?",
        "Loko" : "?",
        "DrBob" : "?",
        "Shezou" : "?",
        "MnstrsOmega" : "?",
        "Harryvanman" : "?",
        "ShineX" : "?",
        "katerbarg" : "?",
        "C1R10N" : "?",
        "Looz" : "?",
        "Robert" : "?",
        "Maverick-V8" : "?",
        "Sape27" : "?",
        "Hemerald" : "?",
        "RACETA" : "isr",
        "Dekz" : "isr",
        "Kripke" : "ger",
        "riolu" : "ger",
        "Blizz" : "ger",
        "racehans" : "ger",
        "Boerta" : "ger",
        "Netsky" : "ger",
        "the.Park" : "ger",
        "eprotizuu" : "ger",
        "Arcanos" : "ger",
        "Alecz" : "ger",
        "Beat" : "ger",
        "Spunki" : "ger",
        "nexx." : "ger",
        "DexteR" : "ger",
        "Maciey" : "ger",
        "Schmaniol" : "ger",
        "Passi" : "ger",
        "Hanni0" : "ger",
        "Philkos" : "ger",
        "Down" : "ger",
        "Peyman" : "ger",
        "Vogter" : "ger",
        "Tomsen" : "ger",
        "Detinu" : "ger",
        "Mystixor" : "ger",
        "Night" : "ger",
        "7777Alex7777" : "ger",
        "Thoringer" : "ger",
        "WhiteShadow" : "ger",
        "HQCookie" : "ger",
        "Techno" : "ger",
        "racerlight" : "ger",
        "Piotrunio" : "ger",
        "Taxon" : "ger",
        "styx" : "ger",
        "Rxyveax" : "ger",
        "Coodyyy" : "ger",
        "Azora" : "ger",
        "Anzone" : "ger",
        "Benitabor" : "ger",
        "Marius89" : "ger",
        "hec_ker" : "ger",
        "maysen" : "ger",
        "xxAlex765xx" : "ger",
        "DarkBringer" : "ger",
        "Pentacosmic" : "ger",
        "Speedy0407" : "ger",
        "oNion" : "ger",
        "TekkForce" : "ger",
        "Shock" : "ger",
        "Sphinx" : "ger",
        "Dellecto" : "ger",
        "GMAlf" : "ger",
        "Coradon24" : "ger",
        "Lars" : "ger",
        "Dused" : "ger",
        "Hivee" : "ger",
        "Nino" : "ger",
        "NJin" : "ger",
        "Derter" : "ger",
        "Dog" : "ger",
        "insane" : "ger",
        "Santus" : "ger",
        "Massa" : "ger",
        "oNio" : "ger",
        "bbAmerang" : "ger",
        "meson" : "ger",
        "iEnrage" : "ger",
        "Ploeder" : "ger",
        "hal.ko.TimaE" : "ger",
        "Vyrisus" : "ger",
        "Cravellas" : "ger",
        "Scholly1896" : "ger",
        "gtahabinet" : "ger",
        "Rimba92" : "ger",
        "Loupphok" : "fra",
        "MiThyX" : "fra",
        "Flechetas" : "fra",
        "ZedroX" : "fra",
        "Pieton" : "fra",
        "Camion" : "fra",
        "Aziix" : "fra",
        "LAMArtifice" : "fra",
        "Labaffue" : "fra",
        "Vulnerra" : "fra",
        "Sapi" : "fra",
        "Fire!" : "fra",
        "instable" : "fra",
        "KevinStrike" : "fra",
        "YodarK" : "fra",
        "WiiDii" : "fra",
        "Yosh" : "fra",
        "PetitPredator" : "fra",
        "Nawk" : "fra",
        "Samuel" : "fra",
        "Katic" : "fra",
        "hugo220" : "fra",
        "Forsaken" : "fra",
        "Wiloux" : "fra",
        "Gwen" : "fra",
        "BossWanted" : "fra",
        "trabadia" : "fra",
        "Panda" : "fra",
        "Bicougnon" : "fra",
        "Brandom" : "fra",
        "Switch" : "fra",
        "Ryxsar" : "fra",
        "ringoa" : "fra",
        "Cocho" : "fra",
        "Marco" : "fra",
        "Kaio" : "fra",
        "Symbiose" : "fra",
        "Space" : "fra",
        "Quentin43" : "fra",
        "Lzfix" : "fra",
        "Nemesis" : "fra",
        "Samerlifofwer" : "fra",
        "Gyrule" : "fra",
        "ender" : "fra",
        "Eyohna" : "fra",
        "fanakuri" : "fra",
        "ZyGoTo" : "fra",
        "Nath" : "fra",
        "hyp" : "fra",
        "Crinatiraxx" : "fra",
        "NeYo-8826" : "fra",
        "RS Tornado" : "fra",
        "Sky" : "fra",
        "NazgulAars" : "fra",
        "Sypher" : "fra",
        "kaka" : "fra",
        "Pks" : "fra",
        "Lanz" : "fra",
        "Guileboom" : "fra",
        "Knt-1" : "fra",
        "trckmn" : "fra",
        "Neko" : "fra",
        "Phenomega" : "fra",
        "Scorm" : "fra",
        "Lookid" : "fra",
        "btonios" : "fra",
        "Alyen" : "fra",
        "Guerro323" : "fra",
        "TheMonsterC2" : "fra",
        "AQueCCbob" : "fra",
        "tayck" : "fra",
        "FunnyBear" : "fra",
        "Kazey77" : "fra",
        "MrLag" : "fra",
        "Canon" : "fra",
        "Shamzie" : "fra",
        "Gunther" : "fra",
        "Lektro89" : "fra",
        "Purification" : "fra",
        "Nahoy" : "fra",
        "SiXav78" : "fra",
        "GarmouZze" : "fra",
        "Farcry69" : "fra",
        "Bluts" : "bel",
        "Scrapie" : "bel",
        "Ragha" : "bel",
        "Laurens" : "bel",
        "Flave" : "bel",
        "Suptim4L" : "bel",
        "Arcade" : "bel",
        "MGM" : "bel",
        "Session005" : "bel",
        "Demon" : "nl",
        "Trinity" : "nl",
        "Pinda" : "nl",
        "Spam" : "nl",
        "Cloud" : "nl",
        "Joepie" : "nl",
        "Schimmy" : "nl",
        "juvo" : "nl",
        "AM98" : "nl",
        "Grudge" : "nl",
        "Zooz" : "nl",
        "Koenz" : "nl",
        "Wag" : "nl",
        "TimonBoaz" : "nl",
        "Bill" : "nl",
        "RedExtra" : "nl",
        "Zycos" : "nl",
        "Astronautj" : "nl",
        "RotakeR" : "pol",
        "Doc_Me4ik" : "pol",
        "Danio" : "pol",
        "frvr" : "pol",
        "Savier" : "pol",
        "Frev" : "pol",
        "fliks" : "pol",
        "XoN" : "pol",
        "GravelGuy" : "pol",
        "mime" : "pol",
        "Kulisa" : "pol",
        "Mnichu" : "pol",
        "wortex" : "pol",
        "Plastorex" : "pol",
        "KarasT7" : "pol",
        "KarjeN" : "swe",
        "Pigge" : "swe",
        "Keby" : "swe",
        "Byfjunarn" : "swe",
        "Advision" : "swe",
        "Gosaft" : "swe",
        "frostBeule" : "swe",
        "Lokring" : "swe",
        "DeathRow" : "swe",
        "KlockreN" : "swe",
        "Skuggako" : "swe",
        "CarlJr" : "can",
        "Wally" : "can",
        "Knetogs" : "can",
        "Karhu" : "fin",
        "ClearVision" : "fin",
        "DanikB" : "cze",
        "Ancaqar" : "cze",
        "Shock77" : "cze",
        "Flyer" : "cze",
        "Synaptic" : "cze",
        "Kappa" : "cze",
        "rez" : "cze",
        "Wolfii" : "cze",
        "BigBang1112" : "cze",
        "Ondra" : "cze",
        "Edgekiwi" : "cze",
        "Richie" : "cze",
        "Rollin" : "aut",
        "Phip" : "aut",
        "Luffy" : "aut",
        "Kazuma" : "aut",
        "faqez" : "aut",
        "7Alvin" : "sui",
        "Affi" : "sui",
        "Coscos" : "sui",
        "Reyger" : "sui",
        "Loic" : "sui",
        "lacsyl" : "sui",
        "BGHM" : "sui",
        "L94" : "sui",
        "Deluxe699" : "sui",
        "Hakanai" : "sui",
        "masterkey" : "sui",
        "Galax39" : "sui",
        "JaV" : "nzd",
        "animruler2" : "nzd",
        "mt17" : "usa",
        "Nixotica" : "usa",
        "edk" : "usa",
        "Quasar" : "usa",
        "ydooWoody" : "usa",
        "wormk22" : "usa",
        "erikmania" : "usa",
        "Solidtrees" : "usa",
        "Dark_Abyssii" : "usa",
        "NixGames" : "usa",
        "Slimpikcet" : "usa",
        "Lumby" : "usa",
        "irtri" : "usa",
        "KAYS" : "usa",
        "Tween" : "slk",
        "n0body" : "uk",
        "LeoTM2" : "uk",
        "Pac" : "uk",
        "Artemis" : "uk",
        "Ricky" : "uk",
        "Speed" : "uk",
        "Howell" : "uk",
        "Mazzargh" : "uk",
        "Scotsman" : "uk",
        "Hefest" : "cro",
        "RKO 90" : "ita",
        "AleTheLegend" : "ita",
        "CircuitFerrari" : "ita",
        "mart1gann" : "por",
        "dragonpntm" : "por",
        "Zypher" : "por",
        "futurecat" : "por",
        "Jaja" : "mar",
        "Hectrox" : "esp",
        "JaviFlyer" : "esp",
        "Joltysonic" : "esp",
        "Kilarath" : "esp",
        "asier" : "esp",
        "DRIVER6479" : "esp",
        "Apoq" : "nor",
        "Phoebe" : "nor",
        "awba1" : "nor",
        "Levon" : "nor",
        "Yogosun" : "nor",
        "DarkLink94" : "nor",
        "Hyllez" : "nor",
        "Danneboy" : "nor",
        "Mubazen" : "nor",
        "Erizel" : "nor",
        "Serbi" : "den",
        "Madzen" : "den",
        "ivan" : "den",
        "Dunste" : "den",
        "Mudda" : "aus",
        "Mebe12" : "aus",
        "Jerome" : "aus",
        "mattjimjett" : "aus",
        "bcp" : "aus",
        "vrbica" : "slv",
        "marios2000" : "gre",
        "eddyey" : "kaz",
        "Pavel" : "blr",
        "Warrenz79" : "irl",
        "Demedi" : "hun",
        "Rosiante-S" : "jpn",
        "Bakatonorz" : "jpn",
        "Yuki" : "jpn",
        "acidmist" : "jpn",
        "Alewka" : "rus",
        "introC" : "rus",
        "Stik" : "rus",
        "Dark_QFX" : "rus",
        "Jjyyay" : "tga",
        "icenine" : "bra"
    }
}

// Get the flag image link of each nations
function getFlag() {
    return {
        "?":"assets/flags/question.png",
        "isr":"assets/flags/israel.png",
        "ger":"assets/flags/allemagne.png",
        "fra":"assets/flags/france.png",
        "bel":"assets/flags/la-belgique.png",
        "nl":"assets/flags/pays-bas.png",
        "pol":"assets/flags/pologne.png",
        "swe":"assets/flags/suede.png",
        "can":"assets/flags/canada.png",
        "fin":"assets/flags/finlande.png",
        "cze":"assets/flags/republique-tcheque.png",
        "aut":"assets/flags/lautriche.png",
        "sui":"assets/flags/suisse.png",
        "nzd":"assets/flags/nouvelle-zelande.png",
        "usa":"assets/flags/etats-unis.png",
        "slk":"assets/flags/slovaquie.png",
        "uk":"assets/flags/royaume-uni.png",
        "cro":"assets/flags/croatie.png",
        "ita":"assets/flags/italy.png",
        "por":"assets/flags/le-portugal.png",
        "mar":"assets/flags/maroc.png",
        "esp":"assets/flags/espagne.png",
        "nor":"assets/flags/norvege.png",
        "den":"assets/flags/danemark.png",
        "aus":"assets/flags/australie.png",
        "slv":"assets/flags/slovenie.png",
        "gre":"assets/flags/grece.png",
        "kaz":"assets/flags/kazakhstan.png",
        "blr":"assets/flags/bielorussie.png",
        "irl":"assets/flags/irlande.png",
        "hun":"assets/flags/hongrie.png",
        "jpn":"assets/flags/japon.png",
        "rus":"assets/flags/russie.png",
        "tga":"assets/flags/tonga.png",
        "bra":"assets/flags/bresil.png",
    }
}