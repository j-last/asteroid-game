


document.body.addEventListener("keydown", (ev) => keyPressed(ev.key));

function keyPressed(key) {
    console.log(key)
    if (key == "ArrowDown") {
        var newyval = document.getElementById("spaceship").style.top[-2] + 1
        console.log(newyval)
        document.getElementById("spaceship").style.top =  ""+newyval+"px"
    }
}