var battleBGM = document.createElement("audio");
var selectBGM = document.createElement("audio");
var atkSFX = document.createElement("audio");
var gameOverBGM = document.createElement("audio");
var faintSFX = document.createElement("audio");
var lowHPSFX = document.createElement("audio");
var throwSFX = document.createElement("audio");
var landSFX = document.createElement("audio");
var powerupSFX = document.createElement("audio");
var selectFX = document.createElement("audio");
var victoryBGM = document.createElement("audio");
battleBGM.setAttribute("src", "./assets/trainer-battle.mp3");
selectBGM.setAttribute("src", "./assets/select.mp3");
atkSFX.setAttribute("src", "./assets/attack.mp3");
lowHPSFX.setAttribute("src", "./assets/low-hp.mp3");
throwSFX.setAttribute("src", "./assets/throw.mp3");
landSFX.setAttribute("src", "./assets/land.mp3");
faintSFX.setAttribute("src", "./assets/faint.mp3");
powerupSFX.setAttribute("src", "./assets/rarecandy.mp3");
selectFX.setAttribute("src", "./assets/beep.mp3");
gameOverBGM.setAttribute("src", "./assets/failed.mp3");
victoryBGM.setAttribute("src", "./assets/victory.mp3");
var $mainContainer = $(".game-container");
var $aiBattle = $("#ai-pokemon"); //this is the ai pokemon sprite
var $battleWindow = $(".battle-window");
var $aiBattleArea = $(".ai-area"); //this is the actual ai battle div with sprite and hp and name
var $playerBattle = $("#player-pokemon");
var $selectPlayerWindow = $(".player-party");
var $selectAIWindow = $(".enemy-party");
var $battleText = $(".battle-text");
var $selectPlayerPkmn = $(".select-player-pokemon");
var $selectAIPkmn = $(".select-ai-pokemon");
var $aiHP = $("#ai-hp");
var $playerHP = $("#player-hp");
var $aiName = $("#ai-name");
var $playerName = $("#player-name");
var $playerAtk = $("#player-attack");
var selectedPlayerPkmnID = null;
var selectedAIPkmnID = null;
var aiDefeatedCount = 0;
//var gameOver = false;

var pokemon = {
    name: ['VENUSAUR', 'CHARIZARD', 'BLASTOISE', 'VAPOREON', 'JOLTEON', 'FLAREON'],
    //id: [0,1,2,3,4,5],
    hp: [360, 364, 362, 464, 334, 334], //char wass 364
    atkVal: [10, 6, 8, 2, 100, 25], //char was 6, jolt was 100
    atkName: ['Solar Beam', 'Fire Blast', 'Hydro Pump', 'Hydro Pump', 'Thunder', 'Fire Blast'],
    type1: ["grass", "fire", "water", "water", "electric", "fire"]
};

var player = {
    //currentPkmnID: 0,
    currentHP: 0,
    currentAtkPow: 0,

    setAttack: function (atk) {
        this.currentAtkPow = atk;
    },

    setHP: function (hp) {
        this.currentHP = hp;
        if (this.currentHP < 0) {
            $playerHP.attr("style", "width:0%");

        } else {
            $playerHP.attr("style", "width:" + convertHPP(hp, pokemon.hp[selectedPlayerPkmnID]) + "%");
        }
    },

    powerUp: function () {
        this.currentAtkPow += 7;
        $battleText.text(`You used Rare Candy and ${pokemon.name[selectedPlayerPkmnID]} has powered up!`);
        console.log("power upped?" + player.currentAtkPow);
    }

};

var ai = {
    //currentPkmnID: 0,
    currentHP: 0,
    currentAtkPow: 0,

    setAttack: function (atk) {
        this.currentAtkPow = atk;
    },

    setHP: function (hp) {
        this.currentHP = hp;
        if (this.currentHP < 0) {
            $aiHP.attr("style", "width:0%");
        } else {
            $aiHP.attr("style", "width:" + convertHPP(hp, pokemon.hp[selectedAIPkmnID]) + "%");
        }

    }

};


function showEnemyParty() {
    $selectAIWindow.show();
}

function isPlayerDead() {
    if (player.currentHP > 0) {
        return true;
    } else {
        return false;
    }
}

function gameOver() {
    $mainContainer.empty();
    $mainContainer.text("Game Over!");
    battleBGM.pause();
    lowHPSFX.pause();
    battleBGM.currentTime = 0;
    gameOverBGM.play();
    var newDiv = $("<div>");
    $mainContainer.append(newDiv);
    var reloadBtn = $("<button>");
    reloadBtn.attr("class", "btn btn-outline-secondary reload-btn");
    reloadBtn.text("Restart");
    newDiv.append(reloadBtn);
}

function playerWins() {
    lowHPSFX.pause();
    $mainContainer.empty();
    $mainContainer.text("Player Wins!");
    battleBGM.pause();
    battleBGM.currentTime = 0;
    victoryBGM.play();
    var newDiv = $("<div>");
    $mainContainer.append(newDiv);
    var reloadBtn = $("<button>");
    reloadBtn.attr("class", "btn btn-outline-secondary reload-btn");
    reloadBtn.text("Restart");
    newDiv.append(reloadBtn);
}

function startBattle() {
    selectBGM.pause();
    $selectAIWindow.hide();
    battleBGM.play();
    battleBGM.loop = true;
    battleBGM.volume = 0.1;
}

function removeAIPokemon(pkmnID) {
    console.log("variable passed" + pkmnID);
    console.log("global" + selectedAIPkmnID)
    $(`#${pkmnID}`).empty();
    aiDefeatedCount++;
}

function clearAIBattle() {
    $aiHP.empty();
    $aiName.empty();
    $aiBattle.empty();
    selectedAIPkmnID = null;
}


function checkHPStatus() {
    if (player.currentHP < 1) {
        console.log("Over");
        gameOver();

    } else if (ai.currentHP < 1) {
        faintSFX.play();
        $battleText.empty();
        showEnemyParty();
        removeAIPokemon(selectedAIPkmnID);
        clearAIBattle();
        if (aiDefeatedCount === 3) {
            playerWins();
        }
    }
}

function convertHPP(currentHP, maxHP) {
    return (currentHP / maxHP) * 100;
}


function initTurn() {

    //disables the button to attack enemy
    $('.attack-btn').prop('disabled', true);

    ai.setHP(ai.currentHP -= player.currentAtkPow);
    atkSFX.play();
    $battleText.text(`${pokemon.name[selectedPlayerPkmnID]} used ${pokemon.atkName[selectedPlayerPkmnID]} on ${pokemon.name[selectedAIPkmnID]} and dealt ${player.currentAtkPow} damage!`);
    animationClick(".player-img", 'wobble');
    animationClick(".ai-img", 'flash');
    setTimeout(
        function () {
            powerupSFX.play();
            player.powerUp();

            if (ai.currentHP > 0) { // check to do ai turn
                setTimeout(
                    function () {
                        //selectFX.play();
                        player.setHP(player.currentHP -= ai.currentAtkPow);
                        atkSFX.play();
                        $battleText.text(`${pokemon.name[selectedAIPkmnID]} used ${pokemon.atkName[selectedAIPkmnID]} on ${pokemon.name[selectedPlayerPkmnID]} and dealt ${ai.currentAtkPow} damage!`);
                        animationClick(".ai-img", 'wobble');
                        animationClick(".player-img", 'flash');
                        setTimeout(
                            function () {
                                selectFX.play();
                                $battleText.text(`Player's turn!`);
                                console.log("max hp" + pokemon.hp[selectedPlayerPkmnID]);
                                console.log("% hp" + convertHPP(player.currentHP, pokemon.hp[selectedPlayerPkmnID]));
                                $('.attack-btn').prop('disabled', false);
                                if (convertHPP(player.currentHP, pokemon.hp[selectedPlayerPkmnID]) < 40) { // checks players hp
                                    $playerHP.removeClass("bg-success").addClass("bg-danger"); //change hp bar colour
                                    lowHPSFX.play();
                                    lowHPSFX.loop = true;
                                    lowHPSFX.volume = 0.4;
                                }
                                checkHPStatus();

                            }, 2000);

                    }, 2000);
            } else {
                checkHPStatus();
            }
        }, 2000);

}

function animationClick(element, animation) {
    element = $(element);
    element.removeClass('fadeInLeft fadeInRight').addClass('animated ' + animation);
    console.log("entered the den");
    //wait for animation to finish before removing classes
    window.setTimeout(function () {
        element.removeClass('animated ' + animation);
    }, 2000);

}

$(document).ready(function () {

    $selectAIWindow.hide();
    //selectBGM.play();


    $(".select-player-pokemon").children().on("click", function () {
        var playerPkmnSpr = $("<img>");
        var pkmnSelected = $(this).parent().attr('data-value');
        selectedPlayerPkmnID = $(this).parent().attr('id');
        console.log("selected: " + pkmnSelected);
        console.log("selected id: " + selectedPlayerPkmnID);
        playerPkmnSpr.attr("src", "./assets/img/player.gif");
        playerPkmnSpr.attr("class", "player-img animated fadeInLeft");
        $playerBattle.append(playerPkmnSpr);
        setTimeout(
            function () {
                throwSFX.play();
            }, 1750);
        setTimeout(
            function () {
                animationClick(".player-img", 'zoomIn');
                $(".player-img").attr("src", "./assets/img/" + pkmnSelected + "-back.png");
                landSFX.play();
            }, 3000);
        player.setHP(pokemon.hp[selectedPlayerPkmnID]);
        player.currentAtkPow = pokemon.atkVal[selectedPlayerPkmnID];
        console.log(`Player Current ID: ${selectedPlayerPkmnID} | Current HP: ${player.currentHP} | Current Atk: ${player.currentAtkPow}`);
        $playerName.text(pokemon.name[selectedPlayerPkmnID]);
        var atkBtn = $("<button>");
        atkBtn.attr("class", "btn btn-outline-secondary attack-btn");
        atkBtn.text(pokemon.atkName[selectedPlayerPkmnID]);
        $playerAtk.append(atkBtn);
        $selectPlayerWindow.hide();
        //disables the button to attack enemy
        $('.attack-btn').prop('disabled', true);
        //$battleWindow.hide();
        showEnemyParty();
    });

    $(".select-ai-pokemon").children().on("click", function () {
        var aiPkmnSpr = $("<img>");
        var pkmnSelected = $(this).parent().attr('data-value');
        //selectedAIPkmnID = $(this).parent().attr('data-id');
        selectedAIPkmnID = $(this).parent().attr('id');
        console.log("selected: " + pkmnSelected);
        console.log("selected id: " + selectedAIPkmnID);
        aiPkmnSpr.attr("src", "./assets/img/blue.png");
        aiPkmnSpr.attr("class", "ai-img animated fadeInRight");
        $aiBattle.append(aiPkmnSpr);
        setTimeout(
            function () {
                throwSFX.play();
            }, 3000);
        setTimeout(
            function () {
                animationClick(".ai-img", 'zoomIn');
                $(".ai-img").attr("src", "./assets/img/" + pkmnSelected + "-front.png");
                landSFX.play();
            }, 3500);
        ai.setHP(pokemon.hp[selectedAIPkmnID]);
        ai.currentAtkPow = pokemon.atkVal[selectedAIPkmnID];
        console.log(`Player Current ID: ${selectedAIPkmnID} | Current HP: ${ai.currentHP} | Current Atk: ${ai.currentAtkPow}`);
        $aiName.text(pokemon.name[selectedAIPkmnID]);
        //re-enable attack button
        $('.attack-btn').prop('disabled', false);
        startBattle();
    });

    $("body").on("click", ".attack-btn", function () {
        initTurn();
    });

    $("body").on("click", ".reload-btn", function () {
        location.reload();
    });
});