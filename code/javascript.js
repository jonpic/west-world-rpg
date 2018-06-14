//$(document).ready(function() {
    var activeChar;
    var activeDefender;
    var enemyPool = [];
    var counter = 0;
    var killCount = 0;

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
var renderMessage = function(message) {
    var gameMessageSet = $("#game-text-container");
    var newMessage = $("<div>").text(message);
    gameMessageSet.append(newMessage);

    if (message === "clearMessage") {
        gameMessageSet.text("");
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
        activeDefender = character;
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
            if ($("#defender").children().length === 0) {
                console.log("here")
                renderCharacters(name, "#defender");
                $(this).hide();
                renderMessage("clearMessage");
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
    if (areaRender === "playerDamage") {
        $("#defender").empty();
        renderOne(charObj, "#defender", "defender");
    }

    if (areaRender === "enemyDamage") {
        $("#selected-character-container").empty();
        renderOne(charObj, "#selected-character-container", "");
    }

    if (areaRender === "enemyDefeated") {
        $("#defender").empty()
        var gameStateMessage = "You defeated " + charObj.name + ". Pick another enemy."
        renderMessage(gameStateMessage)
    }
}

var restartGame = function(inputEndGame) {
    var restart = $("<button>Restart</button>").click(function(){
        location.reload();
    });
    var gameState = $("<div>").text(inputEndGame);
    $("body").append(gameState);
    $("body").append(restart);
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

$("#attack-button").on("click", function(){
    if($("#defender").children().length !== 0) {
        var atkMessage = "You attacked " + activeDefender.name + " for " + (activeChar.atk + counter) + " dmg." 
        var catkMessage = "You were attacked for " + (activeDefender.catk) + " dmg." 
        renderMessage("clearMessage");
        
        activeDefender.hp -= (activeChar.atk + counter)
        console.log(activeDefender.hp)

        if (activeDefender.hp > 0) {
            activeDefender.hp -= (activeChar.atk + counter)
            renderCharacters(activeDefender, "playerDamage");
            renderMessage(atkMessage);
            renderMessage(catkMessage)
        }
        else {
            renderCharacters(activeDefender, "enemyDefeated");
            killCount++
            
            if (killCount >= 3) {
                $("#action").empty();
                renderMessage("clearMessage")
                restartGame("You win!")
            }
        }

        if (activeChar.hp > 0) {
            activeChar.hp -= activeDefender.catk
            renderCharacters(activeChar, "enemyDamage");
        }
        if (activeChar.hp <= 0) {
            $("#action").empty();
            renderMessage("clearMessage");
            restartGame("You were defeated")
            
        }
    }
    
    counter++
});
//});