window.onload = function() {
    
    var demoCanvas = document.getElementById("demoCanvas");
    var demoCtx = demoCanvas.getContext("2d");
    var frames = 0;
    var demoInterval = setInterval(updateDemo, 20);

    function updateDemo(){
        frames++;
        demoCtx.clearRect(0, 0, 1200, 375);
        if (frames<500){
            demoCtx.font = "40px serif";
            demoCtx.fillStyle = "white";
            demoCtx.fillText("Defend the Mothership from the Invaders!", 275, 50);
            demoCtx.drawImage(mothershipSprite, 100, 100, 200, 200);
            demoCtx.drawImage(kamikaze, 1200-frames*2, 100, 25, 25);
            demoCtx.drawImage(kamikaze, 1200-frames*2, 150, 25, 25);
            demoCtx.drawImage(kamikaze, 1200-frames*2, 200, 25, 25);
            demoCtx.drawImage(kamikaze, 1200-frames*2, 250, 25, 25);
            demoCtx.drawImage(kamikaze, 1200-frames*2, 300, 25, 25);
        }
    }
    
};

