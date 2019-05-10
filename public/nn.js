// Daniel Shiffman
// Nature of Code
// https://github.com/nature-of-code/noc-syllabus-S19

const INPUTS = 5;
const OUTPUTS = 2;
let HIDDEN = 8; //variables that populate the model
let mutation = 0.1; //variables that populate the model
let _hidden = 8; //temp variables
let _mutation = 10; //temp variables

class NeuralNetwork {
  constructor(nn) {
    // console.log(hiddenSlider.value());
    if (keyIsPressed && key == 's') {
      // console.log('keypressed from nunu');
      _hidden = hiddenSlider.value();
      _mutation = mutationSlider.value();
      // initialise();
    }
    HIDDEN = _hidden;
    mutation = _mutation / 10;
    console.log(HIDDEN + ' ' + mutation);
    if (nn instanceof tf.Sequential) {
      this.model = nn;
    } else {
      this.model = NeuralNetwork.createModel();
    }
  }

  dispose() {
    this.model.dispose();
  }

  save() {
    this.model.save('downloads://bird-brain');
  }

  // Synchronous for now
  predict(input_array) {
    // console.log(input_array);
    return tf.tidy(() => {
      let xs = tf.tensor([input_array]);
      let ys = this.model.predict(xs);
      let y_values = ys.dataSync();
      return y_values;
    });
  }

  static createModel() {
    const model = tf.sequential();
    let hidden = tf.layers.dense({
      inputShape: [INPUTS],
      units: HIDDEN,
      activation: 'sigmoid'
    });
    let output = tf.layers.dense({
      units: OUTPUTS,
      activation: 'softmax'
    });
    model.add(hidden);
    model.add(output);
    return model;
  }

  // Adding function for neuro-evolution
  copy() {
    return tf.tidy(() => {
      const modelCopy = NeuralNetwork.createModel();
      const w = this.model.getWeights();
      for (let i = 0; i < w.length; i++) {
        w[i] = w[i].clone();
      }
      modelCopy.setWeights(w);
      const nn = new NeuralNetwork(modelCopy);
      return nn;
    });
  }

  // Accept an arbitrary function for mutation
  mutate(func) {
    tf.tidy(() => {
      const w = this.model.getWeights();
      for (let i = 0; i < w.length; i++) {
        let shape = w[i].shape;
        let arr = w[i].dataSync().slice();
        for (let j = 0; j < arr.length; j++) {
          arr[j] = func(arr[j]);
        }
        let newW = tf.tensor(arr, shape);
        w[i] = newW;
      }
      this.model.setWeights(w);
    });
  }
}

// Mutation function to be passed into bird.brain
function mutateWeight(x) {
  if (random(1) < mutation) {
    let offset = randomGaussian() * 0.5;
    let newx = x + offset;
    return newx;
  } else {
    return x;
  }
}

// module.exports = {
//   HIDDEN: HIDDEN,
//   mutation: mutation
// }