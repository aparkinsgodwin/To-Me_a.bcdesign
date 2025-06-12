let scene = 'write';
let input, titleInput, dateInput, promptSelect, button;
let letterText = '', letterTitle = '', memoryDate = '';
let returnTimer = 0, returnY;
let typedTitle = "", typedSubtitle = "";
let titleIndex = 0, subtitleIndex = 0;
let titleTimer = 0, subtitleTimer = 0;
let paperY, paperTargetY;
let savedLetters = [];
let oldLetterTypingIndex = 0;
let viewButton, letterListDiv;

let mainTitle = "Letters to My Future Self";
let subtitle = "Please write a message for your future self to remember.";

const instagramURL = "https://www.instagram.com/a.bcdesign?igsh=bjJqYTNpcnFucHNs&utm_source=qr";
const emailAddress = "aparkinsgodwin@gmail.com";

let bgImage;
let paperImage;
let paperScaledWidth, paperScaledHeight;

let prompts = [
  "What do you hope to have achieved by this time next year?",
  "Describe a happy moment you want to remember.",
  "What advice would you give your future self?"
];

let sendingProgress = 0;

function preload() {
  bgImage = loadImage('Cosy_Question.png');
  paperImage = loadImage('Old_Paper.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('Georgia');
  textSize(16);
  textAlign(CENTER, TOP);

  createHeader();

  titleInput = createInput('');
  titleInput.attribute('placeholder', 'Give your letter a title...');
  styleInput(titleInput);

  input = createElement('textarea');
  input.size(min(600, windowWidth - 80), 250);
  styleInput(input);

  dateInput = createInput('');
  dateInput.attribute('type', 'date');
  dateInput.style('font-family', 'Georgia');
  dateInput.style('font-size', '14px');

  promptSelect = createSelect();
  promptSelect.option("Choose a prompt");
  prompts.forEach(p => promptSelect.option(p));
  promptSelect.changed(() => input.value(promptSelect.value()));
  promptSelect.style('font-family', 'Georgia');

  button = createButton('Send to Future Self');
  button.mousePressed(sendLetter);
  button.style('font-family', 'Georgia');
  button.style('font-size', '16px');

  titleInput.style('background-color', 'transparent');
  titleInput.style('color', '#000');
  titleInput.style('border', 'none');

  input.style('background-color', 'transparent');
  input.style('color', '#000');
  input.style('border', 'none');

  viewButton = createButton('View Past Letters');
  viewButton.position(windowWidth - 160, windowHeight - 60);
  viewButton.style('font-family', 'Georgia');
  viewButton.style('font-size', '14px');
  viewButton.style('padding', '8px 12px');
  viewButton.mousePressed(viewPastLetters);

  letterListDiv = createDiv('');
  letterListDiv.style('position', 'fixed');
  letterListDiv.style('right', '20px');
  letterListDiv.style('bottom', '100px');
  letterListDiv.style('width', '300px');
  letterListDiv.style('max-height', '400px');
  letterListDiv.style('overflow-y', 'scroll');
  letterListDiv.style('background-color', '#fff7e6');
  letterListDiv.style('border', '1px solid #d4bfa3');
  letterListDiv.style('border-radius', '8px');
  letterListDiv.style('padding', '10px');
  letterListDiv.style('font-family', 'Georgia');
  letterListDiv.hide();

  paperY = windowHeight + 40;
  paperTargetY = height / 2 - 180;

  loadSavedLetters();
  updateInputPositions();
}

function createHeader() {
  let instaLink = createA(instagramURL, "@a.bcdesigns", '_blank');
  instaLink.style('position', 'fixed');
  instaLink.style('top', '10px');
  instaLink.style('left', '20px');
  instaLink.style('font-family', 'Georgia');
  instaLink.style('font-weight', 'bold');
  instaLink.style('font-size', '18px');
  instaLink.style('color', '#553c1c');
  instaLink.style('text-decoration', 'none');
  instaLink.style('cursor', 'pointer');
  instaLink.mouseOver(() => instaLink.style('text-decoration', 'underline'));
  instaLink.mouseOut(() => instaLink.style('text-decoration', 'none'));

  let mailtoLink = createA(`mailto:${emailAddress}`, emailAddress);
  mailtoLink.style('position', 'fixed');
  mailtoLink.style('top', '10px');
  mailtoLink.style('right', '20px');
  mailtoLink.style('font-family', 'Georgia');
  mailtoLink.style('font-weight', 'bold');
  mailtoLink.style('font-size', '18px');
  mailtoLink.style('color', '#553c1c');
  mailtoLink.style('text-decoration', 'none');
  mailtoLink.style('cursor', 'pointer');
  mailtoLink.mouseOver(() => mailtoLink.style('text-decoration', 'underline'));
  mailtoLink.mouseOut(() => mailtoLink.style('text-decoration', 'none'));
}

function styleInput(el) {
  el.style('width', '80%');
  el.style('padding', '8px');
  el.style('font-family', 'Georgia');
  el.style('font-size', '16px');
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  input.size(min(600, windowWidth - 80), 250);
  paperTargetY = height / 2 - 180;
  viewButton.position(windowWidth - 160, windowHeight - 60);
  updateInputPositions();
}

function draw() {
  background(bgImage);
  image(bgImage, 0, 0, width, height);

  fill(255, 245, 220, 180);
  noStroke();
  rect(0, 0, width, height);

  if (scene === 'write') {
    animateTypewriterTitle();
    animatePaperRising();
    drawPaperBox();
  } else if (scene === 'sending') {
    drawSendingScene();
  } else if (scene === 'return') {
    drawReturnScene();
  }
}

function animateTypewriterTitle() {
  textSize(32);
  fill(40, 30, 20);
  if (millis() > titleTimer && titleIndex < mainTitle.length) {
    typedTitle += mainTitle.charAt(titleIndex++);
    titleTimer = millis() + 60;
  }
  textAlign(CENTER, TOP);
  text(typedTitle, width / 2, 60);

  textSize(18);
  fill(60, 45, 30);
  if (titleIndex >= mainTitle.length && millis() > subtitleTimer && subtitleIndex < subtitle.length) {
    typedSubtitle += subtitle.charAt(subtitleIndex++);
    subtitleTimer = millis() + 30;
  }
  text(typedSubtitle, width / 2, 100);
}

function animatePaperRising() {
  if (paperY > paperTargetY) {
    paperY -= 5;
    updateInputPositions();
  }
}

function updateInputPositions() {
  const maxPaperWidth = min(600, windowWidth - 100);
  const scaleFactor = maxPaperWidth / paperImage.width;
  paperScaledWidth = paperImage.width * scaleFactor;
  paperScaledHeight = paperImage.height * scaleFactor;

  const inputWidth = paperScaledWidth * 0.85;
  const xCenter = (windowWidth - inputWidth) / 2;

  titleInput.size(inputWidth, 30);
  titleInput.position(xCenter, paperY + 40);

  input.size(inputWidth, 200);
  input.position(xCenter, paperY + 80);

  promptSelect.position(xCenter + 10, paperY + 290);
  dateInput.position(xCenter + 10, paperY + 330);
  button.position(xCenter + inputWidth / 2 - 80, paperY + 370);
}

function drawPaperBox() {
  const maxPaperWidth = min(600, windowWidth - 100);
  const scaleFactor = maxPaperWidth / paperImage.width;
  paperScaledWidth = paperImage.width * scaleFactor;
  paperScaledHeight = paperImage.height * scaleFactor;
  let paperX = (width - paperScaledWidth) / 2;

  image(paperImage, paperX, paperY, paperScaledWidth, paperScaledHeight);
}

function drawSendingScene() {
  fill(255, 245, 220, 180);
  rect(0, 0, width, height);

  const maxPaperWidth = min(600, windowWidth - 100);
  const scaleFactor = maxPaperWidth / paperImage.width;
  paperScaledWidth = paperImage.width * scaleFactor;
  paperScaledHeight = paperImage.height * scaleFactor;
  let paperX = (width - paperScaledWidth) / 2;

  let foldProgress = min(sendingProgress * 2, 1);
  let slideProgress = max((sendingProgress - 0.5) * 2, 0);

  push();
  translate(paperX + paperScaledWidth / 2, paperY + paperScaledHeight / 2);
  let scaleX = lerp(1, 0.3, foldProgress);
  scale(scaleX, 1);
  let slideY = lerp(0, height + paperScaledHeight, slideProgress);
  translate(-paperScaledWidth / 2, -paperScaledHeight / 2 + slideY);
  image(paperImage, 0, 0, paperScaledWidth, paperScaledHeight);
  pop();

  fill(40, 30, 20);
  textAlign(CENTER, CENTER);
  textSize(20);
  text("Sending your letter to the future...", width / 2, paperY - 50);

  sendingProgress += 0.01;

  if (sendingProgress >= 1) {
    sendingProgress = 0;
    scene = 'write';
    titleInput.value('');
    input.value('');
    dateInput.value('');
    paperY = windowHeight + 40;
  }
}

function sendLetter() {
  let title = titleInput.value();
  let text = input.value();
  let date = dateInput.value();

  if (!title || !text || !date) {
    alert("Please fill out all fields!");
    return;
  }

  savedLetters.push({ title, text, date });
  localStorage.setItem('letters', JSON.stringify(savedLetters));
  scene = 'sending';
  sendingProgress = 0;
}

function loadSavedLetters() {
  let data = localStorage.getItem('letters');
  if (data) {
    savedLetters = JSON.parse(data);
  }
}

function viewPastLetters() {
  if (letterListDiv.elt.style.display === 'none') {
    letterListDiv.show();
  } else {
    letterListDiv.hide();
    return;
  }

  letterListDiv.html('');
  if (savedLetters.length === 0) {
    letterListDiv.html('<p>No letters saved.</p>');
    return;
  }

  // SORT: earliest date to most recent
  savedLetters.sort((a, b) => new Date(a.date) - new Date(b.date));

  savedLetters.forEach((letter) => {
    let entry = createDiv('');
    entry.style('margin-bottom', '12px');
    entry.style('padding', '10px');
    entry.style('background', 'rgb(205, 203, 198)');
    entry.style('border-radius', '8px');
    entry.style('border', '1px solid rgb(125, 118, 108)');
    entry.html(`
      <strong>${letter.title}</strong><br>
      <small>Date: ${letter.date}</small><br>
      <p style="margin-top: 6px;">${letter.text}</p>
    `);
    letterListDiv.child(entry);
  });
}
