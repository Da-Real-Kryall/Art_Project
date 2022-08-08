function evaluate_pixel(x, y, s) {
    let r = 0;
    let g = 0;
    let b = 0;
    let size = 400;
    r = Math.round(((x+1)*y/4)%40) <= 30 ? 255 : 1;
    g = Math.round((y+s[1]-200)/size*240);
    g += (Math.round((x+1)*y/4)%50 <= 5) ? 255 : 1;
    g += (s[2] <= x && x <=s[2]*3.75) ? 80 : 0;
    b = Math.round((x+1)/size*s[0]);
    b += (Math.round((x+1)*y/2)%50 <= 10) ? 255 : 1;
    b += (x < 100) ? 120 : 0;
    lp = 120*((280 + Math.round((x+1)/4)) <= y && y <= (350 + Math.round((x+1)/8)) );
    r -= lp; g -= lp;
    lp = 200*((-10 + Math.round((y+1)/6))<= x && x <= (0 + Math.round((y+1)/4) ));
    r -= lp; g += lp; b += lp;
    return [r, g, b];
}

// Worker script for calculating the new image
onmessage = function(e) {
    //unpack data
    let size = e.data[0];
    let expressions = e.data[1];
    let imageData = e.data[2];
    let slider_data = e.data[3];

    //Iterate through every pixel
    try {
        for (let i = 0; i < imageData.data.length; i += 4) {

            let x = (i % (4*size))/4;
            let y = i / (4*size);
        

            let res = evaluate_pixel(x, y, slider_data);
            imageData.data[i] = res[0];
            imageData.data[i+1] = res[1];
            imageData.data[i+2] = res[2];
            imageData.data[i+3] = 255;
            /*
            let r = 0;
            let g = 0;
            let b = 0;
        
            eval(`with (Math) {${expressions.join("; ")}}`);
            // Modify pixel data
            imageData.data[i + 0] = r;        // R value
            imageData.data[i + 1] = g;        // G value
            imageData.data[i + 2] = b;        // B value
            imageData.data[i + 3] = 255;      // A value*/
        }
    } catch (e) {
        postMessage(null);
        return;
    }
    postMessage(imageData);
}