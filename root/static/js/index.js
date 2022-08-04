const size = 400
var worker = new Worker('/static/js/worker.js');
var number_of_workers = 0;

function update_canvas() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const expression_list = document.getElementById('expressions_list');
    const imageData = ctx.createImageData(size, size);
    let expressions = expression_list.children;
    
    let expressions_array = [];
    for (let i = 0; i < expressions.length; i++) {
        expressions_array.push(expressions.item(i).value);
    }

    let slider_data = [];
    let sliders = document.getElementsByClassName('slider');
    for (let i = 0; i < sliders.length; i++) {
        slider_data.push(sliders.item(i).value);
    }
    
    if (number_of_workers > 0) {
        number_of_workers = 0;
        worker.terminate();
        worker = new Worker('/static/js/worker.js');
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
        let imageData = ctx.getImageData(x*size, y*size, 1, 1).data;
        let r = imageData[0];
        let g = imageData[1];
        let b = imageData[2];
        return `rgba(${init*(1-ratio)+ratio*r}, ${init*(1-ratio)+ratio*g}, ${init*(1-ratio)+ratio*b}, ${255})`;
    }

    main_h1.style.setProperty('--main-start', calculate_colour(0.2, 0.2, 0.5, 255));
    main_h1.style.setProperty('--main-end', calculate_colour(0.8, 0.8, 0.5, 255));
    expression_h1.style.setProperty('--expressions-start', calculate_colour(0.8, 0.2, 0.5, 255));
    expression_h1.style.setProperty('--expressions-end', calculate_colour(0.2, 0.8, 0.5, 255));
    
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
        document.body.style.setProperty(`--r${i+1}`, calculate_colour(i*0.05, i*0.05, 0.95, 255)); 
    }
}
worker.onmessage = worker_onmessage;

update_canvas()