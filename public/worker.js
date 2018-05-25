const TARGET_STR = "this string was produced by evolution";
const RANDOM_STR_MAX_LEN = 50; // Max length of the strings to be generated
const MUTATION_RATE = 40;
const ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
const MUTATION_STEPS = 2
const PENALTY_FACTOR = 100
const INITIAL_GENERATION_SIZE = 100;
const GENERATIONS = 1000;
const ALLOWED_TO_BREED = 40;
const ALLOWED_SURVIVORS = 40;
let counter = 0;
let best_candidates = []
let best_candidates_children = []
let candidates = []

let new_g = [];

let running = 1;

let fitnessHistoric = new Array();
let fitnessMean = new Array();


function random_string(len) {

  return new Array(len)
    .fill(0)
    .map(() => ALPHABET.charAt(get_random_int(0, ALPHABET.length)))
    .join("")

}

function create_generation(size) {

  return new Array(size)
    .fill(0)
    .map(() => random_string(Math.round(get_random_int(5, RANDOM_STR_MAX_LEN))))

}

function fitness(str) {

  //Get the size of the smallest string (target and actual) 
  let smallest = Math.min.apply(null, [str.length, TARGET_STR.length]);

  let score = 0;

  //The score increases as the difference of the size of the strings rises
  score += Math.abs(str.length - TARGET_STR.length) * 100;
  //and, for each unit of difference, it goes a hundred times in a for
  //and for each time in for, it sums to the score the distance in UNICODE
  for (let x = 0; x < smallest; x++) {
    score += Math.abs(str.charCodeAt(x) - TARGET_STR.charCodeAt(x));
  }

  //The bigger the score, the far you're from the correct sentence
  return score;

}

function mutate(str) {

  return str
    .split("")
    .map((letter) =>
      (Math.round(Math.random() * MUTATION_RATE) == 2) ? String.fromCharCode(letter.charCodeAt(0) + Math.round(((Math.random() * MUTATION_STEPS) - (MUTATION_STEPS / 2)))) : letter)
    .join("");

}


function get_random_int(min, max) {
  return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min))) + Math.ceil(min);
}

function breed(str1, str2) {
  //Defines cut points and shuffles witn new random int

  let cut_point_1 = get_random_int(0, str1.length - 1);
  let cut_point_2 = get_random_int(cut_point_1, str1.length - 1);

  let cut_point_3 = get_random_int(0, str2.length - 1);
  let cut_point_4 = get_random_int(cut_point_3, str2.length - 1);

  return (str1.slice(0, cut_point_1) + str2.slice(cut_point_3, cut_point_4) + str1.slice(cut_point_2, str2.length)).toString();

}

function create_children(best_candidates) {

  //breeding the last with the first
  //the second with the last but one...
  best_candidates_children = []
  for (let y = 0; y < ALLOWED_TO_BREED; y++) {
    for (let i = 0; i < (ALLOWED_TO_BREED - y); i++) {
      best_candidates_children.push(breed(best_candidates[y], best_candidates[get_random_int(0, i)]));
    }
  }
  return best_candidates_children;

}

candidates = create_generation(INITIAL_GENERATION_SIZE)

while (running != 0) {

  best_candidates_children = []

  //creates an array with the candidate and its fitness
  //in the end, new_g is an array with ordered candidate by its fitness
  new_g = candidates
    .map((candidate) => [candidate, fitness(candidate)])
    .sort((a, b) => a[1] - b[1]);

  fitnessHistoric.push(new_g[0][1]);
  let mean = 0;
  for (i = 0; i < new_g.length; i++) {
    mean += new_g[i][1];
  }
  mean = mean / new_g.length;
  fitnessMean.push(mean);

  // Best candidates is the best ALLOWED_SURVIVORS of the array
  best_candidates = new_g
    .map((c) => c[0])
    .slice(0, ALLOWED_SURVIVORS);

  //Best candidates is concated with its childrens
  best_candidates.concat(create_children(best_candidates))

  //Then, candidates are the best candidates + its childrens + new random mutated elements
  candidates = best_candidates.concat(create_generation(20)).concat(best_candidates_children);
  candidates = candidates.map((x) => mutate(x));

  postMessage({
    gen: new_g[0][0],
    fitnessHistoric: fitnessHistoric,
    fitnessMean: fitnessMean
  });

  if (new_g[0][1] == 0) {
    //string found
    running = 0;
  }

}

