var bg1 = new Image;
bg1.src = "images/background1.jpg"
var bg2 = new Image;
bg2.src = "images/background2.jpg"
var bg3 = new Image;
bg3.src = "images/background3.jpg"
var bg4 = new Image;
bg4.src = "images/background4.jpg"
var bg5 = new Image;
bg5.src = "images/background5.jpg"
var bg6 = new Image;
bg6.src = "images/background6.jpg"
var explosion = new Image;
explosion.src="images/explo.gif";
var bgs = [bg1, bg2, bg3, bg4, bg5, bg6]
var gameStatus=0;
var createUnit=0;
var oracleTrue=false;
var exploFrames="Hola";
window.onload = function() {
    
    document.getElementById("start-button").onclick = function() {
        if (gameStatus===0){
        gameStatus=1;
        startGame();
      }
    }
};

function startGame(){
    resources = 100000;
    myBattleArea.start();
    myBattleArea.drawBoard();
    mothership = new Mothership(-myBattleArea.canvas.height/2+50, 0, 500);
    mothership.draw();
    player = new Player(300, 300, 100);
    player.draw();
};

function updateBattleArea(){
    //Update frames, clear and draw everything again
    myBattleArea.frames++;
    myBattleArea.ctx.clearRect(0, 0, myBattleArea.canvas.width,myBattleArea.canvas.height);
    myBattleArea.drawBoard();
    mothership.draw();
    player.draw();
    player.beamsDraw();
    myBattleArea.score();
    exploFrames++;
    //Crear Suicidas
    if (myBattleArea.frames%50===0){
        myBattleArea.enemies.push(new Suicide(myBattleArea.canvas.width, 20+(Math.random()*(myBattleArea.canvas.height-20)),10));
    }
    //Aumentar el ratio de Suicidas, y crear Corruptores
    if (myBattleArea.frames>100){
        if (myBattleArea.frames%50===0){
            myBattleArea.enemies.push(new Suicide(myBattleArea.canvas.width, 20+(Math.random()*(myBattleArea.canvas.height-20)),10));
        }
        if (myBattleArea.frames%500===0){
            myBattleArea.enemies.push(new Corruptor(myBattleArea.canvas.width, 100+(Math.random()*(myBattleArea.canvas.height-200)),100));
        }
    }
    //Crear Broodlords
    if (myBattleArea.frames>200){
        if (myBattleArea.frames%500===0){
            myBattleArea.enemies.push(new Broodlord(myBattleArea.canvas.width, 100+(Math.random()*(myBattleArea.canvas.height-200)),100));
        }
    }

    //Mover los enemigos
    for (var i = 0; i<myBattleArea.enemies.length;i++){
        if (myBattleArea.enemies[i].paralyze===0){
            //Los Corruptors se plantan
            if (myBattleArea.enemies[i].type!=1 && myBattleArea.enemies[i].x<(myBattleArea.canvas.width-200)){

            } else{
                myBattleArea.enemies[i].x-=2;
            //Cada 10 frames se mueven en el eje Y
                if (myBattleArea.frames%10===0){
                    randomWalk = Math.floor(Math.random()*2);
                    if (randomWalk===0){
                        if (myBattleArea.enemies[i].y<(myBattleArea.canvas.height-30)){
                            myBattleArea.enemies[i].y+=10;
                        }
                    } else {
                        if (myBattleArea.enemies[i].y>30){
                            myBattleArea.enemies[i].y-=10;
                        }
                    }
                }
            }
            //Disparan los corruptores si tienen energia
            if (myBattleArea.enemies[i].type===2){
                myBattleArea.enemies[i].shoot();
            } else if (myBattleArea.enemies[i].type===3){
                myBattleArea.enemies[i].create();
            }
        }
        myBattleArea.enemies[i].draw();
    };
    //Dibujar las unidades, su escudo y sus ataques
    for (var i = 0; i<myBattleArea.units.length;i++){
        myBattleArea.units[i].draw();
        if (myBattleArea.units[i].type==="R"){
            myBattleArea.units[i].drawShield();
        } else  if (myBattleArea.units[i].type==="T"){
            myBattleArea.units[i].shoot();
            myBattleArea.units[i].ballsDraw();
            myBattleArea.units[i].balls.forEach(function(ball, indexB){
                myBattleArea.enemies.forEach(function(enemy, indexE){
                    if (ball.crashWith(enemy)){
                        myBattleArea.enemies[indexE].health-=ball.damage;
                        if (myBattleArea.enemies[indexE].health<=0){
                            myBattleArea.enemies.splice(indexE,1);
                            resources+=enemy.resources;
                        }
                    }
                })
            })
        } else {
            myBattleArea.units[i].drawShield();
        }
    };
    //Dibujar los rayos del player
    player.beams.forEach(function(beam, indexB){
        myBattleArea.enemies.forEach(function(enemy, indexE){
            if (beam.crashWith(enemy)){
                myBattleArea.enemies[indexE].health-=beam.damage;
                if (myBattleArea.enemies[indexE].health<=0){
                    myBattleArea.enemies.splice(indexE,1);
                    resources+=enemy.resources;
                }
                player.beams.splice(indexB,1);
            }
        })
    })
    //Dibujar la muerte de los suicidas 
    myBattleArea.enemies.forEach(function(enemy, index){
        if (enemy.crashWith(player) && enemy.type===1){
            exploX =  enemy.x;
            exploY = enemy.y
            exploFrames = 1
            myBattleArea.ctx.drawImage(explosion, exploX, exploY, 25, 25);
            player.health-=enemy.damage;
            if (player.health<=0){
                // Game Ends
            }
            myBattleArea.enemies.splice(index,1);
        }
        if (enemy.crashWith(mothership) && enemy.type===1){
            exploX =  enemy.x;
            exploY = enemy.y
            exploFrames = 1
            myBattleArea.ctx.drawImage(explosion, exploX, exploY, 25, 25);
            mothership.health-=enemy.damage;
            myBattleArea.enemies.splice(index,1);
            if (mothership.health<=0){
                // Game Ends
            }
        }
        myBattleArea.units.forEach(function(unit, indexU){
            if (unit.type==="R" && unit.energy>0){
                shield={
                    x: unit.x-unit.width/2,
                    y: unit.y-unit.height/2,
                    width: unit.width*2,
                    height: unit.height*2
                }
                if (enemy.crashWith(shield) && enemy.type===1){
                    exploX =  enemy.x;
                    exploY = enemy.y
                    exploFrames = 1
                    myBattleArea.ctx.drawImage(explosion, exploX, exploY, 25, 25);
                    myBattleArea.units[indexU].energy-=enemy.damage;
                    myBattleArea.enemies.splice(index,1);
                }
            } else if (unit.type==="O" && unit.energy>0){
                shield={
                    x: unit.x-unit.width*1.5,
                    y: unit.y-unit.height*1.5,
                    width: unit.width*4,
                    height: unit.height*4
                }
                if (enemy.crashWith(shield)){
                    enemy.paralyze=1;
                } 
            
            } else if (unit.type==="O"){
                enemy.paralyze=0;
            }
            if (enemy.crashWith(unit) && enemy.type===1){
                exploX =  enemy.x;
                exploY = enemy.y
                exploFrames = 1
                myBattleArea.ctx.drawImage(explosion, exploX, exploY, 25, 25);
                myBattleArea.units[indexU].health-=enemy.damage;
                if (myBattleArea.units[indexU].health<=0){
                    if (unit.type="O"){
                        oracleTrue=false;
                    }
                    myBattleArea.units.splice(indexU,1);
                }
                myBattleArea.enemies.splice(index,1);
            }
        })
    })
    myBattleArea.balls.forEach(function(ball, indexC){
        ball.draw();
        myBattleArea.units.forEach(function(enemy, indexU){
            if (ball.crashWith(enemy)){
                myBattleArea.units[indexU].health-=ball.damage;
                myBattleArea.balls.splice(indexC,1);
                if (myBattleArea.units[indexU].health<=0){
                    myBattleArea.units.splice(indexU,1);
                }
            }
            if (enemy.type==="R" && enemy.energy>0){
                shield={
                    x: enemy.x-enemy.width/2,
                    y: enemy.y-enemy.height/2,
                    width: enemy.width*2,
                    height: enemy.height*2
                }
                if (ball.crashWith(shield)){
                    myBattleArea.units[indexU].energy-=ball.damage;
                    myBattleArea.balls.splice(indexC,1);
                }
            }
        })
        if (ball.crashWith(player)){
            player.health-=ball.damage;
            myBattleArea.balls.splice(indexC,1);
                if (player.health<=0){
                    //Game ends
                }
        }
        if (ball.crashWith(mothership)){
            mothership.health-=ball.damage;
            myBattleArea.balls.splice(indexC,1);
                if (mothership.health<=0){
                    //Game ends
                }
        }
        
    })
    if (exploFrames>0){
        if (exploFrames>11){
          exploFrames="Hola";
        }
        myBattleArea.ctx.drawImage(explosion, exploX, exploY, 25, 25);
      }
}
    
document.onkeydown=function(e){
    switch (e.keyCode){
        case 37:
        player.moveLeft();
        break;
        case 38:
        player.moveUp();
        break;
        case 39:
        player.moveRight();
        break;
        case 40:
        player.moveDown();
        break;
        case 32:
        player.shoot();
        break;
    }
} 

document.getElementById("replicant").onclick = function(){
    if (createUnit===0){
        createUnit=1;
        unitCreate="replicant";
    }
};

document.getElementById("tempest").onclick = function(){
    if (createUnit===0){
        createUnit=1;
        unitCreate="tempest";
    }
};

document.getElementById("oracle").onclick = function(){
    if (createUnit===0){
        createUnit=1;
        unitCreate="oracle";
    }
};

myBattleArea.canvas.addEventListener('click', function(e) {
    if (createUnit===1){
        switch(unitCreate){
            case "replicant":
            if (resources>=100){
                resources-=100;
                myBattleArea.units.push(new Replicant(e.pageX-myBattleArea.canvas.offsetLeft-37.5, e.pageY-myBattleArea.canvas.offsetTop-37.5,100))
            };
            createUnit=0;
            break;
            case "tempest":
            if (resources>=200){
                resources-=200;
                myBattleArea.units.push(new Tempest(e.pageX-myBattleArea.canvas.offsetLeft-50, e.pageY-myBattleArea.canvas.offsetTop-50,100))
            };
            createUnit=0;
            break;
            case "oracle":
            if (resources>=500 && oracleTrue===false){
                oracleTrue=true;
                resources-=500;
                myBattleArea.units.push(new Oracle(e.pageX-myBattleArea.canvas.offsetLeft-37.5, e.pageY-myBattleArea.canvas.offsetTop-37.5,100))
            };
            createUnit=0;
            break;
        }
    }
})

window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);