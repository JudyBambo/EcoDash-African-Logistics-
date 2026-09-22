let canvas = document.getElementById("canvas");
canvas.width = innerWidth;
canvas.height = innerHeight;

let ctx = canvas.getContext("2d");

let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let missedDeliveries = 0;
let gameOver = false;
let gameStarted = false;
let gamePaused = false;

//DRONE CLASS
class Drone {
    //CONSTRUCTOR
    constructor (x, y, color = "green"){
        this.x = x;
        this.y = y; 
        this.color = color;

        this.width = 50;
        this.height = 50;

        this.velocityX = 1;
        this.velocityY = 0;
        this.acceleration = 0.1;
        this.hasSupplies = false;
        this.battery = 100;
        this.distanceTravelled = 0;
    }

    //METHOD TO DRAW A DRONE
    drawDrone (){
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fill();
    }

    //METHOD TO MOVE THE DRONE
    moveDrone (){

        //contollers
        if(keys.ArrowUp) {this.velocityY -= this.acceleration}
        if(keys.ArrowDown) {this.velocityY += this.acceleration}
        if(keys.ArrowLeft) {this.velocityX -= this.acceleration}
        if(keys.ArrowRight) {this.velocityX += this.acceleration}

        let initialX = this.x;
        let initialY = this.y;

        //Position update
        this.x += this.velocityX;
        this.y += this.velocityY;

        //Calculating the distance between 2 points
        let distance = Math.sqrt(Math.pow(this.x - initialX, 2) + Math.pow(this.y - initialY, 2));

        //Add the distance to the distanceTravelled
        this.distanceTravelled += distance;

        //Display the distance
        ctx.fillText("Distance Travelled: " + Math.floor(drone.distanceTravelled), 20, 80);


        //boundries, if the drone hits the walls, it must stop
        if (this.y <= 0 || this.y + this.height >= canvas.height){
            this.velocityY = 0;
            this.velocityX = 0;
        }
        if(this.x <= 0 || this.x + this.width >= canvas.width){
            this.velocityX = 0;
            this.velocityY = 0;
        }

        //drain the drone's battery as it moves
        this.battery -= 0.02;

        //check if battery is empty
        if(this.battery <= 0){
            this.battery = 0;
            //End the game
            gameOver = true;
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
        this.timeLimit = 30;
    }

    //DRAW THE CLINICS
    drawClinic(){
        ctx.fillStyle = this.deliveryCompleted ? "gray" : "red";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        ctx.fill();
    }

    //UPDATE METHOD
    update(){

        //timer countdown for deliveries
        if(!this.deliveryCompleted){
            this.timeLimit -= 1/60;
        }

        //timeout logic
        if(
            this.timeLimit <= 0 &&
            !this.deliveryCompleted
        ){
            this.deliveryCompleted = true;
            missedDeliveries++;
            alert(this.name + "delivery missed!");
        }


        //Missed Deliveries display
        ctx.fillText("Missed Deliveries: " + missedDeliveries, 20, 120);

        ctx.fillStyle = "black";
        ctx.fillText(Math.ceil(this.timeLimit), this.x - 10, this.y - 40);
    }
}

//SUPPLIES PICKUP LOCATION
class Depot{
    constructor(x, y){
        this.x = x;
        this.y = y;

        this.width = 100;
        this.height = 50;
    }

    drawDepot(){
        ctx.beginPath();
        ctx.fillStyle = "brown";
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fill();
    }
}

//SOLOAR STATION CLASS
class SolarStation {
    constructor(x, y){
        this.x = x;
        this.y = y;

        this.radius = 30;
    }

    drawSolarStation(){
        ctx.fillStyle = "blue";
        ctx.fillRect(this.x - 25, this.y - 15, 50, 30);

        //Charging symbol
        ctx.beginPath();
        ctx.moveTo(this.x - 5, this.y - 10);
        ctx.lineTo(this.x + 5, this.y - 10);
        ctx.lineTo(this.x, this.y);
        ctx.lineTo(this.x + 8, this.y);
        ctx.lineTo(this.x - 5, this.y + 12);
        ctx.fill();
    }
}

//CLASS FOR TREES
class Tree{
    constructor(x, y, radius = 30, color="green"){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    //METHOD TO DRAW A TREE
    drawTree(){
        ctx.fillStyle = this.color;
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
        ctx.fillStyle = this.color;
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

        //controls how long the dust lasts
        this.life = 30;
    }

    update() {
        this.y += 1;
        this.life --;
    }

    drawDust(){
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

//let trees = [];

//CREATING OBJECTS

let drone = new Drone(200, 200);

let depot = new Depot(100, 100);

//AN ARRAY OF 6 CLINICS as delivery points
let clinics = [
    new Clinic("Oloshaiki", 200, 100, "aqua"),
    new Clinic("Inkoiriento", 500, 200, "pink"),
    new Clinic("Nyamokenye", 700, 150, "blue"),
    new Clinic("Maugo", 250, 500, "purple"),
    new Clinic("Kimuka", 600, 450, "brown"),
    new Clinic("Lengusaka", 850, 550, "deeppink")
]

//Solar stations array
let solarStations = [
    new SolarStation(300, 200),
    new SolarStation(700, 150),
    new SolarStation(500, 500)
];


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

//create the dust particles and store them in the array
for (let index = 0; index < 50; index++) {
    const dustParticle = new Dust(Math.random()*canvas.width, Math.random()*canvas.height);
    dustParticles.push(dustParticle);
}

//DRONE COLLISSION AGAIN obstacles(birds & trees)
function checkCollision(drone, obstacle){
    let droneCenterX =  drone.x + drone.width / 2;
    let droneCenterY = drone.y + drone.height / 2;

    let distanceX = droneCenterX - obstacle.x;
    let distanceY = droneCenterY - obstacle.y;

    let distance = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
    return distance <= obstacle.radius + drone.width / 2;
}

//COLISION DETECTION FOR DRONE AND DEPOT TO PICK UP SUPPLIES
function checkDepotCollision(drone, depot){
    return(
        drone.x <= depot.x + depot.width &&
        drone.x + drone.width >= depot.x &&
        drone.y <= depot.y + depot.height &&
        drone.y + drone.height >= depot.y
    );
}

//ANIMATE FUNCTION
function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillText("High Score: " + highScore, 20, 60);

    drone.moveDrone();
    drone.drawDrone();
    depot.drawDepot();

    //check if the drone collides with the depot and has no supplies, then collect supplies
    if(checkDepotCollision(drone, depot) && !drone.hasSupplies){
        drone.hasSupplies = true;
        alert("Supplies collected!")
    }

    //Collision check with trees
    trees.forEach(tree => {
        tree.drawTree();
        if(checkCollision(drone, tree)) {

            //when drone collides with a tree it must move back
            drone.x -= drone.velocityX;
            drone.y -= drone.velocityY;

            // it must stop
            drone.velocityX = 0;
            drone.velocityY = 0;

            //and it must reduce the battery
            drone.battery -= 10;

            //and show that a tree has been hit
            alert("Tree hit!")
        }
    });

    //Collision check with birds
    birds.forEach(bird => {
        bird.drawBird();
        if(checkCollision(drone, bird)) {

            //when drone collides with a tree it must move back
            drone.x -= drone.velocityX;
            drone.y -= drone.velocityY;

            //when drone collides with a bird it must stop
            drone.velocityX = 0;
            drone.velocityY = 0;

            //and it must reduce the battery
            drone.battery -= 5;

            //and show that a bird has been hit
            console.log("Bird hit!")
        }
    });

    //DRAW THE CLINICS
    clinics.forEach(clinic => {
        clinic.update();
        clinic.drawClinic();
    });

    //CHECK IF IF THE SUPPLIES WERE DELIVERED TO THE CLINIC WHEN THE DRONE TOUCHES THE CLINIC
    clinics.forEach(clinic => {
        if(checkCollision(drone, clinic) &&
        !(clinic.deliveryCompleted) &&
        drone.hasSupplies){
            clinic.deliveryCompleted = true;
            score += 100;
            drone.hasSupplies = false;
            alert(clinic.name + "recieved supplies!");
        }
        
    });

    //Draw the solar stations
    solarStations.forEach(solarStation => {
        solarStation.drawSolarStation();
    });

    //Recharge at Solar Stations
    solarStations.forEach(solarStation => {
        if(checkCollision(drone, solarStation)){
            drone.battery += 0.2;

            if(drone.battery >= 100){
                drone.battery = 100;
            }
        }
    });

    //BATTERY DISPLAY
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Battery: " + Math.floor(drone.battery) + "%", 20, 30);

    //HIGHSCORE LOGIC
    if(score > highScore){
    highScore = score;
    localStorage.setItem("highScore", highScore);
    }

    //REMOVING THE DUST PARTICLES
    //Loops through the dustParticles array from the last item backwards
    for(let i = dustParticles.length - 1; i >= 0; i--){

        dustParticles[i].update();
        dustParticles[i].drawDust();

        //If the particle ran out of life, it is removed from the array
        if(dustParticles[i].life <= 0){
            dustParticles.splice(i, 1);
        }
    }

    requestAnimationFrame(animate);

}

requestAnimationFrame(animate);