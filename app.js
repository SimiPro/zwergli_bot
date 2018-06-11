var robo = require('robotjs');
var fs = require('fs');
let Jimp = require('jimp');

let event_id = null;
let restart = false;

let start = function(eventloop) {
    robo.mouseClick('left');
    setTimeout(function() {
        robo.mouseClick('left');
        eventloop();
    }, 1350);
};

let save_img = function(screen_shot, w, h) {
    var jimg = new Jimp(w, h);
    for (var x=0; x<w; x++) {
        for (var y=0; y<h; y++) {
            var index = (y * screen_shot.byteWidth) + (x * screen_shot.bytesPerPixel);
            var r = screen_shot.image[index];
            var g = screen_shot.image[index+1];
            var b = screen_shot.image[index+2];
            var num = (r*256) + (g*256*256) + (b*256*256*256) + 255;
            jimg.setPixelColor(num, x, y);
        }
    }

    jimg.write('screenli313.png')
}

x = 1925
width = 950
y = 165 //1080 - 
height = 532

shrooms_offset_perc = 0.6;

let find_mushrooms = function() {
    let capture = robo.screen.capture(x, y + Math.floor(height*0.4), width, Math.floor(height*0.6));
    console.log(capture);
    save_img(capture, width, Math.floor(height*0.6));

    let sHeight = 20;
    let sWidth = 20;

    let redShroomThreshold = 100000;

    let shrooms = [];
    let redSum = 0;
    let maxRedSum = 0;
    for (var x=width/2; x<width; x += sWidth/2) {
        for (var y=0; y<height; y += sHeight/2) {

            redSum = 0;
            for (var a=0; a<sWidth; a++) {
                for (var b=0; b<sHeight; b++) {
                    var index = ((y+b) * capture.byteWidth) + ((x+a) * capture.bytesPerPixel);
                    redSum += capture.image[index];
                }
            }

            if (redSum > redShroomThreshold) {
                shrooms.push([x + sWidth/2, y + sHeight/2]);
            }

            maxRedSum = Math.max(maxRedSum, redSum);
        }
    }

    console.log('max gay simi = ', maxRedSum);

    return shrooms;
}

screen_shot = robo.screen.capture(x, y, width, height)
/*
var jimg = new Jimp(width, height);
for (var x=0; x<width; x++) {
    for (var y=0; y<height; y++) {
        var index = (y * screen_shot.byteWidth) + (x * screen_shot.bytesPerPixel);
        var r = screen_shot.image[index];
        var g = screen_shot.image[index+1];
        var b = screen_shot.image[index+2];
        var num = (r*256) + (g*256*256) + (b*256*256*256) + 255;
        jimg.setPixelColor(num, x, y);
    }
}

jimg.write('screenli2.png')
console.log(screen_shot);
fs.writeFile('screenli.png', screen_shot.image, 'binary', function() {
    console.log('screen_shot written');
});
*/

old_screen_shot = screen_shot;

callback = function() {
    event_id = setInterval(() => {
        screen_shot = robo.screen.capture(x, y, width, height)

        let shrooms = find_mushrooms();
        if (shrooms.length !== 0) {
            console.log('found shrooms: ', shrooms);
        }

        if (old_screen_shot.image.equals(screen_shot.image)) {
            robo.mouseClick('left');
            restart = true;
        };
        old_screen_shot = screen_shot;
    }, 60);
};

start(callback);

setInterval(() => {
    if (restart) {
        restart = false;
        clearInterval(event_id);
        setTimeout(() => {
            start(callback);
        }, 500);
    };
}, 200);
