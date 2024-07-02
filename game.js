// imports


// Spaceship Construnction Function
function createSpaceship() {
    return {
        // attributes
        reference: document.getElementById("spaceship"),

        xpos: 0,
        ypos: 0,

        speed: 0,
        xspeed: 0,
        yspeed: 0,

        acceleration: 1,

        rotation: 0,
        rotationspeed: 0,

        // methods
        move: function() {
            // use of (1 / exponential) to decrease acceleration as speed increases (CHANGE TO USE DRAG EQUATION, THRUST FORCE & F=MA)
            this.acceleration = 1 / (1.5 ** Math.abs(this.speed))

            // applies acceleration to speed & rotation
            if (keys.up) {
                this.speed += this.acceleration
            }
            if (keys.down) {
                this.speed -= this.acceleration
            }
            if (keys.left) {
                this.rotationspeed -= 0.2
            }
            if (keys.right) {
                this.rotationspeed += 0.2
            }

            // current inplementation of drag (to change)
            this.speed *= 0.99
            this.rotationspeed *= 0.99

            // stops silly little accelerations
            if (Math.abs(this.speed) < 0.1) {
                this.speed = 0
            }

            // applies speed to position & rotation attributes
            this.ypos += this.speed * Math.sin(this.rotation * ((2*Math.PI)/360))
            this.xpos += this.speed * Math.cos(this.rotation * ((2*Math.PI)/360))
            this.rotation += this.rotationspeed
            // restricts rotation to between 0 & 360
            if (this.rotation >= 360) {
                this.rotation = 0
            }
            else if (this.rotation <= 0) {
                this.rotation = 360
            }
        },

        draw: function() {
            // sets coords in css to attribute coords
            this.reference.style.top = this.ypos + "px"
            this.reference.style.left = this.xpos + "px"
            this.reference.style.rotate = this.rotation + "deg"
        },

        update: function() {
            // all methods that should be called every frame
            this.move()
            this.draw()
        }

    };
};


// Misc Functions
function keyPressed(key) {
    if (key == "ArrowUp") {
        keys.up = true
    }
    else if (key == "ArrowDown") {
        keys.down = true
    }
    else if (key == "ArrowLeft") {
        keys.left = true
    }
    else if (key == "ArrowRight") {
        keys.right = true
    }
}

function keyUnPressed(key) {
    if (key == "ArrowUp") {
        keys.up = false
    }
    else if (key == "ArrowDown") {
        keys.down = false
    }
    else if (key == "ArrowLeft") {
        keys.left = false
    }
    else if (key == "ArrowRight") {
        keys.right = false
    }
}


// Main Game Loop
function gameLoop(timeStamp) {
    spaceship.update()
    requestAnimationFrame(gameLoop)
}


// Initialise identifiers & call game loop
const spaceship = createSpaceship()
var keys = {
    up: false,
    down: false,
    left: false,
    right: false
}
document.body.addEventListener("keydown", (ev) => keyPressed(ev.key));
document.body.addEventListener("keyup", (ev) => keyUnPressed(ev.key));
requestAnimationFrame(gameLoop)
