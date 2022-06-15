class Player{
    constructor(owner, position, r, g, b, nickname, mass, targetX, targetY){
        this.owner = owner;
        this.posX = position.x;
        this.posY = position.y;
        this.r = r;
        this.g = g;
        this.b = b;
        this.cellType = -1; //0=player
        this.nickname = nickname;
        this.mass = mass;
        this.targetX = targetX;
        this.targetY = targetY;
    }
}

module.exports = Player;