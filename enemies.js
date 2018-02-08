
var kamikaze= new Image;
kamikaze.src = "images/kamikazeZerg.png"
var corruptorSprite = new Image;
corruptorSprite.src = "images/corruptor.png"
var corruptBallSprite = new Image;
corruptBallSprite.src = "images/corruptionBall.png"
var broodlordSprite = new Image;
broodlordSprite.src = "images/broodlord.png"

function Enemy(x, y, health){
    this.x = x;
    this.y = y;
    this.health = health;
    this.damage=10;
    this.paralyze=0;
    this.draw = function(){
            myBattleArea.ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
}

function Suicide(x, y, health){
    Enemy.call(this, x, y, health);
    this.img = kamikaze;
    this.width = 25;
    this.height = 25;
    this.type=1;
    this.resources=10;
}

Suicide.prototype.crashWith = function(unit){
    var distance = Math.sqrt(Math.pow(unit.x+unit.width/2-this.x-this.width/2,2)+Math.pow(unit.y+unit.height/2-this.y-this.height/2,2))
    return (distance<=unit.width*0.5);
}

function Corruptor(x, y, health){
    Enemy.call(this, x, y, health);
    this.img = corruptorSprite;
    this.width = 100;
    this.height = 100;
    this.type=2;
    this.resources=20;
    this.energy=0;
    this.shoot = function(){
        if (this.energy>=300){
            this.energy=0;
            myBattleArea.balls.push(new CorruptBall(this.x-100, this.y+12.5));
        } else {
            this.energy++;
        }
    };
    
}

Corruptor.prototype.crashWith = function(unit){
    var distance = Math.sqrt(Math.pow(unit.x+unit.width/2-this.x-this.width/2,2)+Math.pow(unit.y+unit.height/2-this.y-this.height/2,2))
    return (distance<=unit.width*0.5);
}

function CorruptBall(x, y){
    this.x = x;
    this.y = y;
    this.img = corruptBallSprite;
    this.width = 75;
    this.height = 75;
    this.damage = 50;
    this.draw = function(){
        this.x-=3;
        myBattleArea.ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
}

CorruptBall.prototype.crashWith = function(unit){
    var distance = Math.sqrt(Math.pow(unit.x+unit.width/2-this.x-this.width/2,2)+Math.pow(unit.y+unit.height/2-this.y-this.height/2,2))
    return (distance<=unit.width*0.5);
}

function Broodlord(x, y, health){
    Enemy.call(this, x, y, health);
    this.img = broodlordSprite;
    this.width = 100;
    this.height = 100;
    this.type=3;
    this.resources=30;
    this.energy=0;
    this.create = function(){
        if (this.energy>=300){
            this.energy=0;
        myBattleArea.enemies.push(new Suicide(this.x - 37.5, this.y+this.height, 10))
        myBattleArea.enemies.push(new Suicide(this.x - 37.5, this.y+this.height/2, 10))
        myBattleArea.enemies.push(new Suicide(this.x - 37.5, this.y, 10))
        }else {
            this.energy++;
        }
    }
}

Broodlord.prototype.crashWith = function(unit){
    var distance = Math.sqrt(Math.pow(unit.x+unit.width/2-this.x-this.width/2,2)+Math.pow(unit.y+unit.height/2-this.y-this.height/2,2))
    return (distance<=unit.width*0.5);
}