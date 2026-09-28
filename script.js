let canvas = document.getElementById("canvas");
canvas.width = 2600;
canvas.height = 1900;

let ctx = canvas.getContext("2d");

let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let missedDeliveries = 0;
let completedDeliveries = 0;
let gameMessage = "";
let messageTimer = 0;
let backgroundSound = new Audio("Audio/Background_Sound.mp3");


//GAME STATE
let gameState = "start";

//control keys array
let keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
};

//START GAME LOGIC
let startButton = document.getElementById("startButton");
startButton.addEventListener("click", function () {
    gameState = "playing";
    backgroundSound.play();
    document.getElementById("startScreen").style.display = "none";

});

//GAME PAUSE LOGIC
let pauseButton = document.getElementById("pauseButton");
pauseButton.addEventListener("click", function () {

    if (gameState === "playing") {
        gameState = "paused";
        backgroundSound.pause();
        document.getElementById("pauseScreen").style.display = "flex";
    }

});

//RESUME LOGIC
let resumeButton = document.getElementById("resumeButton");
resumeButton.addEventListener("click", function () {
    gameState = "playing";
    backgroundSound.play();
    document.getElementById("pauseScreen").style.display = "none";
});

//RESTART LOGIC
let restartButton = document.getElementById("restartButton");
function resetGame() {
    
    keys.ArrowUp = false;
    keys.ArrowDown = false;
    keys.ArrowLeft = false;
    keys.ArrowRight = false;

    // Scores
    score = 0;
    missedDeliveries = 0;
    completedDeliveries = 0;

    // Messages
    gameMessage = "";
    messageTimer = 0;

    // Game state
    gameState = "playing";

    // Reset drone
    drone.x = depot.x + depot.width + 20;
    drone.y = depot.y + depot.height / 2 - 32;

    drone.velocityX = 0;
    drone.velocityY = 0;

    drone.battery = 100;
    drone.hasSupplies = false;
    drone.distanceTravelled = 0;

    // Reset clinic tracking
    currentClinic = 0;

    clinics.forEach(clinic => {
        clinic.deliveryCompleted = false;
        clinic.deliveryMissed = false;
        clinic.requesting = false;
        clinic.timeLimit = 60;

    });

    clinics[0].requesting = true;

    // Hide screens
    document.getElementById("gameOverScreen").style.display = "none";
    document.getElementById("winScreen").style.display = "none";
    document.getElementById("pauseScreen").style.display = "none";
    // Restart music
    backgroundSound.play();
}
restartButton.addEventListener("click", function () {
    resetGame();
});

// GAMEOVER SCREEN
function showGameOver() {
    backgroundSound.pause();
    document.getElementById("gameOverScreen").style.display = "flex";
    document.getElementById("finalScore").textContent = score;
    document.getElementById("completedDeliveries").textContent = completedDeliveries;
    document.getElementById("missedDeliveries").textContent = missedDeliveries;
};

// WIN SCREEN
function showWinScreen() {
    backgroundSound.pause();
    document.getElementById("winScreen").style.display = "flex";
    document.getElementById("winScore").textContent = score;
    document.getElementById("winDeliveries").textContent = completedDeliveries;
}

//DRONE CLASS
class Drone {
    //CONSTRUCTOR
    constructor(x, y, color = "cyan") {
        this.x = x;
        this.y = y;
        this.color = color;

        this.width = 100;
        this.height = 95;

        this.velocityX = 0;
        this.velocityY = 0;
        this.acceleration = 0.05;
        this.hasSupplies = false;
        this.battery = 100;
        this.distanceTravelled = 0;
    }

    //METHOD TO DRAW A DRONE
    drawDrone() {
        // body
        ctx.fillStyle = "cyan";
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Drone Propelors 
        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.arc(this.x, this.y, 20, 0, Math.PI * 2);
        ctx.arc(this.x + this.width, this.y, 20, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath()
        ctx.arc(this.x, this.y + this.height, 20, 0, Math.PI * 2);
        ctx.arc(this.x + this.width, this.y + this.height, 20, 0, Math.PI * 2);
        ctx.stroke();
    }

    //METHOD TO MOVE THE DRONE
    moveDrone() {

        //contollers
        if (keys.ArrowUp) { this.velocityY -= this.acceleration }
        if (keys.ArrowDown) { this.velocityY += this.acceleration }
        if (keys.ArrowLeft) { this.velocityX -= this.acceleration }
        if (keys.ArrowRight) { this.velocityX += this.acceleration }

        // Slow down when no horizontal key is pressed
        if (!keys.ArrowLeft && !keys.ArrowRight) {
            this.velocityX *= 0.95;
        }

        // Slow down when no vertical key is pressed
        if (!keys.ArrowUp && !keys.ArrowDown) {
            this.velocityY *= 0.95;
        }

        // Slow down when no horizontal key is pressed
        if (!keys.ArrowLeft && !keys.ArrowRight) {
            this.velocityX *= 0.95;
        }


        let initialX = this.x;
        let initialY = this.y;

        //SPEED LIMITT
        this.velocityX = Math.max(-5, Math.min(5, this.velocityX));
        this.velocityY = Math.max(-5, Math.min(5, this.velocityY));

        //Position update
        this.x += this.velocityX;
        this.y += this.velocityY;


        //Calculating the distance between 2 points
        let distance = Math.sqrt(Math.pow(this.x - initialX, 2) + Math.pow(this.y - initialY, 2));

        //Add the distance to the distanceTravelled
        this.distanceTravelled += distance;

        //boundries, if the drone hits the walls, it must stop
        if (this.y <= 0 || this.y + this.height >= canvas.height) {
            this.velocityY = 0;
            this.velocityX = 0;
        }
        if (this.x <= 0 || this.x + this.width >= canvas.width) {
            this.velocityX = 0;
            this.velocityY = 0;
        }

        //drain the drone's battery as it moves
        this.battery -= 0.02;

        //check if battery is empty
        if (this.battery <= 0) {
            this.battery = 0;
            //End the game
            gameState = "gameover";
            showGameOver();
        }
    }
}

//DELIVERY POINTS (VILLAGES CLINICS) CLASS
class Clinic {
    constructor(name, x, y, color) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.color = color;

        this.radius = 150;
        this.deliveryCompleted = false;
        this.deliveryMissed = false;

        //Have over clinic request for supplies at a time
        this.timeLimit = 60;
        this.requesting = false;
    }

    //DRAW THE CLINICS
    drawClinic() {

        // Circle colour
        if (this.deliveryMissed) {
            ctx.fillStyle = "black";
        }
        else if (this.requesting) {
            ctx.fillStyle = "yellow";
        }
        else if (this.deliveryCompleted) {
            ctx.fillStyle = "gray";
        }
        else {
            ctx.fillStyle = "white";
        }
        // Draw circle
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        //Write name of each clinic
        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.font = "bolder 40px Arial";
        ctx.fillText(this.name, this.x - 80, this.y - this.radius - 5);
        ctx.fill();

        // Missed deliveries get NO cross
        if (this.deliveryMissed) {
            return;
        }

        // Drawing the Red cross
        ctx.fillStyle = "red";
        // Vertical bar
        ctx.fillRect(this.x - 15, this.y - 60, 30, this.radius - 30);
        // Horizontal bar
        ctx.fillRect(this.x - 60, this.y - 15, 120, 30);
    }

    //UPDATE METHOD
    update() {

        //timer countdown for deliveries
        if (this.requesting && !this.deliveryCompleted) {
            this.timeLimit -= 1 / 60;
        }

        //timeout logic
        if (
            this.requesting &&
            this.timeLimit <= 0 &&
            !this.deliveryCompleted
        ) {
            this.deliveryMissed = true;
            this.requesting = false;
            missedDeliveries++;
            gameMessage = this.name + " delivery missed!";
            messageTimer = 120;

            if(missedDeliveries >= 3){
                gameState = "gameover";
                showGameOver();
            }else{
                nextClinic();
            }
        }
    }
}

//SUPPLIES PICKUP LOCATION
class Depot {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.width = 300;
        this.height = 200;
    }

    drawDepot() {
        ctx.fillStyle = "gray";
        ctx.fillRect(this.x, this.y, this.width, this.height);

        ctx.fillStyle = "black";
        ctx.font = "bolder 40px Arial";
        ctx.fillText("DEPOT", this.x + 90, this.y + 110);
    }
}

//SOLOAR STATION CLASS
class SolarStation {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 200;
        this.height = 150;
    }

    drawSolarStation() {
        ctx.fillStyle = "darkblue";
        ctx.fillRect(this.x, this.y, this.width, this.height);

        ctx.strokeStyle = "white";

        for(let i = 0; i < this.width; i += 25){
            ctx.beginPath();
            ctx.moveTo(this.x + i, this.y);
            ctx.lineTo(this.x + i, this.y + this.height);
            ctx.stroke();
        }
    }
}

//CLASS FOR TREES
class Tree {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = "green";
    }

    //METHOD TO DRAW A TREE
    drawTree() {
        //Tree trunk
        ctx.beginPath();
        ctx.fillStyle = "brown";
        ctx.fillRect(this.x - 15, this.y + this.radius, 30, 40);

        //Tree top
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

//CLASS FOR Birds
class Bird {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.color = "orange";
        this.radius = 10;
        this.velocity = 2;
        this.direction = 1;
    }

    drawBird() {
        //bird flaps
        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(this.x - 10, this.y, this.radius, 0, Math.PI);
        ctx.stroke();

        //bird body
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI);
        ctx.fill();
    }

    moveBird(){
        this.x += this.velocity * this.direction;
        
        if (this.x + this.radius >= canvas.width){
            this.direction = -1;
        }
        if (this.x - this.radius <= 0){
            this.direction = 1;
        }
    }
}

//CREATING OBJECTS
let depot = new Depot(1150, 1650);

let drone = new Drone(depot.x + depot.width + 20, depot.y + depot.height / 2 - 32,);

//AN ARRAY OF 6 CLINICS as delivery points
let clinics = [
    new Clinic("Oloshaiki", 420, 380),
    new Clinic("Inkoiriento", 1290, 300),
    new Clinic("Nyamokenye", 2200, 470),
    new Clinic("Maugo", 560, 1420),
    new Clinic("Kimuka", 1500, 1180),
    new Clinic("Lengusaka", 2250, 1560)
];

let currentClinic = 0;
clinics[currentClinic].requesting = true;
//Function to control clinics supplies requests
function nextClinic() {

    clinics[currentClinic].requesting = false;
    //next clinic
    currentClinic++;
    if (currentClinic < clinics.length) {
        clinics[currentClinic].requesting = true;
        clinics[currentClinic].timeLimit = 30;
    }
};

//Solar stations array
let solarStations = [
    new SolarStation(650, 700),
    new SolarStation(1900, 880),
    new SolarStation(1180, 520),
    new SolarStation(2350, 1150),
];

//Trees array creating 21 trees for now
let trees = [
        // TOP AREA
    new Tree(150, 250, 30),
    new Tree(800, 150, 60),
    new Tree(1500, 250, 30),
    new Tree(2100, 180, 60),

    // MIDDLE AREA
    new Tree(350, 700, 30),
    new Tree(950, 600, 60),
    new Tree(1700, 700, 30),
    new Tree(2350, 600, 60),

    // LOWER-MIDDLE AREA
    new Tree(200, 1100, 30),
    new Tree(750, 1000, 60),
    new Tree(1900, 1050, 60),
    new Tree(2400, 1000, 30),

    // BOTTOM AREA
    new Tree(400, 1450, 60),
    new Tree(1000, 1400, 30),
    new Tree(1750, 1450, 60),
    new Tree(2150, 1350, 30),

    // VERY BOTTOM
    new Tree(250, 1750, 30),
    new Tree(1000, 1750, 60),
    new Tree(1900, 1750, 30),
    new Tree(2400, 1700, 60),
];

//BIRDS ARRAY 
let birds = [
    new Bird(50, 80),
    new Bird(300, 120),
    new Bird(900, 400),
    new Bird(1600, 250),
    new Bird(2100, 900),
    new Bird(700, 1300),
    new Bird(1800, 1500),
];

//DRONE COLLISSION AGAIN obstacles(birds & trees)
function checkCollision(drone, obstacle) {
    let droneCenterX = drone.x + drone.width / 2;
    let droneCenterY = drone.y + drone.height / 2;

    let distanceX = droneCenterX - obstacle.x;
    let distanceY = droneCenterY - obstacle.y;

    let distance = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
    return distance <= obstacle.radius + drone.width / 2;
}

//COLISION DETECTION FOR DRONE AND DEPOT TO PICK UP SUPPLIES
function checkDepotCollision(drone, depot) {
    return (
        drone.x <= depot.x + depot.width &&
        drone.x + drone.width >= depot.x &&
        drone.y <= depot.y + depot.height &&
        drone.y + drone.height >= depot.y
    );
}

//Keybod controlls (aarows)
document.addEventListener("keydown", function (event) {
    if (event.key in keys) {
        keys[event.key] = true;
    }
});
document.addEventListener("keyup", function (event) {
    if (event.key in keys) {
        keys[event.key] = false;
    }
});

//ANIMATE FUNCTION
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //UPDATE HUD
    document.getElementById("score").textContent = score;
    document.getElementById("battery").textContent = Math.floor(drone.battery) + "%";
    document.getElementById("delivered").textContent = completedDeliveries;
    document.getElementById("distance").textContent = Math.floor(drone.distanceTravelled/100) + "km";
    document.getElementById("missed").textContent = missedDeliveries;

    if (gameState === "playing") {
        drone.moveDrone();
        drone.drawDrone();

        //CHECKS IF THERES MESSEGE TIMER SET, DISPLY THE MESSAGE AND REDUCE THE TIMER
        if (messageTimer > 0) {
            ctx.fillStyle = "red";
            ctx.fillText(gameMessage, 50, 100);
            messageTimer--;
        }

        depot.drawDepot();
        //check if the drone collides with the depot and has no supplies, then collect supplies
        if (checkDepotCollision(drone, depot) && !drone.hasSupplies) {
            drone.hasSupplies = true;
            gameMessage = "Supplies collected!";
            messageTimer = 60;
        }

        //Collision check with trees
        trees.forEach(tree => {
            tree.drawTree();
            if (checkCollision(drone, tree)) {
                //when drone collides with a tree it must move back
                drone.x -= drone.velocityX * 20;
                drone.y -= drone.velocityY * 20;

                // it must stop
                drone.velocityX = 0;
                drone.velocityY = 0;

                //and it must drain the battery
                drone.battery -= 10;

                //and show that a tree has been hit
                gameMessage = "Tree hit!";
                messageTimer = 60;
            }
        });

        //Collision check with birds
        birds.forEach(bird => {
            bird.moveBird();
            bird.drawBird();
            if (checkCollision(drone, bird)) {
                //when drone collides with a bird it must move back
                drone.x -= drone.velocityX * 20;
                drone.y -= drone.velocityY * 20;

                //when drone collides with a bird it must stop
                drone.velocityX = 0;
                drone.velocityY = 0;

                //and it must drain the battery
                drone.battery -= 5;

                //and show that a bird has been hit
                gameMessage = "Bird hit!";
                messageTimer = 60;
            }
        });

        //DRAW THE CLINICS
        clinics.forEach(clinic => {
            clinic.update();
            clinic.drawClinic();
        });

        //CHECK IF IF THE SUPPLIES WERE DELIVERED TO THE CLINIC WHEN THE DRONE TOUCHES THE CLINIC
        clinics.forEach(clinic => {
            if (
                checkCollision(drone, clinic) &&
                clinic.requesting &&
                !(clinic.deliveryCompleted) &&
                drone.hasSupplies
            ) {
                clinic.deliveryCompleted = true;
                completedDeliveries++;
                score += 100;
                drone.hasSupplies = false;

                gameMessage = clinic.name + " recieved supplies!";
                messageTimer = 60;
                
                //Check if all clinics recieved their supplies including the the clinics that missed
                if(completedDeliveries === clinics.length)
                {
                    gameState = "win";
                    showWinScreen();
                }else{
                    //The next clinic makes a request as soon as delivery is completed
                    nextClinic();
                } 
            }
        });

        //Draw the solar stations
        solarStations.forEach(solarStation => {
            solarStation.drawSolarStation();
        });

        //Recharge at Solar Stations
        solarStations.forEach(solarStation => {
            if (checkDepotCollision(drone, solarStation)) {
                drone.battery += 0.2;

                if (drone.battery >= 100) {
                    drone.battery = 100;
                }
            }
        });

        //HIGHSCORE LOGIC
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore);
        }
    }
    requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

