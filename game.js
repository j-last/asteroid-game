// imports

// Spaceship Construnction Function
function createSpaceship() {
    return {
        // attributes
        reference: document.getElementById("spaceship"),

        xpos: 50,
        ypos: 200,
        getPos: function() {
            return [this.xpos + 30, this.ypos + 30] // +30 for coords of middle & centre
        },

        xspeed: 0,
        yspeed: 0,

        rotation: 0,
        rotationspeed: 0,

        // methods
        calcSpeed: function() {
            const dragCoefficient = 0.98
            const acceleration = 0.2

            if (keys.up) { // when up key being held
                // applies acceleration in direction spaceship is facing (deg -> rad in trig functions)
                this.xspeed += acceleration * Math.cos(this.rotation * ((2 * Math.PI) / 360)) * multiplier
                this.yspeed += acceleration * Math.sin(this.rotation * ((2 * Math.PI) / 360)) * multiplier
            }
            
            // drag applied
            this.xspeed *= dragCoefficient ** multiplier
            this.yspeed *= dragCoefficient ** multiplier

            // stops silly little speeds
            if (Math.abs(this.xspeed) < 0.05) {
                this.xspeed = 0
            }
            if (Math.abs(this.yspeed) < 0.05) {
                this.yspeed = 0
            }
        },

        calcRotation: function(multiplier) {
            const dragCoefficient = 0.96
            const acceleration = 0.2

            if (keys.left) {
                this.rotationspeed -= acceleration * multiplier // rotation anti-clockwise
            }
            if (keys.right) {
                this.rotationspeed += acceleration * multiplier // rotation clockwise
            }
            
            this.rotationspeed *= dragCoefficient ** multiplier // drag applied

            // stops tiny rotations
            if (Math.abs(this.rotationspeed) < 0.05) {
                this.rotationspeed = 0
            }

            // restricts rotation to between 0 & 360
            if (this.rotation >= 360) {
                this.rotation = 0
            }
            else if (this.rotation < 0) {
                this.rotation = 360
            }
        },

        move: function(multiplier) {
            // calls functions to calculate the speed of movement + rotation for that frame
            this.calcSpeed(multiplier)
            this.calcRotation(multiplier)

            // applies these speeds to positions + rotation
            this.ypos += this.yspeed
            this.xpos += this.xspeed
            this.rotation += this.rotationspeed

            // if spaceship off screen, reappears at opposite side of screen
            gamebox = window.getComputedStyle(document.getElementById("maingamebox"))
            height = parseInt(gamebox.getPropertyValue("height"))
            width = parseInt(gamebox.getPropertyValue("width"))
            if (this.ypos > height) {
                this.ypos = -60
            }
            else if (this.ypos < -60) {
                this.ypos = height
            }
            if (this.xpos > width) {
                this.xpos = -60
            }
            else if (this.xpos < -60) {
                this.xpos = width
            }
        },

        draw: function() {
            // sets coords in css to attribute coords
            this.reference.style.top = this.ypos + "px"
            this.reference.style.left = this.xpos + "px"
            this.reference.style.rotate = this.rotation + "deg"
        },

        update: function(multiplier) {
            // all methods that should be called every frame
            this.move(multiplier)
            this.draw()
        }

    };
};

// Gate Construnction Function
function createGate(num, xpos, ypos, orientation) {
    let newgate = document.createElement("img")
    newgate.src = orientation + " yellow ring.png"
    newgate.className = orientation + "gate"
    newgate.id = "gate" + num
    parentElement = document.getElementById("maingamebox")
    parentElement.appendChild(newgate)

    newgate.style.top = ypos
    newgate.style.left = xpos

    return {
        reference: newgate,
        xpos: parseInt(window.getComputedStyle(newgate).getPropertyValue("left")),
        ypos: parseInt(window.getComputedStyle(newgate).getPropertyValue("top")),
        height: parseInt(window.getComputedStyle(newgate).getPropertyValue("height")),
        width: parseInt(window.getComputedStyle(newgate).getPropertyValue("width")),
        goneThrough: false,

        passedThrough: function(pos) {
            x = pos[0]
            y = pos[1]
            
            if (this.xpos < x && x < this.xpos + this.width) {
                if (this.ypos < y && y < this.ypos + this.height) {
                    this.reference.src = orientation + " blue ring.png"
                    this.goneThrough = true
                }
            }
        },

        draw: function() {
            this.reference.src = orientation + " blue ring.png"
        },

        getID: function() {
            return this.reference.id
        },

        update: function(pos) {
            console.log("hello")
            this.passedThrough(pos)
            this.draw()
            return this.goneThrough
        }
    }
}

// Key press functions
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
    deltatime = timeStamp - lastTimeStamp
    lastTimeStamp = timeStamp
    multiplier = deltatime * 0.06
    spaceship.update(multiplier)

    if (gates[0].update(spaceship.getPos())) {
        console.log("gate" + gates[0][0])
        document.getElementById("maingamebox").removeChild(document.getElementById(gates[0].getID()))
    };
    requestAnimationFrame(gameLoop)
}

// Initialise identifiers & call game loop
var keys = {
    up: false,
    down: false,
    left: false,
    right: false
}

document.body.addEventListener("keydown", (ev) => keyPressed(ev.key));
document.body.addEventListener("keyup", (ev) => keyUnPressed(ev.key));

var spaceship = createSpaceship()
var gates = [createGate(1, "25%", "35%", "v"), createGate(2, "50%", "35%", "v"), createGate(3, "75%", "35%", "v")]
var lastTimeStamp = 0

requestAnimationFrame(gameLoop)

