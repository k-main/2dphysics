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

    function drawpt(x, y, radx, rady, color, visible=true){
        if (visible == false) {
            radx += 1
            rady += 1
            color = 'white'
        }
        canvas.beginPath()
        canvas.fillStyle = color
        canvas.ellipse(x, cartesian_y(y, canvas_object.height), radx, rady, 0, 0, 2*Math.PI, false)
        canvas.fill()
        canvas.closePath()
    }
    
    var a_y = -9.8
    const dt  = 0.1
    
    const p0 = new Point(
        1,
        (canvas_object.width / 2),
        (canvas_object.height / 2),
        10,
        'red',
        20,
        2,
        canvas_object.width,
        canvas_object.height
    )
    
    const p1 = new Point(
        1,
        (canvas_object.width / 2),
        (canvas_object.height / 2),
        5,
        'blue',
        50,
        20,
        canvas_object.width,
        canvas_object.height
    )

    const p2 = new Point(
        1,
        (canvas_object.width / 2) + 20,
        (canvas_object.height / 2) + 20,
        8,
        'green',
        20,
        80,
        canvas_object.width,
        canvas_object.height
    )

    const p3 = new Point(
        1,
        (canvas_object.width / 2) - 20,
        (canvas_object.height / 2) - 20,
        3,
        'red',
        200,
        80,
        canvas_object.width,
        canvas_object.height
    )

    points = [p0, p1, p2, p3]

    var current_inner_dimensions = {"width" : window.innerWidth, "height" : window.innerHeight}
    function simulate(){
        canvas.fillStyle = 'white'
        canvas.fillRect(0, 0, canvas_object.width, canvas_object.height)
        current_inner_dimensions = {"width" : window.innerWidth, "height" : window.innerHeight}

        if (current_inner_dimensions != inner_dimensions) {
            canvas_dm = get_canvas_dm(window.innerWidth, window.innerHeight)
            canvas_object.width = canvas_dm.width;
            canvas_object.height = canvas_dm.height;
            console.log(`New canvas dimensions: ${canvas_dm.width} by ${canvas_dm.height}`)
            for (let i = 0; i < points.length; i++) {
                points[i].update_rad(canvas_object.width, canvas_object.height)
            }
        }
        
        for (let i = 0; i < points.length; i++) {

            points[i].x = points[i].x + points[i].v_x*dt
            points[i].y = points[i].y + points[i].v_y*dt
            if (points[i].x >= canvas_object.width) {
                points[i].v_x = -points[i].v_x
                points[i].x = canvas_object.width - 1
            }
            if (points[i].x <= 0) {
                points[i].v_x = -points[i].v_x
                points[i].x = 0
            }

            if (points[i].y>= canvas_object.height){
                points[i].v_y = -points[i].v_y
                points[i].y = canvas_object.height
            }
            if (points[i].y <= 0){
                points[i].v_y = -points[i].v_y
                points[i].y = 0
            }

            points[i].v_y = points[i].v_y + a_y*dt
            // drawpt(points[i].x, points[i].y, points[i].radx, points[i].rady, points[i].color)
        }

        for (let i = 0; i < points.length; i++) {
            drawpt(points[i].x, points[i].y, points[i].radx, points[i].rady, points[i].color)
        }

        requestAnimationFrame(simulate)
    }

    simulate()
})