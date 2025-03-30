var points
var frame_i = 0
var canvas_object
var tasks = []
/* Sim Params */
var air_res_coeff = 0
var a_y = -9.8
var dt = 0.1
var suspend = false

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
    id;
    x;
    y;
    v_x;
    v_y;
    rad;
    color;
    radx;
    rady;
    constructor(id, x, y, rad, color, v_x, v_y, canvw, canvh) {
        this.id = id
        this.x = x
        this.y = y  
        this.v_x = (v_x > 100000000) ? 100 : v_x
        this.v_y = (v_y > 100000000) ? 100 : v_y
        this.rad = (rad > (canvw / 2) || rad > (canvh / 2)) ? 10 : rad;
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


function create_pt(){
    if (points.length > 10) return;

    var x, y, Vx, Vy, r, c

    x_f  = document.getElementById("x0").value
    y_f  = document.getElementById("y0").value
    Vx_f = document.getElementById("v_x").value
    Vy_f = document.getElementById("v_y").value
    r_f  = document.getElementById("radius").value
    c_f  = document.getElementById("color").value

    x = (x_f != '') ? Number(x_f) : 100
    y = (y_f != '') ? Number(y_f) : 100
    Vx = (Vx_f != '') ? Number(Vx_f) : 100
    Vy = (Vy_f != '') ? Number(Vy_f) : 100
    r = (r_f != '') ? Number(r_f) : 10
    c = (c_f != '') ? c_f : 'blue'

    const point_id = (points.length != 0) ? points[points.length - 1].id + 1 : 0
    points.push(new Point(point_id, x, y, r, c, Vx, Vy, canvas_object.width, canvas_object.height))

    let bg_color = ((points.length - 1) % 2 == 0) ? '#e1e1e1' : 'white'
    document.getElementById('entityList').innerHTML += `
        <div id=p${point_id} style="background-color:${bg_color}" class="entity"> 
            <div class="entityData">
                <div> P${point_id}: </div> 
                <div id="v${point_id}">  </div> 
            </div>
            <button class="del" id=del_${point_id} onClick="delete_pt(${point_id})">Delete</button>
        </div>
    `
}

function delete_pt(id){
    document.getElementById(`p${id}`).remove()
    var found = false;
    for (var i = 0; i < points.length; i++) {
        if (found == false && points[i].id == id){
            points.splice(i , 1)
            found = true
            i -= 1
        } else if (found == true) {
            var color = (i % 2 == 0) ? `#e1e1e1` : 'white'
            console.log(`P${points[i].id} is now ${color}`)
            document.getElementById(`p${points[i].id}`).style.backgroundColor = color
        }
    }

}

function toggle_air_res(){
    let value = 0.0001
    var toggle_btn = document.getElementById('air-res')
    if (air_res_coeff == value) {
        toggle_btn.innerHTML = 'Enable Air-Resistance'
        air_res_coeff = 0
    } else {
        toggle_btn.innerHTML = 'Disable Air-Resistance'
        air_res_coeff = value
    }
}

function toggle_g(){
    var toggle_btn = document.getElementById('gravity')
    if (a_y == 0) {
        a_y = -9.81
        toggle_btn.innerHTML = "Disable Gravity"
    } else {
        a_y = 0
        toggle_btn.innerHTML = "Enable Gravity"
    }
}

function agitate(){
    for (var i = 0; i < points.length; i++){
        // try catch in case of deletion during loop iteration
        try {
            let c = points[i].color
            points[i].color = 'black'
            points[i].v_x += Math.floor(Math.random() * 100)
            points[i].v_y += Math.floor(Math.random() * 100)
            points[i].color = c
        } catch (error) {
            console.log(`Error modifying point values, recently deleted? ${error}`)
        }
    }
}

function suspend_sim(){
    var pause_btn = document.getElementById('pause')
    if (suspend) {
        dt = 0
        pause_btn.innerHTML = "Resume"
        suspend = false
    } else {
        dt = 0.1
        pause_btn.innerHTML = "Pause"
        suspend = true
    }
}
/* Periodic Task Definitions */
const TASKS_GCD = 10;
function update_v(){
    for (var i = 0; i < points.length; i++){
        try {
            var v_x = Math.round(points[i].v_x), v_y = Math.round(points[i].v_y)
            let velocity = (v_x ** 2.0 + v_y ** 2.0) ** 0.5
            document.getElementById(`v${points[i].id}`).innerHTML = 
            `
            <div>  |V| = ${Math.round(velocity)} m/s </div>
            <div> v = <${v_x},${v_y}> </div>
            `
        } catch (error) {
            console.log(`Error updating point with id ${points[i].id}, ${error}`)
        }
    }
}
const update_velocity = new Task(
    50,
    update_v
)

tasks.push(update_velocity)

document.addEventListener("DOMContentLoaded", () => {
    //Input Event Listeners
    document.getElementById('createPt').addEventListener('click', (e) => { e.preventDefault(); create_pt() })
    document.getElementById('air-res').addEventListener('click', (e) => { e.preventDefault(); toggle_air_res() })
    document.getElementById('gravity').addEventListener('click', (e) => { e.preventDefault(); toggle_g() })
    document.getElementById('agitate').addEventListener('click', (e) => { e.preventDefault(); agitate() })
    document.getElementById('pause').addEventListener('click', (e) => { e.preventDefault(); suspend_sim() })

    canvas_object = document.getElementById("Window")
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
    
    const p0 = new Point( 0, (canvas_object.width / 2), (canvas_object.height / 2), 20, 'blue', 20, -20, canvas_object.width, canvas_object.height)
    const p1 = new Point( 1, (canvas_object.width / 2), (canvas_object.height / 2), 5, 'orange', 50, 20, canvas_object.width, canvas_object.height)
    const p2 = new Point( 2, (canvas_object.width / 2) + 20, (canvas_object.height / 2) + 20, 8, 'green', 20, 80, canvas_object.width, canvas_object.height)
    const p3 = new Point( 3, (canvas_object.width / 2) - 20, (canvas_object.height / 2) - 20, 3, 'red', 100, 80, canvas_object.width, canvas_object.height)

    points = [p0, p1, p2, p3]

    // var innerHTML = document.getElementById("entityList").innerHTML
    for (var i = 0; i < points.length; i++){
        let velocity = (points[i].v_x ** 2.0 + points[i].v_y ** 2.0) ** 0.5
        let color = (i % 2 == 0) ? '#e1e1e1' : 'white'
        document.getElementById("entityList").innerHTML += ` <div id=p${points[i].id} style="background-color:${color}" class="entity"> 
        <div class="entityData">
            <div> 
                P${points[i].id}: 
            </div>
            <div id="v${points[i].id}">
                ${Math.round(velocity)} m/s | <${points[i].vx},${points[i].vy}> 
            </div> 
        </div>
            <button class="del" id="class="del" del_${points[i].id}" onClick="delete_pt(${points[i].id})">Delete</button> 
        </div>`
    }



    var current_inner_dm = {"width" : window.innerWidth, "height" : window.innerHeight}
    function simulate(){

        // Handle tasks
        frame_i += 1
        for (var i = 0; i < tasks.length; i++){
            if (tasks[i].period % frame_i == 0){
                tasks[i].exec()
            }
        }

        if (frame_i % TASKS_GCD == 0) {
            frame_i = 0
        }

        // Clear Canvas
        canvas.fillStyle = 'white'
        canvas.fillRect(0, 0, canvas_object.width, canvas_object.height)
        current_inner_dm = {"width" : window.innerWidth, "height" : window.innerHeight}

        // Check for Canvas Resize
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
        // Simulation Computations
        for (let i = 0; i < points.length; i++) {
            var p_i = points[i]
            p_i.x = p_i.x + p_i.v_x*dt
            p_i.y = p_i.y + p_i.v_y*dt
            
            if (p_i.x + p_i.rad >= canvas_object.width) {
                p_i.v_x = -p_i.v_x
                p_i.x = canvas_object.width - p_i.rad
            }
            if (p_i.x - p_i.rad <= 0) {
                p_i.v_x = -p_i.v_x
                p_i.x = p_i.rad
            }

            if (p_i.y + p_i.rad >= canvas_object.height){
                p_i.v_y = -p_i.v_y
                p_i.y = canvas_object.height - p_i.rad
            }
            if (p_i.y - p_i.rad <= 0){
                if (p_i.v_y != 0) p_i.v_y = -p_i.v_y
                p_i.y = p_i.rad
            }

            let air_res = air_res_coeff*(Math.PI * p_i.rad)
            p_i.v_y = (p_i.v_y) + a_y*dt - air_res*p_i.v_y*dt
            p_i.v_x = (p_i.v_x)          - air_res*p_i.v_x*dt
            drawpt(p_i.x, p_i.y, p_i.radx, p_i.rady, p_i.color)
            points[i] = p_i
        }

        requestAnimationFrame(simulate)
    }

    simulate()
})