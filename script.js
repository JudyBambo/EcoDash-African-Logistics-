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

//DELIVERY POINTS (VILLAGES CLINICS) CLASS
class Clinic{
    constructor(name, x, y, color ){
        this.name = name;
        this.x = x;
        this.y = y;
        this.color = color;

        this.radius = 30; 
        this.deliveryCompleted = false;
    }

    //DRAW THE CLINICS
    drawClinic(){
        ctx.fillstyle = this.deliveryCompleted ? "gray" : "red";
        ctx.beginPath();
        ctx.arc(this.x, this.y,this.radius, 0, Math.PI*2);
        ctx.fill();
    }
}

//SUPPLIES PICKUP LOCATION
class Depot{
    contructor(x, y){
        this.x = x;
        this.y = y;

        this.width = 100;
        this.height = 50;
    }

    drawDepot(){
        ctx.beginPath();
        ctx.fillstyle = "brown";
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fill();
    }
}

//CLASS FOR TREES
class Tree{
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

//CLASS FOR Birds
class Bird {
    constructor(x, y,radius=5, color="yellow"){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;

        this.velocity = 2;
    }

    drawBird(){
        ctx.fillstyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

//CLASS FOR DustParticles
class Dust{
    constructor(x, y,){
        this.x = x;
        this.y = y;

        this.radius = 2;
        this.color = "grey";

        this.life = 30;
    }

    update() {
        this.y += 1;
        this.life --;
    }

    drawDust(){
        ctx.fillstyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

//let trees = [];

//CREATING OBJECTS
let drone = new Drone(200, 200);

//AN ARRAY OF 6 CLINICS as delivery points
let clinics = [
    new DeliveryPoint("Oloshaiki", 200, 100, "aqua"),
    new DeliveryPoint("Inkoiriento", 500, 200, "pink"),
    new DeliveryPoint("Nyamokenye", 700, 150, "blue"),
    new DeliveryPoint("Maugo", 250, 500, "purple"),
    new DeliveryPoint("Kimuka", 600, 450, "brown"),
    new DeliveryPoint("Lengusaka", 850, 550, "deeppink")
]

//Trees array creating 3 trees for now
let trees = [
    new Tree(100, 100),
    new Tree(400, 250),
    new Tree(600, 150)
];

//BIRDS ARRAY 
let birds = [
    new Bird(50, 80),
    new Bird(300, 120)
];

//DUST PARTICLES ARRAY
let dustParticles = [];

for (let index = 0; index < 50; index++) {
    const dustParticle = new Dust(Math.random()*canvas.width, Math.random()*canvas.height);
    dustParticles.push(dustParticle);
}

//DRONE COLLISSION AGAIN BIRDS AND TREES
function checkCollision(drone, tree){
    let distanceX = drone.x - tree.x;
    let distanceY = drone.y - tree.y;

    let distance = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
    return distance <= tree.radius + drone.width
}

//ANIMATE FUNCTION
function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drone.moveDrone();
    drone.drawDrone();

    //Collision check with trees
trees.forEach(tree => {
    tree.drawTree();
    if(checkCollision(drone, tree)) {
        //when drone collides with a tree it must stop

        //and it must reduce the battery

        //and show that a tree has been hit
    }
});

//Collision check with birds
birds.forEach(bird => {
    bird.drawBird();
    if(checkCollision(drone, bird)) {
        //when drone collides with a tree it must stop

        //and it must reduce the battery

        //and show that a tree has been hit
    }
});

//DRAW THE CLINICS
clinics.forEach(clinic => {
    clinic.drawClinic();
});

//CHECK IF IF THE SUPPLIES WERE DELIVERED TO THE CLINIC WHEN THE DRONE TOUCHES THE CLINIC
clinics.forEach(clinic => {
    if(checkCollision(drone, clinic) && !(clinic.deliveryCompleted)){
        clinic.deliveryCompleted = true;
        score += 100;
        console.log(clinic.name + "recieved supplies!");
    }
    
});

requestAnimationFrame(animate);

}

requestAnimationFrame(animate);