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
    const canvas = canvas_object.getContext("2d")
    console.log(`Screen inner width: ${window.innerWidth}, inner height: ${window.innerHeight}`)
    console.log(`Canvas width: ${canvas_object.width}, height: ${canvas_object.height}`)

    var viewport_dm = set_viewport_dm(window.innerWidth, window.innerHeight)
    canvas_object.width = viewport_dm.width;
    canvas_object.height = viewport_dm.height;
    console.log(`New canvas width: ${canvas_object.width}, height: ${canvas_object.height}`)

    /* 
    Scale the viewing window appropriately
    */
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

    const c_centerx = (canvas_object.width / 2)
    const c_centery = (canvas_object.height / 2)
    const c_rot     = 0
    const c_theta0  = 0
    const c_theta1  = 2 * Math.PI
    const c_drawdir = false

    canvas.beginPath()
    canvas.ellipse(c_centerx, cartesian_y(c_centery, canvas_object.height), c_radx, c_rady, c_rot, c_theta0, c_theta1, c_drawdir)
    canvas.fillStyle = 'red'
    canvas.fill()

})