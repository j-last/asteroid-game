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

    return {
        reference: newgate,
        xpos,
        ypos,
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
            this.reference.style.top = this.ypos + "px"
            this.reference.style.left = this.xpos + "px"
        },

        update: function(pos) {
            this.passedThrough(pos)
            this.draw()
            return this.goneThrough
        }
    }
}

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
    deltatime = timeStamp - lastTimeStamp
    lastTimeStamp = timeStamp
    multiplier = deltatime * 0.06
    spaceship.update(multiplier)

    gatesDone = 0
    for (i = 0; i < level.length; i++) {
        doneGate = level[i].update(spaceship.getPos())
        if (doneGate) {
            gatesDone += 1
        }
    }
    if (gatesDone === level.length) {
        parentElement = document.getElementById("maingamebox")
        for (i = 0; i < level.length; i++) {
            parentElement.removeChild(document.getElementById("gate" + i))
        };
        
        level = getNextLevel()
    }
    requestAnimationFrame(gameLoop)
}

const levels = [
    [[300, 200, "vertical"], [600, 200, "vertical"], [1000, 100, "vertical"]],
    [[400, 500, "vertical"], [700, 500, "vertical"], [900, 400, "horizontal"], 
    [400, 100, "vertical"], [700, 100, "vertical"]],
]
var levelNum = 0
function getNextLevel() {
    level = levels[levelNum]
    levelNum += 1
    for (var i = 0; i < level.length; i ++) {
        level[i] = createGate(i, level[i][0], level[i][1], level[i][2])
    }
    return level
}

// Initialise identifiers & call game loop
const spaceship = createSpaceship()

var level = getNextLevel()



var keys = {
    up: false,
    down: false,
    left: false,
    right: false
}

var lastTimeStamp = 0

document.body.addEventListener("keydown", (ev) => keyPressed(ev.key));
document.body.addEventListener("keyup", (ev) => keyUnPressed(ev.key));

requestAnimationFrame(gameLoop)

