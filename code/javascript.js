//$(document).ready(function() {
    var activeChar;
    var activeDefender;
    var enemyPool = [];

    var characters = {
    "Dolores": {
        name: "Dolores",
        hp: 360,
        atk: 14,
        pic: "assets/images/char1.png",
        catk: 50
    },
    "Billy": {
        name: "Billy",
        hp: 300,
        atk: 16,
        pic: "assets/images/char2.jpeg",
        catk: 50
    },
    "Teddy": {
        name: "Teddy",
        hp: 200,
        atk: 28,
        pic: "assets/images/char3.jpg",
        catk: 10
    },
    "Hector": {
        name: "Hector",
        hp: 240,
        atk: 16,
        pic: "assets/images/char4.jpg",
        catk: 30
    }
};

var renderOne = function (character, renderArea, status) {
    var charDiv = $("<div class='character' data-name='" + character.name + "'>");
    var charName = $("<div class='character-name'>").text(character.name);
    var charPic = $("<img class='character-image'>").attr("src", character.pic);
    var charHP = $("<div class='character-hp'>").text(character.hp);
    charDiv.append(charName).append(charPic).append(charHP);
    $(renderArea).append(charDiv);

    if (status === "enemy") {
        $(charDiv).addClass("enemy")
    }
    else if (status === "defender") {
        activeDefender = characters[name];
        $(charDiv).addClass("target-enemy");
    }
};

var renderCharacters = function(charObj, areaRender) {
    if (areaRender === "#character-select-container") {
        $(areaRender).empty();
        for (var key in charObj) {
            if (charObj.hasOwnProperty(key)) {
                renderOne(charObj[key], areaRender, "");
            }
        }
    }
    if (areaRender === "#selected-character-container") {
        renderOne(charObj, areaRender, "");
    }
    if (areaRender === "#enemy-select-container") {
        for (var i = 0; i < charObj.length; i++) {
            renderOne(charObj[i], areaRender, "enemy");
        }
        $(document).on("click", ".enemy", function() {
            var name = ($(this).attr("data-name"));
            console.log(name)
            if ($("#defender").children().length === 0) {
                activeDefender = characters[name];
                renderCharacters(name, "#defender");
                $(this).hide();
            }
        });
    }
    if (areaRender === "#defender") {
        $(areaRender).empty();
        for (var i = 0; i < enemyPool.length; i++) {
            if (enemyPool[i].name === charObj) {
                renderOne(enemyPool[i], areaRender, "defender")
            }
        }
    }
}

renderCharacters(characters, "#character-select-container");

$(document).on("click", ".character", function(){
    var name = $(this).attr("data-name");
    if (!activeChar) {
        activeChar = characters[name];
        for (var key in characters) {
            if (key !== name) {
                enemyPool.push(characters[key]);
            }
        }
        $("#character-select-container").hide();

        renderCharacters(activeChar, "#selected-character-container");
        renderCharacters(enemyPool, "#enemy-select-container");
    }
});
//});