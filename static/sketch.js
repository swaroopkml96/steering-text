var message;
var w;
var h;

var circles = [];
var valid_pixels = [];
var msg_graphics;

var text_size;
var n;
var attempts;
var maxSeekVel;
var maxFleeVel;
var sight;

var mouse;
var mouse_pressed_twice = false;

function setup() {

	mouse = createVector();

	w = 600;
	h = 400;

	attempts = 10000;
	message = createInput('Hello!').parent('messageBox');
	text_size = createSlider(1, 150, 100, 1).parent('textSize');
	n = createSlider(1, 1000, 500, 1).parent('nParticles');
	maxSeekVel = createSlider(1, 10, 5).parent('maxSeekVel');
	maxFleeVel = createSlider(1, 20, 10).parent('maxFleeVel');
	sight = createSlider(1, 60, 30).parent('sight');

	redraw_button = createButton('Redraw').parent('redrawButton');
	redraw_button.mousePressed(changeMessage);


	createCanvas(w, h).parent('canvasHolder');
	pixelDensity(1);


	msg_graphics = createGraphics(w, h);
	msg_graphics.pixelDensity(1);

	msg_graphics.background(200);
	msg_graphics.textAlign(CENTER, CENTER);
	msg_graphics.textSize(text_size.value());
	msg_graphics.text(message.value(), 0, 0, w, h);

	valid_pixels = compute_valid_pixels(msg_graphics);

	circles = create_circles(valid_pixels);




}

function draw() {

	background(51);
	mouse.x = mouseX;
	mouse.y = mouseY;
	for (var i = 0; i < circles.length; i++) {
		circles[i].behave();
		circles[i].update();
		circles[i].draw();
	}
}

function compute_valid_pixels(graphics) {
	let computed_valid_pixels = [];
	graphics.loadPixels();
	for (var i = 0; i < graphics.height; i++) {
		for (var j = 0; j < graphics.width; j++) {
			let index = 4 * (i * graphics.width + j);
			let r = graphics.pixels[index];
			let g = graphics.pixels[index + 1];
			let b = graphics.pixels[index + 2];
			let a = graphics.pixels[index + 3];
			let avg_brightness = (r + g + b) / 3;
			if (avg_brightness < 150) {
				computed_valid_pixels.push(createVector(j, i));
			}

		}
	}
	return computed_valid_pixels;
}

function create_circles(px) {
	let created_circles = [];
	for (var i = 0; i < min(attempts, n.value()); i++) {
		random_pt = random(px);
		random_circle = new Circle(random_pt, maxSeekVel.value(), maxFleeVel.value(), sight.value());
		if (!random_circle.hitOther()) {
			created_circles.push(random_circle);
		}
	}
	for (var j = created_circles.length; j < n.value(); j++) {
		random_pt = random(px);
		//random_circle = new Circle(random_pt, maxSeekVel.value(), maxFleeVel.value(), sight.value());
		random_circle = new Circle(random_pt, maxSeekVel.value(), maxFleeVel.value(), sight.value());
		created_circles.push(random_circle);

	}
	return created_circles;
}

function changeMessage() {

	msg_graphics = createGraphics(w, h);
	msg_graphics.pixelDensity(1);

	msg_graphics.background(200);
	msg_graphics.textAlign(CENTER, CENTER);
	msg_graphics.textSize(text_size.value());
	msg_graphics.text(message.value(), 0, 0, w, h);

	valid_pixels = compute_valid_pixels(msg_graphics);

	let new_circles = create_circles(valid_pixels);

	circles = reasign_circles(circles, new_circles);

}

function reasign_circles(c, new_c) {
	for (var i = 0; i < n; i++) {
		new_c[i].pos = c[i].pos;
		new_c[i].c = c[i].c;
	}
	return new_c;
}