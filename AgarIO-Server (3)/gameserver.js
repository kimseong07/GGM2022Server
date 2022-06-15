var Vector = require('./modules/Vector');
var Player = require('./entity/Player');
var Food = require('./entity/Food');
const gameloop = require('./gameloop.js');
const WebSocket = require('ws');
const players = [];
var sockets = {};
let gameLoopId = null;
const serverFrameRate = 1.0; //10.0;
let lastPlayerId = 0;
let lastFoodId = 0;

//server op code
const START_COUNTDOWN_OP_CODE = 101;
const MOVE_PLAYER_OP_CODE = 102;
const JOIN_PLAYER_OP_CODE = 103;
const ADD_FOOD_OP_CODE = 105;

//client op code
const SCENE_READY_OP_CODE = 200;
const EAT_FOOD_OP_CODE = 202;
const PING_CHECK_OP_CODE = 205;

function StartGame(){
    //loop create
    gameLoopId = gameloop.setGameLoop(function(){
        addFood();
    }, 2000.0/serverFrameRate);

    gameloop.setGameLoop(function(){
        sendUpdates();
    }, 1000.0/serverFrameRate);
}

function StopGame(){
    //loop clear
    if(gameLoopId != null){
        gameloop.clearGameLoop(gameLoopId);
        gameLoopId = null;
    }
}

function getRandomPosition(){
    return new Vector(
        Math.floor(Math.random()*20 +1), 
        Math.floor(Math.random()*10 +1)
    );
}

function getRandomColor(){
    var colorRGB = [255, 10,  Math.floor(Math.random() * 256)];
    colorRGB.sort(function(){
       return 0.5-Math.random(); 
    });
    return {
        r:colorRGB[0],
        g:colorRGB[1],
        b:colorRGB[2]
    };
}

function getNewPlayerId(){
    return lastPlayerId++;
}

function movePlayer(player){
    var x = 0, y = 0;
    var target ={
        x: player.posX - player.targetX,
        y: player.posY - player.targetY
    };

    var deg = Math.atan2(target.y, target.x);
    var speed = 3;
    var deltaX = speed * Math.sin(deg);
    var deltaY = speed * Math.cos(deg);
    x += deltaX;
    y += deltaY;

    player.posX = x;
    player.posY = y;
}

function spawnPlayer(ws){
    var ownerId = ws.clientId;
    var pos = getRandomPosition();
    var c = getRandomColor();
    var mass = 1;
    var cell = new Player(ownerId, pos, c.r, c.g, c.b, ws.nickname, mass); //nickname
    console.log('spawning player : '+ownerId);

    msg.opCode = JOIN_PLAYER_OP_CODE;
    msg.socketId = ws.clientId;
    msg.player = cell;
    players.push(cell);

    for(var key in players){ //나(클라이언트)에게 이미 플레이하던 유저들의 정보를 보냄.
        msg.player = players[key];
        if(key != ownerId) ws.send(JSON.stringify(msg));
    }

    for(var key in players){ //이미 존재하던 플레이어들에게 새로접속한 나의 존재를 알림.
        sockets[key].send(JSON.stringify(msg));
    }
}

var foodToAdd = 30;
const foods = [];

function addFood(){
    if(foodToAdd < 0) return;
    while(foodToAdd--){
        var pos = getRandomPosition();
        var c = getRandomColor();
        var food = new Food(lastFoodId++, pos, c.r, c.g, c.b);
        foods.push(food);
    }

    //for test
    // for(var key in players){
    //     msg.opCode = ADD_FOOD_OP_CODE;
    //     msg.foods = foods;
    //     console.log("add food:"+JSON.stringify(msg));
    //     sockets[key].send(JSON.stringify(msg));
    // }
}

function removeFood(){
}

function deleteFood(fid){
    foods[fid] = {};
    console.log("delete food:"+fid);
    foods.splice(fid, 1);
}

function pingCheck(ws){
    msg.socketId = ws.clientId;
    msg.opCode = PING_CHECK_OP_CODE;
    ws.send(JSON.stringify(msg));
}

function sendUpdates(){
    players.forEach(function(p){
        msg.socketId = p.owner;
        msg.opCode = MOVE_PLAYER_OP_CODE;
        msg.player = p;
        msg.foods = foods;
        msg.visibleCells = players;
        
        console.log("sendUpdates:"+p.targetX);
        sockets[p.owner].send(JSON.stringify(msg)); 
    });
}

var msg = {
    socketId : -1,
    opCode : 0,
    foods:[],
    player:null,
    visibleCells:[],
    eatenFoodId : -1,
};

const wsserver = new WebSocket.Server({port:process.env.PORT || 3003}, ()=>{
    console.log("server started!");
    StartGame();
});

wsserver.on('connection', function connection(ws){
    //ws.send("Hello! I am a server");
    ws.clientId = msg.socketId = getNewPlayerId();
    msg.opCode = START_COUNTDOWN_OP_CODE;
    sockets[ws.clientId] = ws;
    ws.send(JSON.stringify(msg));
    console.log("hello new client : "+ ws.clientId);

    ws.on('message',(data)=>{
        if(data.sender != 0){
            msg = JSON.parse(data.toString());
            switch(msg.opCode){
                case SCENE_READY_OP_CODE:
                    ws.nickname = msg.nickname;
                    spawnPlayer(ws);
                    ws.score = 0;
                    break;
                case PING_CHECK_OP_CODE:
                    pingCheck(ws);
                    break;
                case MOVE_PLAYER_OP_CODE:
                    players[msg.socketId] = msg.player;
                    break;
                case EAT_FOOD_OP_CODE:
                    ws.score += 10;
                    players[ws.clientId].score = ws.score;
                    console.log("eating food.");
                    deleteFood(msg.eatenFoodId);
                    break;
                default:
                    console.log("[Warning] Unrecognized opCode in msg");
            }   
        }
    });

    ws.on('close',()=>{
        console.log("connection close");
        StopGame();
    });
});

wsserver.on('listening', ()=>{
    console.log(`listening on ${process.env.PORT}`);
});