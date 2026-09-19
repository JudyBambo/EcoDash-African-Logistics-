let canvas = document.getElementById("canvas");
canvas.width = 3000;
canvas.height = 2000;

let ctx = canvas.getContext("2d");

//DRONE CLASS
class Drone {
    //CONSTRUCTOR
    constructor (x, y, color = "green"){
        this.x = x;
        this.y = y; 
        this.color = color;

        this.width = 20;
        this.height = 20;

        this.velocityX = 1;
        this.velocityY = 0;
        this.acceleration = 0.1;
    }

    //METHOD TO DRAW A DRONE
    drawDrone (){
        ctx.beginPath();
        ctx.fillstyle = this.color;
        ctx.fillrect(this.x, this.y, this.width, this.height);
        ctx.fill();
    }

    //METHOD TO MOVE THE DRONE
    moveDrone (){

        this.drawDrone();
        //contollers
        if(keys.ArrowUp) {this.velocityY -= this.acceleration}
        if(keys.ArrowDown) {this.velocityY += this.acceleration}
        if(keys.ArrowLeft) {this.velocityX -= this.acceleration}
        if(keys.ArrowRight) {this.velocityX += this.acceleration}

        //Position update
        this.x += this.velocityX;
        this.y += this.velocityY;

        //boundries, if the drone hits the walls, it must stop
        if (this.y <= 0 || this.y + this.height >= canvas.height){
            this.velocityY = 0;
            this.velocityX = 0;
        }
        if(this.x <= 0 || this.x + this.width >= canvas.width){
            this.velocityX = 0;
            this.velocityY = 0;
        }

    }

}

//CLASS FOR TREES
class Trees{

    constructor(x, y, radius, color="green"){

        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    //METHOD TO DRAW A TREE
    drawTree(){
        
        ctx.fillstyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

    }

}