// Daniel Shiffman
// Nature of Code
// https://github.com/nature-of-code/noc-syllabus-S19

// This flappy bird implementation is adapted from:
// https://youtu.be/cXgA1d_E-jY&

class Bird {
  constructor(brain) {
    // position and size of bird
    this.x = 64;
    this.y = 480 / 2;
    this.r = 12;
    this.inputs = [];
    // Gravity, lift and velocity
    this.gravity = 0.8;
    this.lift = -12;
    this.velocity = 0;

    // Is this a copy of another Bird or a new one?
    // The Neural Network is the bird's "brain"
    if (brain instanceof NeuralNetwork) {
      this.brain = brain.copy();
      this.brain.mutate(mutateWeight);
    } else {
      this.brain = new NeuralNetwork();
    }

    // Score is how many frames it's been alive
    this.score = 0;
    // Fitness is normalized version of score
    this.fitness = 0;
  }

  // Create a copy of this bird
  copy() {
    return new Bird(this.brain);
  }

  dispose() {
    this.brain.dispose();
  }

  // Display the bird
  show() {
    fill(255, 100);
    stroke(255);
    ellipse(this.x, this.y, this.r * 2, this.r * 2);
  }

  showShifted() {
    noStroke();
    fill(155);
    let yshifted = constrain(this.y, 0, 480 - this.r);
    ellipse(this.x + 640 + 80, yshifted, this.r * 2);
  }

  save() {
    this.brain.save();
  }

  // This is the key function now that decides
  // if it should jump or not jump!
  think(pipes) {
    // First find the closest pipe
    let closest = null;
    let record = Infinity;
    for (let i = 0; i < pipes.length; i++) {
      let diff = pipes[i].x - this.x;
      if (diff > 0 && diff < record) {
        record = diff;
        closest = pipes[i];
      }
    }

    if (closest != null) {
      // Now create the inputs to the neural network
      // let inputs = [];
      // x position of closest pipe
      this.inputs[0] = map(closest.x, this.x, 640, 0, 1);
      // top of closest pipe opening
      this.inputs[1] = map(closest.top, 0, 480, 0, 1);
      // bottom of closest pipe opening
      this.inputs[2] = map(closest.bottom, 0, 480, 0, 1);
      // bird's y position
      this.inputs[3] = map(this.y, 0, 480, 0, 1);
      // bird's y velocity
      this.inputs[4] = map(this.velocity, -5, 5, 0, 1);

      // Get the outputs from the network
      let action = this.brain.predict(this.inputs);
      // Decide to jump or not!
      if (action[1] > action[0]) {
        this.up();
      }
    }
  }

  // Jump up
  up() {
    this.velocity += this.lift;
  }

  bottomTop() {
    // Bird dies when hits bottom?
    return this.y > 480 || this.y < 0;
  }

  // Update bird's position based on velocity, gravity, etc.
  update() {
    this.velocity += this.gravity;
    // this.velocity *= 0.9;
    this.y += this.velocity;
    // this.y = constrain(this.y, 0, 480 - this.r);

    // Every frame it is alive increases the score
    this.score++;
  }

  abstract(r) {
    noStroke();
    let runbeststate = r;
    if (r) {
      fill(255, 0, 0);
    } else {
      fill(random(100), random(255), random(255));
    }
    // if (((frameCount - fc_start) / 2) % 1420 == 0) {
    // push();
    // fill(240);
    // rect(0, 480, 1420, 480);
    // pop();
    // y_increment += 200;
    // console.log(y_increment);
    // }
    ellipse(((frameCount - fc_start) / 3) % 1420, y_increment + this.y / 3, 1, 1);
  }
}