
var mothershipSprite = new Image;
mothershipSprite.src = "images/mothership.png"
var hero = new Image;
hero.src= "images/phoenix.png";
var beam = new Image;
beam.src = "images/shoot.png";
var replicant = new Image;
replicant.src = "images/replicant.png";
var energyShield = new Image;
energyShield.src = "images/energyShield.png"
var tempest = new Image;
tempest.src = "images/tempest.png";
var energyBall = new Image;
energyBall.src = "images/energyBall.png"
var oracle = new Image;
oracle.src = "images/oracle.png";
var paralyzeField = new Image;
paralyzeField.src = "images/paralyzeField.png"

function Unit(x, y, health){
    this.x=x;
    this.y=y;
    this.health= health;
    this.maxHealth = health;
    this.draw = function(){
            myBattleArea.ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
            myBattleArea.ctx.fillStyle= "white";
            myBattleArea.ctx.fillRect(this.x, this.y - 30, this.width, 10);
            myBattleArea.ctx.strokeStyle= "white";
            myBattleArea.ctx.lineWidth= 5;
            myBattleArea.ctx.strokeRect(this.x, this.y - 30, this.width, 10);
            myBattleArea.ctx.fillStyle= "red";
            myBattleArea.ctx.fillRect(this.x, this.y - 30, this.health/this.maxHealth*this.width, 10);
    }
}

function Mothership(x, y, health){
    Unit.call(this, x, y, health);
    this.img = mothershipSprite;
    this.width = myBattleArea.canvas.height;
    this.height = myBattleArea.canvas.height;
}

function Player(x, y, health){
    Unit.call(this, x, y, health);
    this.img = hero;
    this.width = 50;
    this.height = 50;
    this.moveLeft = function(){
        if (this.x>30){
        this.x-=30;
        }
    };
    this.moveRight = function(){
        if (this.x<myBattleArea.canvas.width-this.width){
          this.x+=30;
          }
    };
    this.moveUp = function(){
        if (this.y>0){
            this.y-=30;
        }
    };
    this.moveDown = function(){
        if (this.y<myBattleArea.canvas.height-this.height){
            this.y+=30;
            }
    };
    this.beams = [];
    this.shoot = function(){
        this.beams.push(new Beam(this.x+this.width+10, this.y+this.height/2-10));
    }
    this.beamsDraw=function(){
        this.beams.forEach(function(beam){
            beam.draw();
        })
    }
}

function Beam(x, y){
    this.x = x;
    this.y = y;
    this.img = beam;
    this.width = 20;
    this.height = 20;
    this.damage =10;
    this.draw = function(){
        this.x+=3;
        myBattleArea.ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
}

Beam.prototype.crashWith = function(unit){
    var distance = Math.sqrt(Math.pow(unit.x+unit.width/2-this.x-this.width/2,2)+Math.pow(unit.y+unit.height/2-this.y-this.height/2,2))
    return (distance<=this.width*0.75);
}

function Replicant(x,y, health){
    Unit.call(this, x, y, health);
    this.img = replicant;
    this.width = 75;
    this.height = 75;
    this.type="R";
    this.energy=500;
    this.maxEnergy=500;
    this.recharge=0;
    this.drawShield = function(){
        if ((this.energy)>0){
            this.energy--;
            myBattleArea.ctx.drawImage(energyShield, this.x-this.width/2, this.y-this.height/2, this.width*2, this.height*2);
        } else {
            if (this.recharge>=500){
                this.energy+=this.recharge;
                this.recharge=0;
            } else {
                this.recharge++;
            }
        }
        myBattleArea.ctx.fillStyle= "white";
        myBattleArea.ctx.fillRect(this.x, this.y + this.height + 30, this.width, 10);
        myBattleArea.ctx.strokeStyle= "white";
        myBattleArea.ctx.lineWidth= 5;
        myBattleArea.ctx.strokeRect(this.x, this.y + this.height + 30, this.width, 10);
        myBattleArea.ctx.fillStyle= "green";
        myBattleArea.ctx.fillRect(this.x, this.y + this.height + 30, (this.energy+this.recharge)/this.maxEnergy*this.width, 10);

    }
    
}

function Tempest(x,y, health){
    Unit.call(this, x, y, health);
    this.img = tempest;
    this.width = 100;
    this.height = 100;
    this.type="T";
    this.energy=0;
    this.maxEnergy=500;
    this.balls=[];
    this.shoot = function(){
        if (this.energy>500){
            this.energy=0;
            this.balls.push(new EnergyBall(this.x+this.width+10, this.y-25));
        } else {
            this.energy++;
        }
        myBattleArea.ctx.fillStyle= "white";
        myBattleArea.ctx.fillRect(this.x, this.y + this.height + 30, this.width, 10);
        myBattleArea.ctx.strokeStyle= "white";
        myBattleArea.ctx.lineWidth= 5;
        myBattleArea.ctx.strokeRect(this.x, this.y + this.height + 30, this.width, 10);
        myBattleArea.ctx.fillStyle= "green";
        myBattleArea.ctx.fillRect(this.x, this.y + this.height + 30, (this.energy)/this.maxEnergy*this.width, 10);
    };
    this.ballsDraw=function(){
        this.balls.forEach(function(ball){
            ball.draw();
        })
    }
    
}

function EnergyBall(x, y){
    this.x = x;
    this.y = y;
    this.img = energyBall;
    this.width = 150;
    this.height = 150;
    this.damage = 100;
    this.draw = function(){
        this.x+=3;
        myBattleArea.ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
}

EnergyBall.prototype.crashWith = function(unit){
    var distance = Math.sqrt(Math.pow(unit.x+unit.width/2-this.x-this.width/2,2)+Math.pow(unit.y+unit.height/2-this.y-this.height/2,2))
    console.log(distance);
    return (distance<=this.width*0.5);
}

function Oracle(x,y, health){
    Unit.call(this, x, y, health);
    this.img = oracle;
    this.width = 75;
    this.height = 75;
    this.type="O";
    this.energy=1000;
    this.maxEnergy=1000;
    this.drawShield = function(){
        if ((this.energy)>0){
            this.energy--;
            myBattleArea.ctx.drawImage(paralyzeField, this.x-this.width*1.5, this.y-this.height*1.5, this.width*4, this.height*4);
        } 
        myBattleArea.ctx.fillStyle= "white";
        myBattleArea.ctx.fillRect(this.x, this.y + this.height + 30, this.width, 10);
        myBattleArea.ctx.strokeStyle= "white";
        myBattleArea.ctx.lineWidth= 5;
        myBattleArea.ctx.strokeRect(this.x, this.y + this.height + 30, this.width, 10);
        myBattleArea.ctx.fillStyle= "green";
        myBattleArea.ctx.fillRect(this.x, this.y + this.height + 30, this.energy/this.maxEnergy*this.width, 10);

    }
    
}