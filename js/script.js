var NUM_ROWS;
var STITCHES_PER_ROW;
var currentPattern = [];
var currentRow = [];
var stopProgram = false;

function sayHello() {
	console.log("Hello world");
}


function ProblemAnswer(options) {
    var options = options ? options : {};

    this.solnLineArray = options.solnLineArray ? options.solnLineArray : [];
    this.freeResponseArray = options.freeResponseArray ? options.freeResponseArray : [];
}

function Stitch(options) {
    var options = options ? options : {};
    this.isPurl = options.isPurl;
    this.color = options.color;
}

function Stitch(isPurl, color) {
    this.isPurl = isPurl;
    this.color = color;
}

function showError(errorMsg) {
    $("#error").append("<p class='error'" + errorMsg + "</p>");
    console.log(errorMsg);
}

function setNumberOfRows(numRows) {
    console.log(numRows);
    NUM_ROWS = numRows;
}

function setStitchesPerRow(numStitches) {
    STITCHES_PER_ROW = numStitches;
}

function addStitches(numStitches, isPurl) {
    if(numStitches > STITCHES_PER_ROW) {
        showError("Tried to add more stitches than fit in the row");
        // TODO: stop the program
    }
    for(var i = 0; i < numStitches; i++) {
        var newStitch = new Stitch(isPurl, currentColor);
        currentRow.push(newStitch);
    }
    checkForRowEnd();
}

function purl(numStitches) {
    addStitches(numStitches, true);
}

function knit(numStitches) {
    addStitches(numStitches, false);
}

function changeColor(newColor) {
    // TODO: handle out-of-bounds colors
    currentColor = newColor;
}

function checkForRowEnd() {
    if(currentRow.length == STITCHES_PER_ROW) {
        currentPattern.push(currentRow);
        currentRow = [];
    }
}

function knitRow() {
    if(currentRow.length != 0) {
        showError("Tried to add full row when other stitches were already in row");
    }
    knit(STITCHES_PER_ROW);
}

function purlRow() {
    if(currentRow.length != 0) {
        showError("Tried to add full row when other stitches were already in row");
    }
    purl(STITCHES_PER_ROW);
}



function translateCodeToPattern() {
    console.log("got code, starting translation...");
    currentColor = "white";
    var code = $("textarea").val();
    try {
        eval(code);
    }
    catch(err) {
        showError(err);
    }
    if(!stopProgram) {
        console.log("done translating, showing pattern...");
        var newPattern = new Pattern(NUM_ROWS, STITCHES_PER_ROW, currentPattern);
        console.log(newPattern);
        displayChart(newPattern);
    }
}

/*
 * Patterns are assumed to be a set of directions for knitting, rather than a set of directions for the chart.
 * Therefore, the first row in a pattern is assumed to be the first row to knit.
 * In a typical knitting chart, this would be the bottom row of the chart.
 * Changes in color are not accounted for in this pattern object. This is done when translating code into the pattern represented here.
 */
function Pattern(rows, stitchesPerRow, stitchList) {
    this.rows = rows;
    this.stitchesPerRow = stitchesPerRow;
    this.stitchList = stitchList;
}
/*
function Pattern(options) {
    var options = options ? options : {};
    this.rows = options.rows;
    this.stitchesPerRow = options.stitchesPerRow;
    this.stitchList = options.stitchList ? options.stitchList : [];
}
*/
function isOdd(n) {
    return (n % 2 == 1);
}

function getStitchIndex(stitchNum, stitchesPerRow, isRS) {
    if(isRS) {
        return (stitchesPerRow - stitchNum);

    } else {
        return (stitchNum - 1);
    }
}

function displayChart(pattern) {
    /* knitting patterns read bottom to top, and right to left or left to right depending on the row
     * (or rather, whether you're knitting the right side or the wrong side):
     *      row 4 (WS): 1 2 3 4 -> 0 1 2 3
     *      row 3 (RS): 4 3 2 1 -> 3 2 1 0
     *      row 2 (WS): 1 2 3 4
     *      row 1 (RS): 4 3 2 1
     */
    // start at the nth row and work our way down
    var table = $("<table></table>").attr('id','patternTable');
    for(var row = pattern.rows; row > 0; row--) {
        var tableRow = $("<tr></tr>");
        var rowIndex = row - 1;
        var rowIsRightSide = isOdd(row);
        // depending on right side/wrong side
        for(var stitchNum = 1; stitchNum <= pattern.stitchesPerRow; stitchNum++) {
            var rowCol = $("<td></td>");

            // here: stitchNum is the nth stitch knitted in a row regardless of RS/WS, 1 <= stitchNum <= stitchesPerRow
            var stitchIndex = getStitchIndex(stitchNum, pattern.stitchesPerRow, rowIsRightSide);
            var stitch = pattern.stitchList[rowIndex][stitchIndex];
            var cellContents = (stitch.isPurl ? "&#9679;" : "&nbsp;");
            rowCol.html(cellContents);
            rowCol.addClass(stitch.color);
            tableRow.append(rowCol);
        }
        table.append(tableRow);
    }
    $("#display").append(table);
}

/*
var pt = {
    rows:2,
    stitchesPerRow:3,
    stitchList: [[new Stitch(false, "blue"), new Stitch(true, "blue"), new Stitch(false, "blue")],
                 [new Stitch(true, "red"), new Stitch(false, "red"), new Stitch(true, "red")]]
    // want to come out like:
    // row 2: P K P
    // row 1: K P K
}
*/

$(document).ready(function() {
	$("button").click(function() {
		var code = $("textarea").val();
		translateCodeToPattern();


        //var testPattern = new Pattern(pt);
        //displayChart(pt);
	});

});