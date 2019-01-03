class Circle {
	constructor(pos, msv, mfv, s) {
		this.pos = createVector(random(0, w), random(0, h));
		this.home = pos.copy();
		this.r = 4;
		this.c = color([random(150, 255), random(150, 255), random(150, 255)], 100);
		this.vel = createVector(0, 0);
		this.maxSeekVel = msv;
		this.maxFleeVel = mfv;
		this.slowingRadius = s;
		this.sightRadius = s;
	}

	draw() {
		noStroke();
		fill(this.c);
		ellipse(this.pos.x, this.pos.y, 2 * this.r);
	}

	update() {
		this.pos.add(this.vel);
	}

	applyForce(force) {
		this.vel.add(force);
	}

	behave() {
		let fleeForce = this.flee();
		let arriveForce = this.arrive();
		this.applyForce(arriveForce.add(fleeForce));
	}

	seek() {
		let desired_velocity = p5.Vector.sub(this.home, this.pos).normalize();
		desired_velocity.mult(this.maxSeekVel);
		let force = p5.Vector.sub(desired_velocity, this.vel);
		return force;
	}

	arrive() {
		let desired_velocity = p5.Vector.sub(this.home, this.pos).normalize();
		desired_velocity.mult(this.maxSeekVel);
		let force = p5.Vector.sub(desired_velocity, this.vel);
		let distance = p5.Vector.sub(this.home, this.pos).mag();
		if (distance < this.slowingRadius) {
			force.mult(distance / this.slowingRadius);
		}
		return force;
	}

	flee() {
		let desired_velocity = p5.Vector.sub(this.pos, mouse).normalize();
		desired_velocity.mult(this.maxFleeVel);
		let force = p5.Vector.sub(desired_velocity, this.vel);
		let distance = p5.Vector.sub(this.pos, mouse).mag();
		if (distance > this.sightRadius) {
			force.mult(this.sightRadius / (distance + 1));
		}
		return force;
	}

	hitOther() {
		for (var i = 0; i < circles.length; i++) {
			if (circles[i] == this) {
				continue;
			}
			let d = dist(circles[i].pos.x, circles[i].pos.y, this.pos.x, this.pos.y);
			if (d < this.r + circles[i].r) {
				return true;
			}
		}
		return false;
	}
}