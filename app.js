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

x = 1992
width = 1057
y = 200 //1080 - 
height = 589

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
        if (old_screen_shot.image.equals(screen_shot.image)) {
            robo.mouseClick('left');
            restart = true;
        };
        old_screen_shot = screen_shot;
    }, 50);
};

start(callback);

setInterval(() => {
    if (restart) {
        restart = false;
        clearInterval(event_id);
        start(callback);
    };
}, 200);
