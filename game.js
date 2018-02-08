
var myBattleArea = {
    canvas: document.createElement("canvas"),
    frames : 0,
    bg : Math.floor(Math.random()*6),
    start : function() {
        this.canvas.width = 1200;
        this.canvas.height = 500;
        this.ctx = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
       this.interval = setInterval(updateBattleArea, 20);
    },
    drawBoard: function(){
    },
    enemies: [],
    units:[],
    balls:[],
    score: function(){
      this.ctx.font = "18px serif";
      this.ctx.fillStyle = "white";
      this.ctx.fillText("Score: "+Math.floor(this.frames/100), 60, 30);
      this.ctx.fillText("Resources: "+resources, 160, 30);
    }
}