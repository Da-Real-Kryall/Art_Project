// Worker script for calculating the new image
onmessage = function(e) {
    //unpack data
    let size = e.data[0];
    let expressions = e.data[1];
    let imageData = e.data[2];

    //Iterate through every pixel
    for (let i = 0; i < imageData.data.length; i += 4) {

        let x = (i % (4*size))/4;
        let y = i / (4*size);
    
        let r = 0;
        let g = 0;
        let b = 100;
    
        eval(`with (Math) {${expressions.join("; ")}}`);
        
        // Modify pixel data
        imageData.data[i + 0] = r;        // R value
        imageData.data[i + 1] = g;        // G value
        imageData.data[i + 2] = b;        // B value
        imageData.data[i + 3] = 255;      // A value
    }

    postMessage(imageData);
}