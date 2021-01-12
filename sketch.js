// "use strict";

// Logic variables
var i = -1;
var ii = -1;
const WIDTH = 10;
const HEIGHT = 10;
const UNKNOWN = 0;
const autoFontSizeAccuracy = 1;
const P1 = 1;
const P2 = 2;
const maxNameLength = 4;
const bigNameSuffix = "...";
var p1_score = 0;
var p2_score = 0;
var currentTurn = P1;
var verticalLinesWonOver;
var horizontalLinesWonOver;
var boxesWonOver;
var numBoxesWonOver = 0;
// Drawing variables
const distBetweenCircles = 60;
const circleDia = 20;
const circleRad = circleDia / 2;
var gridDrawX;
var gridDrawY;
var hoveringLineColor;
var p1Color;
var p2Color;
var p1Name = "P1";
var p2Name = "P2";
const defaultP1Name = "P1";
const defaultP2Name = "P2";
var p1BoxTextSize = 0;
var p2BoxTextSize = 0;
// Score text box
var circleFarRight;
var scoreRectWidth;
var scoreRectHeight;
const verticalPadding = 20;
const horizontalPadding = 100;
var p1TextScoreSize = 0;
var p2TextScoreSize = 0;






function windowResized() {
  const css = getComputedStyle(canvas.parentElement),
    marginWidth = round(float(css.marginLeft) + float(css.marginRight)),
    marginHeight = round(float(css.marginTop) + float(css.marginBottom));
  resizeCanvas(windowWidth - marginWidth, windowHeight - marginHeight, true);
  gridDrawX = (width - (WIDTH - 1) * distBetweenCircles) / 2;
  gridDrawY = (height - (HEIGHT - 1) * distBetweenCircles) / 2;
  circleFarRight = circleRad + gridDrawX + distBetweenCircles * (WIDTH - 1);
  scoreRectWidth = (width - circleFarRight) - horizontalPadding * 2;
  scoreRectHeight = height / 5;
  p1BoxTextSize = autoFontSize(p1Name, distBetweenCircles - circleDia);
  p2BoxTextSize = autoFontSize(p2Name, distBetweenCircles - circleDia);
  p1TextScoreSize = autoFontSize(p1Name+" score", scoreRectWidth);
  p2TextScoreSize = autoFontSize(p2Name+" score", scoreRectWidth);
}

function setup() {
  // canvas setup
  windowResized();
  // logic setup
  verticalLinesWonOver = Array.from(Array(HEIGHT - 1), _ => Array(WIDTH).fill(UNKNOWN));
  horizontalLinesWonOver = Array.from(Array(HEIGHT), _ => Array(WIDTH - 1).fill(UNKNOWN));
  boxesWonOver = Array.from(Array(HEIGHT - 1), _ => Array(WIDTH - 1).fill(UNKNOWN));
  finalizeNames();
  // drawing setup
  noStroke();
  hoveringLineColor = color(120, 120, 120);
  p1Color = color(0, 200, 0);
  p2Color = color(200, 0, 0);
  // text box score
  circleFarRight = circleRad + gridDrawX + distBetweenCircles * (WIDTH - 1);
  scoreRectWidth = (width - circleFarRight) - horizontalPadding * 2;
  scoreRectHeight = height / 5;
  p1BoxTextSize = autoFontSize(p1Name, distBetweenCircles - circleDia);
  p2BoxTextSize = autoFontSize(p2Name, distBetweenCircles - circleDia);
  p1TextScoreSize = autoFontSize(p1Name+" score\n"+" ".repeat(p1Name.length-str(p1_score).length)+p1_score, scoreRectWidth);
  p2TextScoreSize = autoFontSize(p2Name+" score\n"+" ".repeat(p2Name.length-str(p2_score).length)+p2_score, scoreRectWidth);
}



function resetLogic() {
  verticalLinesWonOver = Array.from(Array(HEIGHT - 1), _ => Array(WIDTH).fill(UNKNOWN));
  horizontalLinesWonOver = Array.from(Array(HEIGHT), _ => Array(WIDTH - 1).fill(UNKNOWN));
  boxesWonOver = Array.from(Array(HEIGHT - 1), _ => Array(WIDTH - 1).fill(UNKNOWN));
  numBoxesWonOver = 0;
  p1Name = defaultP1Name;
  p2Name = defaultP2Name;
  p1_score = 0;
  p2_score = 0;
  currentTurn = currentTurn = (p1_score > p2_score ? P1 : P2);
}

function finalizeNames() {
  if (p1Name.length > maxNameLength)
    p1Name = p1Name.substring(0, maxNameLength) + bigNameSuffix;
  if (p2Name.length > maxNameLength)
    p2Name = p2Name.substring(0, maxNameLength) + bigNameSuffix;
}

function autoFontSize(txt, rectWidth) {
  let txtSize = int(str(width));
  textSize(txtSize);
  while (textWidth(txt) > rectWidth) {
    txtSize -= 0.5;
    textSize(txtSize);
  }
  return txtSize;
}

function yGrid(y) {
  return gridDrawY + distBetweenCircles * y;
}

function xGrid(x) {
  return gridDrawX + distBetweenCircles * x;
}

function increaseScore(playerNumber) {
  if (playerNumber == P1)
    p1_score++;
  else
    p2_score++;
}






function mousePressed() {
  let checkBlockWonOver = false;
  let line1_I = -1;
  let line1_II = -1;
  let line2_I = -1;
  outer:
    for (i = 0; i < HEIGHT; i++) {
      for (ii = 0; ii < WIDTH; ii++) {
        if (i - 1 >= 0 && verticalLinesWonOver[i - 1][ii] == UNKNOWN && mouseInsideRectangle(xGrid(ii), yGrid(i), xGrid(ii), yGrid(i - 1))) {
          verticalLinesWonOver[i - 1][ii] = currentTurn;
          checkBlockWonOver = true;
          line1_I = i - 1;
          line1_II = ii;
          line2_I = i;
          break outer;
        } else if (ii - 1 >= 0 && horizontalLinesWonOver[i][ii - 1] == UNKNOWN && mouseInsideRectangle(xGrid(ii), yGrid(i), xGrid(ii - 1), yGrid(i))) {
          horizontalLinesWonOver[i][ii - 1] = currentTurn;
          checkBlockWonOver = true;
          line1_I = i;
          line1_II = ii - 1;
          line2_I = i;
          break outer;
        }
      }
    }
  var boxWonOver = false;
  if (checkBlockWonOver) {
    for (i = 0; i < HEIGHT - 1; i++) {
      for (ii = 0; ii < WIDTH - 1; ii++) {
        if (boxesWonOver[i][ii] == UNKNOWN && verticalLineOccupied(i, ii) && verticalLineOccupied(i, ii + 1) && horizontalLineOccupied(i, ii) && horizontalLineOccupied(i + 1, ii)) {
          if (line1_I < line2_I) {
            boxesWonOver[i][ii] = verticalLinesWonOver[line1_I][line1_II];
            increaseScore(verticalLinesWonOver[line1_I][line1_II])
          } else {
            boxesWonOver[i][ii] = horizontalLinesWonOver[line1_I][line1_II];
            increaseScore(horizontalLinesWonOver[line1_I][line1_II])
          }
          boxWonOver = true;
          numBoxesWonOver++;
        }
      }
    }
    if (!boxWonOver)
      currentTurn = (currentTurn == P1 ? P2 : P1);
    if (numBoxesWonOver == (WIDTH - 1) * (HEIGHT - 1))
      resetLogic();
  }
  return false;
}



function mouseInsideRectangle(p1x, p1y, p2x, p2y) {
  const px1 = min(p1x, p2x);
  const py1 = min(p1y, p2y);
  const px2 = max(p1x, p2x);
  const py2 = max(p1y, p2y);
  return mouseX > px1 - circleRad && mouseX < px2 + circleRad && mouseY > py1 - circleRad && mouseY < py2 + circleRad;
}


function draw() {
  background(20);

  // Draw line mouse is hovering over and circles
  outer:
    for (i = 0; i < HEIGHT; i++) {
      for (ii = 0; ii < WIDTH; ii++) {
        if (i - 1 >= 0 && mouseInsideRectangle(xGrid(ii), yGrid(i), xGrid(ii), yGrid(i - 1))) {
          fill(hoveringLineColor);
          drawHovering(ii, i, ii, i - 1);
          break outer;
        } else if (ii - 1 >= 0 && mouseInsideRectangle(xGrid(ii), yGrid(i), xGrid(ii - 1), yGrid(i))) {
          fill(hoveringLineColor);
          drawHovering(ii, i, ii - 1, i);
          break outer;
        }
      }
    }

  // Draw vertical lines won over
  for (i = 0; i < HEIGHT - 1; i++) {
    for (ii = 0; ii < WIDTH; ii++) {
      if (verticalLinesWonOver[i][ii] != UNKNOWN) {
        if (verticalLinesWonOver[i][ii] == P1)
          fill(p1Color);
        else if (verticalLinesWonOver[i][ii] == P2)
          fill(p2Color);
        drawHovering(ii, i, ii, i + 1);
      }
    }
  }
  // Draw horizontal lines won over
  for (i = 0; i < HEIGHT; i++) {
    for (ii = 0; ii < WIDTH - 1; ii++) {
      if (horizontalLinesWonOver[i][ii] != UNKNOWN) {
        if (horizontalLinesWonOver[i][ii] == P1)
          fill(p1Color);
        else if (horizontalLinesWonOver[i][ii] == P2)
          fill(p2Color);
        drawHovering(ii, i, ii + 1, i);
      }
    }
  }

  // Draw boxes won over
  textAlign(CENTER, CENTER);
  textSize(32);
  for (i = 0; i < HEIGHT - 1; i++) {
    for (ii = 0; ii < WIDTH - 1; ii++) {
      if (boxesWonOver[i][ii] == P1) {
        fill(p1Color);
        textSize(p1BoxTextSize);
        text(p1Name, gridDrawX + ii * distBetweenCircles + distBetweenCircles / 2, gridDrawY + i * distBetweenCircles + distBetweenCircles / 2);
      } else if (boxesWonOver[i][ii] == P2) {
        fill(p2Color);
        textSize(p2BoxTextSize);
        text(p2Name, gridDrawX + ii * distBetweenCircles + distBetweenCircles / 2, gridDrawY + i * distBetweenCircles + distBetweenCircles / 2);
      }
    }
  }

  // Draw circles
  noStroke();
  fill(255);
  for (i = 0; i < HEIGHT; i++)
    for (ii = 0; ii < WIDTH; ii++)
      circle(xGrid(ii), yGrid(i), circleDia);

  
  // Draw score of both players
  textAlign(CENTER, CENTER);
  strokeWeight(3);
  
  stroke(p1Color);
  transparentRect(circleFarRight + horizontalPadding, height / 2 - scoreRectHeight - verticalPadding / 2, scoreRectWidth, scoreRectHeight);
  textSize(p1TextScoreSize);
  noStroke();
  text(p1Name + " score\n" + " ".repeat(p1Name.length - str(p1_score).length) + p1_score, circleFarRight + horizontalPadding + scoreRectWidth / 2, height / 2 - scoreRectHeight / 2 - verticalPadding / 2);
  
  stroke(p2Color);
  transparentRect(circleFarRight + horizontalPadding, height / 2 + verticalPadding / 2, scoreRectWidth, scoreRectHeight);
  textSize(p2TextScoreSize);
  noStroke();
  text(p2Name + " score\n" + " ".repeat(p2Name.length - str(p2_score).length) + p2_score, circleFarRight + horizontalPadding + scoreRectWidth / 2, height / 2 + scoreRectHeight / 2 + verticalPadding / 2);
}




function multString(txt, times) {
  let n = "";
  print('"' + txt + '"');
  print(times);
  for (i = 0; i < times; i++)
    n += txt;
}

function transparentRect(x, y, w, h) {
  line(x, y, x + w, y);
  line(x + w, y, x + w, y + h);
  line(x, y + h, x + w, y + h);
  line(x, y, x, y + h);
}

function centeredXTransparentRect(x, y, w, h) {
  transparentRect(x - w / 2, y, w, h);
}

function drawHovering(hx1, hy1, hx2, hy2) {
  const px1 = min(hx1, hx2);
  const py1 = min(hy1, hy2);
  const px2 = max(hx1, hx2);
  const py2 = max(hy1, hy2);
  if (px2 > px1)
    rect(xGrid(px1) - circleRad, yGrid(py1) - circleRad, distBetweenCircles + circleDia, circleDia, circleRad, circleRad);
  else if (py2 > py1)
    rect(xGrid(px1) - circleRad, yGrid(py1) - circleRad, circleDia, distBetweenCircles + circleDia, circleRad, circleRad);
}


function verticalLineOccupied(vi, vii) {
  return verticalLinesWonOver[vi][vii] == P1 || verticalLinesWonOver[vi][vii] == P2;
}

function horizontalLineOccupied(vi, vii) {
  return horizontalLinesWonOver[vi][vii] == P1 || horizontalLinesWonOver[vi][vii] == P2;
}