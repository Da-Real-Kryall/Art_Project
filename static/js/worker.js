

function evaluate_pixel(x, y, s) {
    let r = 0;
    let g = 0;
    let b = 0;
    let size = 400;
    r = Math.round(((x+1)*y/4)%40-s[3]/2) <= 30 ? 255 : (80-s[6])*6.375;
    g = Math.round((y+ (Math.abs(s[1]-200)**1.1)*Math.sign(s[1]-200) )/size*240);
    g += (Math.round((x+1)*y/4)%50+s[3] <= 5) ? s[6]*3.1875 : 1+(80-s[6])*0.6;
    g += (s[2] <= x && x <=s[2]*3.75) ? 80 : 0;
    b = Math.round((x+1)/size*s[0]);
    b += (Math.round((x+1)*y/2)%50-s[3] <= 10) ? s[6]*3.1875 : 1+(80-s[6])*0.6;
    b += (x < 60+s[2]) ? 120 : 0;

    t = 120*((280 + Math.round((x+1)/4)) <= y+s[4]*1.4 && y+s[4]*1.4 <= (350 + Math.round((x+1)/8)) );
    r -= t; g -= t;
    
    t = 200*((-10 + Math.round((y+1)/6)) <= x-s[4]*2.06 && x-s[4]*2.09 <= (0 + Math.round((y+1)/4) ));
    r -= t; g += t; b += t;

    t = Math.max(-(Math.abs((600-y-Math.round(x/2))-x+s[4]*2))+150, 0);
    r -= t; g -= t; b -= t;

    t = Math.max(-Math.round(Math.sqrt((x-270+5*s[5])**2 + (y-100)**2))+100-s[5]*2, 0)*3 +
        Math.max(-Math.round(Math.sqrt((x-320)**2 + (y-170+5*s[5])**2))+50-s[5]/3, 0)*4 +
        Math.max(-Math.round(Math.sqrt((x-250-5*s[5])**2 + (y-230+5*s[5])**2))+30-s[5]/2, 0)*8;
    r += t; g += t; b += t;

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