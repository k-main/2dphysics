function get_canvas_dm(inner_w, inner_h){
    if (inner_w >= 1280) {
        return {"width": 600, "height": 500}
    }
    if (inner_w >= 800) {
        return {"width": 320, "height": 560}
    }
    return {"width": inner_w * 0.8, "height": inner_h * 0.4}
} 

function cartesian_y(canvas_y, canvas_height){
    return (canvas_height - canvas_y)
}

class Point {
    mass;
    x;
    y;
    v_x;
    v_y;
    rad;
    color;
    radx;
    rady;

    constructor(mass, x, y, rad, color, v_x, v_y, canvw, canvh) {
        this.mass
        this.x = x
        this.y = y
        this.v_x = v_x
        this.v_y = v_y
        this.rad = rad
        this.color = color
        this.update_rad(canvw, canvh)
    }

    update_rad(canvas_object_width, canvas_object_height){
        this.radx = this.rad
        this.rady = this.rad
        
        if (canvas_object_width != canvas_object_height) {
            this.rady = this.rady * (canvas_object_width / canvas_object_height)
            this.radx = this.radx * (canvas_object_width / canvas_object_height)
        }
    }

}

document.addEventListener("DOMContentLoaded", () => {
    var canvas_object = document.getElementById("Window")
    var paused = false
    const canvas = canvas_object.getContext("2d")
    console.log(`Screen inner width: ${window.innerWidth}, inner height: ${window.innerHeight}`)

    var canvas_dm = get_canvas_dm(window.innerWidth, window.innerHeight)
    canvas_object.width = canvas_dm.width;
    canvas_object.height = canvas_dm.height;
    console.log(`New canvas width: ${canvas_object.width}, height: ${canvas_object.height}`)

    var inner_dimensions = {"width" : window.innerWidth, "height" : window.innerHeight}

    function draw_pt(point, visible=true) {
        const c_theta0 = 0
        const c_theta1 = 2 * Math.PI

        let radx = point.radx, rady = point.rady
        let color = point.color
        canvas.beginPath()
        if (visible == false) {
            radx += 1
            rady += 1
            color = 'white'
        }

        canvas.fillStyle = color
        canvas.ellipse(point.x, cartesian_y(point.y, canvas_object.height), radx, rady, 0, c_theta0, c_theta1, false);
        canvas.fill()
    }

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


    var a_y = -9.8
    const dt  = 0.1
    
    const p = new Point(
        1,
        (canvas_object.width / 2),
        (canvas_object.height / 2),
        c_rad,
        'red',
        20,
        2,
        canvas_object.width,
        canvas_object.height
    )
    

    function simulate(){
        draw_pt(p, false)
        var current_inner_dimensions = {"width" : window.innerWidth, "height" : window.innerHeight}

        if (current_inner_dimensions != inner_dimensions) {
            canvas_dm = get_canvas_dm(window.innerWidth, window.innerHeight)
            canvas_object.width = canvas_dm.width;
            canvas_object.height = canvas_dm.height;
            console.log(`New canvas dimensions: ${canvas_dm.width} by ${canvas_dm.height}`)
            p.update_rad(canvas_object.width, canvas_object.height)
        }

        p.x = p.x + p.v_x*dt
        p.y = p.y + p.v_y*dt
        if (p.x >= canvas_object.width) {
            p.v_x = -p.v_x
            p.x = canvas_object.width - 1
        }
        if (p.x <= 0) {
            p.v_x = -p.v_x
            p.x = 0
        }

        if (p.y>= canvas_object.height){
            p.v_y = -p.v_y
            p.y = canvas_object.height
        }
        if (p.y <= 0){
            p.v_y = -p.v_y
            p.y = 0
        }

        p.v_y = p.v_y + a_y*dt
        
        draw_pt(p)
        requestAnimationFrame(simulate)
    }

    simulate()
})