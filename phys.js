var points, frame_i = 0;
const update_v_frames = 100

var tasks = []
class Task {
    period;
    constructor(period, exec_func) {
        this.period = period;
        this.exec_func = exec_func;
    }
    exec(){
        if (typeof this.exec_func === 'function') {
            this.exec_func()
        } else {
            console.error(`Invalid task function for task ${this.name}`)
        }
    }
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

function get_canvas_dm(inner_w, inner_h){
    if (inner_w >= 1440) {
        return {"width": 700, "height": 500}
    }
    if (inner_w >= 1280) {
        return {"width": 600, "height": 500}
    }
    if (inner_w >= 800) {
        return {"width": 600, "height": 400}
    }
    return {"width": inner_w * 0.8, "height": inner_h * 0.4}
} 

function cartesian_y(canvas_y, canvas_height){
    return (canvas_height - canvas_y)
}

/* Periodic Task Definitions */
const TASKS_GCD = 10;
function update_v(){
    for (var i = 0; i < points.length; i++){
        var v_x = Math.round(points[i].v_x), v_y = Math.round(points[i].v_y)
        let velocity = (v_x ** 2.0 + v_y ** 2.0) ** 0.5
        document.getElementById(`v${i}`).innerHTML = `${Math.round(velocity)} m/s | Vx,Vy = <${v_x},${v_y}>`
    }
}
const update_velocity = new Task(
    10,
    update_v
)

tasks.push(update_velocity)

document.addEventListener("DOMContentLoaded", () => {
    var canvas_object = document.getElementById("Window")
    const canvas = canvas_object.getContext("2d")
    console.log(`Screen inner width: ${window.innerWidth}, inner height: ${window.innerHeight}`)

    var canvas_dm = get_canvas_dm(window.innerWidth, window.innerHeight)
    canvas_object.width = canvas_dm.width;
    canvas_object.height = canvas_dm.height;
    console.log(`New canvas width: ${canvas_object.width}, height: ${canvas_object.height}`)

    var inner_dm = {"width" : window.innerWidth, "height" : window.innerHeight}

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
        20,
        'blue',
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
        'orange',
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



    var innerHTML = document.getElementById("entityList").innerHTML
    for (var i = 0; i < points.length; i++){
        let velocity = (points[i].v_x ** 2.0 + points[i].v_y ** 2.0) ** 0.5
        let color = (i % 2 == 0) ? '#e1e1e1' : 'white'
        innerHTML += ` <div style="background-color:${color}" class="entity"> <div> Particle ${i}: </div> <div id="v${i}"> ${Math.round(velocity)} m/s | <${points[i].vx},${points[i].vy}> </div> </div>`
    }
    document.getElementById("entityList").innerHTML = innerHTML


    var current_inner_dm = {"width" : window.innerWidth, "height" : window.innerHeight}
    function simulate(){

        frame_i += 1
        for (var i = 0; i < tasks.length; i++){
            if (tasks[i].period % frame_i == 0){
                tasks[i].exec()
            }
        }

        if (frame_i % TASKS_GCD == 0) {
            frame_i = 0
        }

        canvas.fillStyle = 'white'
        canvas.fillRect(0, 0, canvas_object.width, canvas_object.height)
        current_inner_dm = {"width" : window.innerWidth, "height" : window.innerHeight}

        if (current_inner_dm.width != inner_dm.width || current_inner_dm.height != inner_dm.height) {
            canvas_dm = get_canvas_dm(window.innerWidth, window.innerHeight)
            canvas_object.width = canvas_dm.width;
            canvas_object.height = canvas_dm.height;
            console.log(`New canvas dimensions: ${canvas_dm.width} by ${canvas_dm.height}`)
            for (let i = 0; i < points.length; i++) {
                points[i].update_rad(canvas_object.width, canvas_object.height)
            }
            inner_dm = current_inner_dm
        }
        
        for (let i = 0; i < points.length; i++) {

            points[i].x = points[i].x + points[i].v_x*dt
            points[i].y = points[i].y + points[i].v_y*dt
            
            if (points[i].x + points[i].rad >= canvas_object.width) {
                points[i].v_x = -points[i].v_x
                points[i].x = canvas_object.width - points[i].rad
            }
            if (points[i].x - points[i].rad <= 0) {
                points[i].v_x = -points[i].v_x
                points[i].x = points[i].rad
            }

            if (points[i].y + points[i].rad >= canvas_object.height){
                points[i].v_y = -points[i].v_y
                points[i].y = canvas_object.height - points[i].rad
            }
            if (points[i].y - points[i].rad <= 0){
                points[i].v_y = -points[i].v_y
                points[i].y = points[i].rad
            }

            points[i].v_y = points[i].v_y + a_y*dt
            drawpt(points[i].x, points[i].y, points[i].radx, points[i].rady, points[i].color)
        }

        requestAnimationFrame(simulate)
    }

    simulate()
})