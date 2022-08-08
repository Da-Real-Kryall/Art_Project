const size = 400
var worker = new Worker('./static/js/worker.js');
var number_of_workers = 0;

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

   ["SunRay", "40", "0", "400"],
   ["Lime", "201", "0", "400"],
   ["Magenta", "235", "0", "400"],
].reverse();

function reset_label(index) {
    document.getElementById(`v${index}`).innerHTML = input_data[index - 1][0];
}


function onload() {
    var div = document.getElementById('expressions_list');
    for (let i = 0; i < input_data.length; i++) {
        div.innerHTML = div.innerHTML + `
        <span class="magic-slider">
        <input type="range" min="${input_data[i][2]}" max="${input_data[i][3]}" value="${input_data[i][1]}" class="slider" id="r${i + 1}" oninput="update_canvas(${i + 1})" onmouseup="reset_label(${i + 1})">
        <div class="slider-value" id="v${i + 1}">${input_data[i][0]}</div>
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

    if (number_of_workers > 0) {
        number_of_workers = 0;
        worker.terminate();
        worker = new Worker('./static/js/worker.js');
        worker.onmessage = worker_onmessage;
    } else {
        let buffer_style = document.getElementsByClassName('circles')[0].style;
        buffer_style.animation = 'fading-in 0.5s 1';
        buffer_style.display = "block";
    }

    number_of_workers++;
    worker.postMessage([size, expressions_array, imageData, slider_data]);
}


function worker_onmessage(e) {
    number_of_workers--;
    let buffer_style = document.getElementsByClassName('circles')[0].style;
    buffer_style.display = "none";

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
    let main_h1 = document.getElementById('main_h1');
    let expression_h1 = document.getElementById('expression_h1');

    let canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');


    function calculate_colour(x, y, ratio, init) {
        let imageData = ctx.getImageData(x * size, y * size, 1, 1).data;
        let r = imageData[0];
        let g = imageData[1];
        let b = imageData[2];
        return `rgba(${init * (1 - ratio) + ratio * r}, ${init * (1 - ratio) + ratio * g}, ${init * (1 - ratio) + ratio * b}, ${255})`;
    }

    main_h1.style.setProperty('--main-start', calculate_colour(0.2, 0.2, 0.8, 255));
    main_h1.style.setProperty('--main-end', calculate_colour(0.8, 0.8, 0.8, 255));
    expression_h1.style.setProperty('--expressions-start', calculate_colour(0.8, 0.2, 0.8, 255));
    expression_h1.style.setProperty('--expressions-end', calculate_colour(0.2, 0.8, 0.8, 255));

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
        let colour = calculate_colour(random((23.4 + i) * i), random((21.5 + i) * i), 1, 255);
        document.getElementsByClassName('slider-value')[i].style.setProperty('--background-colour', colour);
        document.getElementById(`r${i + 1}`).style.setProperty('--r-colour', colour);
    }
}
worker.onmessage = worker_onmessage;

