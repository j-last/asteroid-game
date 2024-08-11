// imports

// Spaceship Construnction Function
function createSpaceship(ypos, xpos) {
    reference = document.getElementById("spaceship")
    reference.style.top = ypos
    newypos = parseInt(window.getComputedStyle(reference).getPropertyValue("top")) - parseInt(window.getComputedStyle(reference).getPropertyValue("height")) / 2
    reference.style.top = newypos + "px"
    
    reference.style.left = xpos
    newxpos = parseInt(window.getComputedStyle(reference).getPropertyValue("left")) - parseInt(window.getComputedStyle(reference).getPropertyValue("width")) / 2
    reference.style.left = newxpos + "px"

    return {
        // attributes
        reference: document.getElementById("spaceship"),

        xpos: parseInt(window.getComputedStyle(reference).getPropertyValue("left")),
        ypos: parseInt(window.getComputedStyle(reference).getPropertyValue("top")),
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
            const acceleration = 0.15

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
            const dragCoefficient = 0.97
            const acceleration = 0.15

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
    newgate.src = orientation + " red ring.png"
    newgate.className = orientation + "gate"
    newgate.id = "gate" + num
    parentElement = document.getElementById("maingamebox")
    parentElement.appendChild(newgate)

    newgate.style.top = ypos 
    newypos = parseInt(window.getComputedStyle(newgate).getPropertyValue("top")) - parseInt(window.getComputedStyle(newgate).getPropertyValue("height")) / 2
    newgate.style.top = newypos + "px"

    newgate.style.left = xpos
    newxpos = parseInt(window.getComputedStyle(newgate).getPropertyValue("left")) - parseInt(window.getComputedStyle(newgate).getPropertyValue("width")) / 2
    newgate.style.left = newxpos + "px"

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
                    this.goneThrough = true
                }
            }
        },

        makeYellow: function() {
            this.reference.src = orientation + " yellow ring.png"
        },

        getID: function() {
            return this.reference.id
        },

        update: function(pos) {
            this.passedThrough(pos)
            this.reference.src = orientation + " blue ring.png"
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
        document.getElementById("maingamebox").removeChild(document.getElementById(gates[0].getID()))
        newgatenum = gates[2][0] + 1
        newgate_x = String(Math.floor(Math.random() * 90) + 5) +"%"
        newgate_y = String(Math.floor(Math.random() * 90) + 5) +"%"
        orientationnum = Math.random()
        if (orientationnum < 0.5) {newgateorientation = "v"}
        else {newgateorientation = "h"}
        gates[2].makeYellow()
        gates = [gates[1], gates[2], createGate(newgatenum, newgate_x, newgate_y, newgateorientation)]
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

var spaceship = createSpaceship("50%", "10%")
var gates = [createGate(1, "25%", "50%", "v"), createGate(2, "50%", "50%", "v"), createGate(3, "75%", "50%", "v")]
gates[1].makeYellow()
var lastTimeStamp = 0

requestAnimationFrame(gameLoop)

