function set_viewport_dm(inner_w, inner_h){
    if (inner_w >= 1280) {
        return {"width": 500, "height": 500}
    }
    if (inner_w >= 800) {
        return {"width": 320, "height": 560}
    }
    return {"width": inner_w * 0.8, "height": inner_h * 0.4}
} 

function cartesian_y(canvas_y, canvas_height){
    return (canvas_height - canvas_y)
}

document.addEventListener("DOMContentLoaded", () => {
    var canvas_object = document.getElementById("Window")
    var paused = false
    const canvas = canvas_object.getContext("2d")
    console.log(`Screen inner width: ${window.innerWidth}, inner height: ${window.innerHeight}`)
    console.log(`Canvas width: ${canvas_object.width}, height: ${canvas_object.height}`)

    var viewport_dm = set_viewport_dm(window.innerWidth, window.innerHeight)
    canvas_object.width = viewport_dm.width;
    canvas_object.height = viewport_dm.height;
    console.log(`New canvas width: ${canvas_object.width}, height: ${canvas_object.height}`)

    const c_rad = 10
    var ratio = 1
    var c_radx = c_rad
    var c_rady = c_rad

    if (canvas_object.width > canvas_object.height) {
        ratio = canvas_object.width / canvas_object.height
        c_radx = c_radx * ratio
    } else if (canvas_object.height > canvas_object.width) {
        ratio = canvas_object.height / canvas_object.width
        c_rady = c_rady * ratio
    }

    var c_x = (canvas_object.width / 2)
    var c_y = (canvas_object.height / 2)
    const c_rot     = 0
    const c_theta0  = 0
    const c_theta1  = 2 * Math.PI
    const c_drawdir = false

    canvas.beginPath()
    canvas.ellipse(c_x, cartesian_y(c_y, canvas_object.height), c_radx, c_rady, c_rot, c_theta0, c_theta1, c_drawdir)
    canvas.fillStyle = 'red'
    canvas.fill()

    var v_x = 20
    var v_y = 2
    var a_y = -9.8
    var a_x = -1
    const dt  = 0.1
    
    canvas.clearRect(c_x - c_rad, cartesian_y(c_y, canvas_object.height) - c_rad, 2*c_rad, 2*c_rad)

    function simulate(){
        // canvas.clearRect(c_x - c_rad - 4, cartesian_y(c_y, canvas_object.height) - c_rad - 4, 2*c_rad, 2*c_rad)

        canvas.beginPath()
        canvas.ellipse(c_x, cartesian_y(c_y, canvas_object.height), c_radx + 1, c_rady + 1, c_rot, c_theta0, c_theta1, c_drawdir)
        canvas.fillStyle = 'white'
        canvas.fill()

        c_x = c_x + v_x*dt
        c_y = c_y + v_y*dt
        if (c_x >= canvas_object.width) {
            v_x = -v_x
            c_x = canvas_object.width - 1
        }
        if (c_x <= 0) {
            v_x = -v_x
            c_x = 0
        }

        if (c_y >= canvas_object.height){
            v_y = -v_y
            c_y = canvas_object.height
        }
        if (c_y <= 0){
            v_y = -v_y
            c_y = 0
        }

        // v_x = ~ no acceleration in the x direction
        v_y = v_y + a_y*dt
        canvas.beginPath()
        canvas.ellipse(c_x, cartesian_y(c_y, canvas_object.height), c_radx, c_rady, c_rot, c_theta0, c_theta1, c_drawdir)
        canvas.fillStyle = 'red'
        canvas.fill()
        requestAnimationFrame(simulate)
    }

    simulate()
})