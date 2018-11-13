var battleBGM = document.createElement("audio");
var selectBGM = document.createElement("audio");
battleBGM.setAttribute("src", "./assets/trainer-battle.mp3");
selectBGM.setAttribute("src", "./assets/select.mp3");
var $aiBattle = $("#ai-pokemon");
var $battleWindow = $(".battle-window");
var $playerBattle = $("#player-pokemon");
var $selectPlayerWindow = $(".player-party");
var $selectAIWindow = $(".enemy-party");
var $selectPlayerPkmn = $(".select-player-pokemon");
var $selectAIPkmn = $(".select-ai-pokemon");
var $aiHP = $("#ai-hp");
var $playerHP = $("#player-hp");
var $aiName = $("#ai-name");
var $playerName = $("#player-name");
var $playerAtk = $("#player-attack");
var selectedPlayerPkmnID = null;
var selectedAIPkmnID = null;
var gameOver = false;

var pokemon = {
    name: ['Venusaur', 'Charizard', 'Blastoise', 'Vaporeon', 'Jolteon', 'Flareon'],
    //id: [0,1,2,3,4,5],
    hp: [360, 364, 362, 464, 334, 334],
    atkVal: [10, 6, 8, 2, 25, 50],
    atkName: ['Solar Beam', 'Fire Blast', 'Hydro Pump', 'Thunder', 'Fire Blast']
};

var player = {
    currentPkmnID: 0,
    currentHP: 0,
    currentAtkPow: 0,

    setAttack: function (atk) {
        this.currentAtkPow = atk;
    },

    setHP: function (hp) {
        this.currentHP = hp;
        $playerHP.text(`HP: ${this.currentHP}`);
    },

    powerUp: function () {
        currentAtkPow += 5;
    }

};

var ai = {
    currentPkmnID: 0,
    currentHP: 0,
    currentAtkPow: 0,

    setAttack: function (atk) {
        this.currentAtkPow = atk;
    },

    setHP: function (hp) {
        this.currentHP = hp;
        $aiHP.text(`HP: ${this.currentHP}`);
    }

};

function showEnemyParty() {
    $selectAIWindow.show();
}

function isPlayerDead() {
    if(player.currentHP > 0){
        return true;
    }else {
        return false;
    }
}

function startBattle() {
    selectBGM.pause();
    $selectAIWindow.hide();
    battleBGM.play();
}

$(document).ready(function () {

    $selectAIWindow.hide();

    $(".select-player-pokemon").children().on("click", function () {
        var playerPkmnSpr = $("<img>");
        var pkmnSelected = $(this).parent().attr('data-value');
        selectedPlayerPkmnID = $(this).parent().attr('data-id');
        console.log("selected: " + pkmnSelected);
        console.log("selected id: " + selectedPlayerPkmnID);
        playerPkmnSpr.attr("src", "./assets/img/" + pkmnSelected + "-back.png");
        $playerBattle.append(playerPkmnSpr);
        player.setHP(pokemon.hp[selectedPlayerPkmnID]);
        player.currentAtkPow = pokemon.atkVal[selectedPlayerPkmnID];
        console.log(`Player Current ID: ${selectedPlayerPkmnID } | Current HP: ${player.currentHP} | Current Atk: ${player.currentAtkPow}`);
        $playerName.text(pokemon.name[selectedPlayerPkmnID]);
        var atkBtn = $("<button>");
        atkBtn.attr("class","btn btn-outline-secondary attack-btn");
        atkBtn.text(pokemon.atkName[selectedPlayerPkmnID]);
        $playerAtk.append(atkBtn);
        $selectPlayerWindow.hide();
        //$battleWindow.hide();
        showEnemyParty();
    });

    $(".select-ai-pokemon").children().on("click", function () {
        var aiPkmnSpr = $("<img>");
        var pkmnSelected = $(this).parent().attr('data-value');
        selectedAIPkmnID = $(this).parent().attr('data-id');
        console.log("selected: " + pkmnSelected);
        console.log("selected id: " + selectedAIPkmnID);
        aiPkmnSpr.attr("src", "./assets/img/" + pkmnSelected + "-front.png");
        $aiBattle.append(aiPkmnSpr);
        ai.setHP(pokemon.hp[selectedAIPkmnID]);
        ai.currentAtkPow = pokemon.atkVal[selectedAIPkmnID];
        console.log(`Player Current ID: ${selectedAIPkmnID} | Current HP: ${ai.currentHP} | Current Atk: ${ai.currentAtkPow}`);
        $aiName.text(pokemon.name[selectedAIPkmnID]);
        startBattle();
    });

    //no matter what the div holding the button and the button it self, if clicked nothing is happening
    $("#player-attack").children().on("click", function(){
        console.log("test");
    });

    $(".attack-btn").on("click", function(){
        console.log("test");
    });
});