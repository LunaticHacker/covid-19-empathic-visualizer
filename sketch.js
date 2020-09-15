let data;
let edited_data = { cases: [], deaths: [], recovered: [] };
let minr;
let maxr;
let mind;
let maxd;
let minc;
let maxc;

let countries;

let speed;
let select;
let div;
//Loading Screen
var s = function (p) {
  p.setup = function () {
    p.createCanvas(window.innerWidth, window.innerHeight);
    p.frameRate(4);
  };

  p.draw = function () {
    let r = random(0, 100);
    p.background(0);
    p.fill(255, 255, 0);
    p.strokeWeight(8);
    p.translate(p.width / 2, p.height / 2);
    p.ellipse(0, 0, 300);
    p.ellipse(60, -60, 50);
    p.ellipse(-60, -60, 50);
    p.beginShape();
    p.curveVertex(-100, 50);
    p.curveVertex(-100, 50);
    p.curveVertex(0, r);
    p.curveVertex(50, r);
    p.curveVertex(100, 50);
    p.curveVertex(100, 50);
    p.textAlign(CENTER);
    p.textSize(30);
    p.text("Loading..Stay Safe", 0, 200);

    p.endShape(CLOSE);
  };
};
//Set this instance of p5 to loading div
let loadingScreen = new p5(s, "p5_loading");

//Getting country code from url;
let searchParams = new URLSearchParams(window.location.search);
let param = "CN";

if (searchParams.has("country")) param = searchParams.get("country");

let day;

function preload() {
  data = loadJSON(`https://covid19-api.org/api/timeline/${param}`);
  countries = loadJSON(`https://covid19-api.org/api/countries`);
}

function setup() {
  //Modify data to daily basis
  //NOTE:index 0 in data contains the latest infromation,
  for (let i = Object.keys(data).length - 1; i >= 0; i--) {
    //this is the first day
    if (i == Object.keys(data).length - 1) {
      edited_data.cases.push(data[i].cases);
      edited_data.deaths.push(data[i].deaths);
      edited_data.recovered.push(data[i].recovered);
      continue;
    }
    let newcases = data[i].cases - data[i + 1].cases;
    let newdeaths = data[i].deaths - data[i + 1].deaths;
    let newrecovered = data[i].recovered - data[i + 1].recovered;
    edited_data.cases.push(newcases);
    edited_data.deaths.push(newdeaths);
    edited_data.recovered.push(newrecovered);
  }
  //Maximum and Minimun points of data;
  minr = min(edited_data.recovered);
  maxr = max(edited_data.recovered);
  mind = min(edited_data.deaths);
  maxd = max(edited_data.deaths);
  minc = min(edited_data.cases);
  maxc = max(edited_data.cases);
  //DOM manipulation
  createCanvas(window.innerWidth, window.innerHeight);
  div = createDiv();
  speed = createSlider(1, 10, 4);
  day = createSlider(0, Object.keys(edited_data.cases).length, 0, 1);
  select = createSelect();
  for (let i = 0; i < Object.keys(countries).length - 1; i++) {
    select.option(countries[i].name, countries[i].alpha2);
  }
  select.selected(param);
  select.changed(() => {
    searchParams.set("country", select.value());
    window.location.search = searchParams.toString();
  });
  select.addClass("countries");
  div.child(createP("Speed"));
  div.child(speed);
  div.child(createP("Day"));
  div.child(day);
  div.child(select);
  div.addClass("domElements");
}
function draw() {
  frameRate(speed.value());
  background(0);
  translate(width / 2, height / 2);
  day.value(day.value() + 1);
  let fcolor = map(edited_data.cases[day.value()], minc, maxc, 1, 255);
  fill(fcolor, 255 - fcolor, 0);
  ellipse(0, 0, 300);
  noFill();
  strokeWeight(8);
  let mouth = map(edited_data.deaths[day.value()], mind, maxd, 100, 0);
  beginShape();
  curveVertex(-100, 50);
  curveVertex(-100, 50);
  curveVertex(0, mouth);
  curveVertex(50, mouth);
  curveVertex(100, 50);
  curveVertex(100, 50);

  endShape(CLOSE);

  let eyesize = map(edited_data.recovered[day.value()], minr, maxr, 10, 50);
  ellipse(60, -60, eyesize);
  ellipse(-60, -60, eyesize);
  if (day.value() >= edited_data.recovered.length - 1) day.value(0);
  fill(255);
  textAlign(CENTER);
  textSize(50);
  text(`Day :${day.value() + 1}`, 0, 200);
}
