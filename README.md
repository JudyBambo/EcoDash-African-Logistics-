# EcoDash-African-Logistics-

## Project Description

**EcoDash** is a 2D interactive simulation game developed using **HTML5 Canvas, Vanilla JavaScript (ES6+), and CSS3**.

The player controls a medical delivery drone that must collect medical supplies from a central depot and deliver them to clinics that request assistance. The player must manage the drone's battery, avoid obstacles such as trees and birds, and complete the required deliveries before too many deliveries are missed.

The game is designed to demonstrate programming concepts including **Object-Oriented Programming (OOP), animation, keyboard controls, collision detection, mathematical calculations, game states, and local storage**.

---

## Game Objective

The objective of the game is to successfully deliver medical supplies to the clinics requesting assistance.

The player must:

1. Start the game.
2. Fly the drone to the depot.
3. Collect medical supplies.
4. Fly to the clinic requesting supplies.
5. Deliver the supplies.
6. Repeat the process for the remaining clinics.
7. Recharge the drone at solar stations when necessary.
8. Avoid collisions with trees and birds.
9. Complete all required deliveries before receiving three missed deliveries.

---

## Game World

The game takes place in a simulated Kenyan environment containing:

- A central medical supply depot
- Six medical clinics
- Solar charging stations
- Trees
- Flying birds
- A controllable medical drone

### Clinics

The six clinics in the game are:

- Oloshaiki
- Inkoiriento
- Nyamokenye
- Maugo
- Kimuka
- Lengusaka

Only one clinic requests supplies at a time.

---

## Game Controls

Arrow Up ---- Move drone upward  
Arrow Down ---- Move drone downward
Arrow Left ---- Move drone left  
Arrow Right --- Move drone right

---

## Clinic System

Clinics have different visual states depending on their status.

### White

The clinic has not yet requested supplies.

### Yellow

The clinic is currently requesting medical supplies.

### Black

The delivery was missed.

### Grey

The delivery was successfully completed.

A red medical cross is displayed on clinics that have not missed their delivery.

---

## Medical Supply System

The drone must first visit the depot before it can deliver supplies.

When the drone enters the depot:

```text
Depot → Collect Supplies → Fly to Requesting Clinic → Deliver Supplies
```

The drone can only carry one delivery at a time.

After successfully delivering supplies, the drone must return to the depot to collect supplies for the next clinic.

---

## Battery System

The drone starts with a battery level of **100%**.

The battery decreases while the drone is moving.

Collisions also reduce the battery:

- Tree collision: -10 battery
- Bird collision: -5 battery

If the battery reaches **0%**, the game ends.

The drone can recharge by visiting one of the solar stations.

---

## Solar Charging Stations

Solar stations are positioned around the game world.

When the drone enters a solar station, its battery gradually increases.

The maximum battery level is:

```text
100%
```

---

## Obstacles

The game contains two types of moving/static obstacles.

### Trees

Trees are stationary obstacles positioned throughout the game world.

When the drone collides with a tree:

- The drone is moved backwards.
- Its velocity is stopped.
- Battery power is reduced.
- A collision message is displayed.

### Birds

Birds move horizontally across the game world.

When the drone collides with a bird:

- The drone is moved backwards.
- Its velocity is stopped.
- Battery power is reduced.
- A collision message is displayed.

---

## Collision Detection

Collision detection is used to determine whether the drone has touched an obstacle, depot, solar station, or clinic.

For circular objects such as trees, birds, and clinics, the distance between the centre of the drone and the centre of the object is calculated.

The basic distance formula used is:

```text
distance = √((x₂ - x₁)² + (y₂ - y₁)²)
```

A collision occurs when the calculated distance is less than or equal to the combined collision radius.

For the depot and solar stations, rectangular collision detection is used.

---

## Mathematical Model

Mathematics is used in several parts of the simulation.

### Drone Movement

The drone has horizontal and vertical velocity:

```text
velocityX
velocityY
```

Acceleration is applied when the player presses an arrow key.

```text
velocity = velocity + acceleration
```

The drone's position is then updated:

```text
x = x + velocityX
y = y + velocityY
```

### Speed Limiting

The drone's speed is limited so that it cannot accelerate indefinitely.

```text
-5 ≤ velocity ≤ 5
```

### Distance Travelled

The distance travelled by the drone is calculated using the distance formula:

```text
distance = √(Δx² + Δy²)
```

The calculated distance is added to the drone's total distance travelled.

### Collision Calculations

The distance formula is also used when checking collisions between the drone and circular objects.

---

## Object-Oriented Programming

The game uses JavaScript classes to represent different objects.

### `Drone`

Responsible for:

- Drone position
- Drone movement
- Velocity
- Acceleration
- Battery
- Supplies
- Distance travelled
- Drawing the drone

### `Clinic`

Responsible for:

- Clinic name
- Clinic position
- Request status
- Delivery status
- Delivery timer
- Drawing the clinic
- Detecting missed deliveries

### `Depot`

Responsible for:

- Depot position
- Depot dimensions
- Drawing the medical supply depot

### `SolarStation`

Responsible for:

- Solar station position
- Solar station dimensions
- Drawing the charging station

### `Tree`

Responsible for:

- Tree position
- Tree size
- Drawing the tree

### `Bird`

Responsible for:

- Bird position
- Bird movement
- Bird direction
- Drawing the bird

---

## Technologies Used

The project was developed using:

- **HTML5**
- **CSS3**
- **JavaScript ES6+**
- **HTML5 Canvas**
- **Web Audio API**
- **Local Storage**

No external game engines or JavaScript frameworks are used.

---

## Game States

The game uses different states to control what is happening in the game.

### Start

The player sees the instructions and must select **Start Game**.

### Playing

The drone can move and all game systems are active.

### Paused

The game stops updating until the player selects **Resume**.

### Game Over

The game ends when:

- The drone's battery reaches 0%, or
- Three deliveries have been missed.

The final score and delivery statistics are displayed.

### Mission Complete

The game enters the win state after all required clinic deliveries have been successfully completed.

---

## Scoring System

The player receives points for successfully delivering medical supplies.

Each successful delivery awards:

```text
+100 points
```

The player's score is displayed on the HUD.

The game also stores a high score using the browser's `localStorage`.

---

## HUD

The Heads-Up Display provides information about the current game.

It displays:

- **Score**
- **Battery**
- **Deliveries completed**
- **Distance travelled**
- **Missed deliveries**

This allows the player to monitor their progress while playing.

---

## Sound

The game includes background music that starts when the player begins the game.

The music pauses when:

- The game is paused.
- The game ends.
- The mission is completed.

---

## How to Run the Game

### Option 1: Open the HTML file

1. Download or clone the project.
2. Open the project folder in Visual Studio Code.
3. Open `index.html` in a web browser.

### Option 2: Using Visual Studio Code

The project can be opened in Visual Studio Code and run using a local development server such as **Live Server**.

Make sure the project files maintain their folder structure, especially the audio folder.

---

## Project Structure

```text
Drone-Medical-Delivery/
│
├── index.html
├── style.css
├── script.js
│
│── Audio/
│    └── Background_Sound.mp3
└── Images/
    │── Background_Image.jpg
    └── Background_Image.jpg
```

### `index.html`

Contains the structure of the game, including:

- Canvas
- HUD
- Buttons
- Start screen
- Pause screen
- Game-over screen
- Mission-complete screen

### `style.css`

Controls the appearance and layout of the game interface.

### `script.js`

Contains the game logic, including:

- Classes
- Drone movement
- Keyboard controls
- Collision detection
- Clinic requests
- Deliveries
- Battery management
- Scoring
- Game states
- Animation

---

## Game Loop

The game uses `requestAnimationFrame()` to continuously update the game.

The animation loop:

1. Clears the canvas.
2. Updates the HUD.
3. Checks the current game state.
4. Moves the drone.
5. Moves birds.
6. Updates clinic timers.
7. Checks collisions.
8. Draws game objects.
9. Updates game information.
10. Requests the next animation frame.

This creates the continuous animation required for the simulation.

---

---

## Author

**Mamonare Judy Bambo**

Bachelor of Information Technology
Web Design and Development
