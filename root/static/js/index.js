const size = 500

function update_canvas() {
    const canvas = document.getElementById('canvas');
    const expression_list = document.getElementById('expressions_list');
    const ctx = canvas.getContext('2d');
    const imageData = ctx.createImageData(size, size);
    let expressions = expression_list.children;
    
    //Iterate through every pixel
    for (let i = 0; i < imageData.data.length; i += 4) {

        let x = (i % (4*size))/4;
        let y = Math.floor(i / size)/4;


    
        let r = 0;
        let g = 0;
        let b = 0;
    
        for (var j = 0; j < expressions.length; j++) {
            eval(expressions.item(j).value);
        }
        // Modify pixel data
        imageData.data[i + 0] = r;        // R value
        imageData.data[i + 1] = g;        // G value
        imageData.data[i + 2] = b;        // B value
        imageData.data[i + 3] = 255;      // A value
    }
    // Draw image data to the canvas
    ctx.putImageData(imageData, 0, 0);
}

update_canvas()