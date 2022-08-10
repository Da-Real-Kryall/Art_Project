const size = 400
var worker = new Worker('./static/js/worker.js');
var number_of_workers = 0;

/*not implemented yet, ignore for now

//used to make every second/third/fourth change of a slider be actually calculated (though the last change before letting go is always calculated)
//(idk what to name it, pr's welcome)
var foo = 0;

*/

//initialize input sliders
input_data = [
    /*
        [
            "Title",
            "Default Value",
            "Min Value",
            "Max Value",
        ]
    */

    ["Magenta", "235", "-100", "500"],
    ["Lime", "201", "0", "500"],
    ["SunRay", "40", "0", "400"],
    ["Glare", "0", "-64", "64"],
    ["Shear", "0", "-100", "380"],
    ["Lens", "0", "-80", "50"],
    ["Clarity", "80", "0", "120"],
    ["WIP", "0", "-100", "100"],
]

function reset_label(index) {
    update_canvas(index);
    document.getElementById(`v${index}`).innerHTML = input_data[index - 1][0];
}


function onload() {
    var div = document.getElementById('expressions_list');
    for (let i = 0; i < input_data.length; i++) {
        div.innerHTML = div.innerHTML + `
        <span class="magic-slider">
        <input type="range" min="${input_data[i][2]}" max="${input_data[i][3]}" value="${input_data[i][1]}" class="slider" id="r${i + 1}" oninput="update_canvas(${i + 1})" onmouseup="reset_label(${i + 1})">
        <div class="slider-value"><h1 class="slider_text" id="v${i + 1}">${input_data[i][0]}</h1></div>
        </span>`;
    }
    update_canvas(0);
}
document.addEventListener("DOMContentLoaded", onload);


function random(seed) {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

function update_canvas(index) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const expression_list = document.getElementById('expressions_list');
    const imageData = ctx.createImageData(size, size);
    let expressions = expression_list.children;

    //this is in a try catch block because on startup the document is null i think
    try {
        let slider_value = document.getElementById(`r${index}`).value;
        document.getElementById(`v${index}`).innerHTML = slider_value;
    } catch { }

    let expressions_array = [];
    for (let i = 0; i < expressions.length; i++) {
        expressions_array.push(expressions.item(i).value);
    }
    
    let slider_data = [];
    let sliders = document.getElementsByClassName('slider');
    for (let i = 0; i < sliders.length; i++) {
        slider_data.push(parseInt(sliders.item(i).value));
    }
    
    if (number_of_workers > 5) {
        number_of_workers = 0;
        //console.log(number_of_workers);
        worker.terminate();
        worker = new Worker('./static/js/worker.js');
        worker.onmessage = worker_onmessage;
    } else {
        let buffer_style = document.getElementsByClassName('circles')[0].style;
        buffer_style.animation = 'fading-in 0.5s 1';
        buffer_style.display = "block";
    }

    number_of_workers++;
    //foo = (foo + 1)%32;
    worker.postMessage([size, expressions_array, imageData, slider_data]);
}

function reset_sliders() {
    number_of_workers = 4;
    for (let i = 0; i < input_data.length; i++) {
        setTimeout(() => {
            document.getElementById(`r${i + 1}`).value = input_data[i][1];
            update_canvas(0);
            
        }, i*(600/input_data.length));
    }
    setTimeout(() => {
        number_of_workers = 0;
        let buffer_style = document.getElementsByClassName('circles')[0].style;
        buffer_style.display = "none";
    }, (input_data.length+1)*(600/input_data.length));

}

function worker_onmessage(e) {
    number_of_workers--;
    //console.log(number_of_workers);
    if (number_of_workers == 0) {
        let buffer_style = document.getElementsByClassName('circles')[0].style;
        buffer_style.display = "none";
    }

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    imageData = e.data;
    if (imageData != null) {
        ctx.putImageData(imageData, 0, 0);
        update_gradients();
    }
}

// Set css gradients to points on the image
function update_gradients() {
    let reset_h1 = document.getElementById('reset_h1');
    //let expression_h1 = document.getElementById('expression_h1');

    let canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');


    function calculate_colour(x, y, ratio, init) {
        let imageData = ctx.getImageData(x * size, y * size, 1, 1).data;
        let r = imageData[0];
        let g = imageData[1];
        let b = imageData[2];
        return `rgba(${init * (1 - ratio) + ratio * r}, ${init * (1 - ratio) + ratio * g}, ${init * (1 - ratio) + ratio * b}, ${255})`;
    }
    
    
    reset_h1.style.setProperty('--reset-start', calculate_colour(0.2, 0.2, 0.8, 255));
    reset_h1.style.setProperty('--reset-end', calculate_colour(0.8, 0.8, 0.8, 255));
    /*
    main_h1.style.setProperty('--main-start', calculate_colour(0.2, 0.2, 0.8, 255));
    main_h1.style.setProperty('--main-end', calculate_colour(0.8, 0.8, 0.8, 255));
    expression_h1.style.setProperty('--expressions-start', calculate_colour(0.8, 0.2, 0.8, 255));
    expression_h1.style.setProperty('--expressions-end', calculate_colour(0.2, 0.8, 0.8, 255));
    */

    let body = document.querySelector('body');
    body.style.setProperty('--bg-top-left', calculate_colour(0.625, 0.1, 0.4, 0));
    body.style.setProperty('--bg-top-right', calculate_colour(0.75, 0.4, 0.4, 0));
    body.style.setProperty('--bg-bottom-left', calculate_colour(0.25, 0.3, 0.4, 0));
    body.style.setProperty('--bg-bottom-right', calculate_colour(0.45, 0.7, 0.4, 0));

    let buffer_wheel = document.getElementsByClassName('circles')[0];
    buffer_wheel.style.setProperty('--load-1', calculate_colour(0.75, 0.5, 0.5, 255));
    buffer_wheel.style.setProperty('--load-2', calculate_colour(0.25, 0.75, 0.5, 255));
    buffer_wheel.style.setProperty('--load-3', calculate_colour(0.05, 0.05, 0.5, 255));

    for (let i = 0; i < document.getElementsByClassName('slider').length; i++) {
        let colour_1 = calculate_colour(random(i/3.2+5), random(i*2), 1, 255);
        let colour_2 = calculate_colour(random(23.3*i/3.2+5), random(i*4), 1, 255);
        document.getElementsByClassName('slider-value')[i].style.setProperty('--background-colour-1', colour_1);
        document.getElementsByClassName('slider-value')[i].style.setProperty('--background-colour-2', colour_2);
        document.getElementById(`r${i + 1}`).style.setProperty('--r-colour', colour_1);
    }

    body.style.setProperty('--reset-shade', calculate_colour(random(53.4), random(187.7), 1, 0));
}
worker.onmessage = worker_onmessage;

