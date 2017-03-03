/* CHART_VIEW is true if viewing the symbolic knitting pattern,
 * false if viewing the illustrated pattern.
 */
var CHART_VIEW = true;


var KNIT_CONTENTS = "&nbsp;";
var PURL_CONTENTS = "&#9679;";
var RIGHT_POINTING_ARROW = "&#8594;";
var LEFT_POINTING_ARROW = "&#8592;";
var TEXTAREA_NEWLINE = "\n";


var STITCHES_PER_ROW;       // constant per knitting pattern
var numRows = 0;            // tracker for number of rows in the currently built pattern
var currentColor;           // tracker for the color of the current stitch in a pattern
var currentPatternList = [];    // list for building patterns, row by row
var currentRowList = [];        // list of stitches for current row
var stopProgram = false;    // true if code executes without runtime error, false otherwise

function Stitch(isPurl, color) {
    this.isPurl = isPurl;
    this.color = color;
}


function showError(errorMsg) {
    $("#error").append("<p class='error'>" + errorMsg + "</p>");
    console.log(errorMsg);
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
        currentRowList.push(newStitch);
    }
    checkForRowEnd();
}

function purl(numStitches) {
    addStitches(numStitches, true);
}

function knit(numStitches) {
    addStitches(numStitches, false);
}

function setColor(newColor) {
    // TODO: handle out-of-bounds colors
    currentColor = newColor;
}

function checkForRowEnd() {
    if(currentRowList.length == STITCHES_PER_ROW) {
        currentPatternList.push(currentRowList);
        numRows++;
        currentRowList = [];
    }
}

function knitRow() {
    if(currentRowList.length != 0) {
        showError("Tried to add full row when other stitches were already in row");
    }
    knit(STITCHES_PER_ROW);
}

function purlRow() {
    if(currentRowList.length != 0) {
        showError("Tried to add full row when other stitches were already in row");
    }
    purl(STITCHES_PER_ROW);
}

function getStitchListFromChart(chart) {
    var stitches = [];
    var numChartRows = $("#chartTable tr").length;
}

function translateCodeToPattern() {
    $("#error").html("");
    currentColor = "white";
    currentPatternList = [];
    numRows = 0;
    var code = $("textarea").val();
    try {
        eval(code);
    }
    catch(err) {
        showError(err);
    }
    if(!stopProgram) {
        console.log("done translating, showing pattern...");
        var newPattern = new Pattern(numRows, STITCHES_PER_ROW, currentPatternList);
        console.log(newPattern);
        //displayChart(newPattern);
        displayPattern(newPattern, CHART_VIEW);
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

function displayPattern(pattern, isChartView) {
    /* knitting patterns read bottom to top, and right to left or left to right depending on the row
     * (or rather, whether you're knitting the right side or the wrong side):
     *      row 4 (WS): 1 2 3 4 -> 0 1 2 3
     *      row 3 (RS): 4 3 2 1 -> 3 2 1 0
     *      row 2 (WS): 1 2 3 4
     *      row 1 (RS): 4 3 2 1
     */
    // start at the nth row and work our way down
    var table = $("<table></table>").attr("id", (isChartView ? "chartTable" : "patternTable"));
    for(var row = pattern.rows; row > 0; row--) {
        var tableRow = $("<tr></tr>");
        var rowIndex = row - 1;
        var rowIsRightSide = isOdd(row);
        // depending on right side/wrong side
        // border arrows for marking which side to start on
        var leftMarkerCol = $("<td></td>");
        leftMarkerCol.addClass("white");
        if(!rowIsRightSide && isChartView) { // WS
            leftMarkerCol.html(RIGHT_POINTING_ARROW);
        }
        tableRow.append(leftMarkerCol);
        for(var stitchNum = 1; stitchNum <= pattern.stitchesPerRow; stitchNum++) {
            var rowCol = $("<td></td>");

            // here: stitchNum is the nth stitch knitted in a row regardless of RS/WS, 1 <= stitchNum <= stitchesPerRow
            var stitchIndex = getStitchIndex(stitchNum, pattern.stitchesPerRow, rowIsRightSide);
            // identify by row number and col number in right->left order
            // so the BOTTOM RIGHT is "0-0" and the TOP LEFT is "(width-1)-(height-1)"
            // (not the standard for coordinates, but fits knitting chart convention)
            rowCol.attr('id', (rowIndex + "-" + (pattern.stitchesPerRow - stitchNum))); 
            var stitch = pattern.stitchList[rowIndex][stitchIndex];
            if(isChartView) {
                var cellContents = (stitch.isPurl ? PURL_CONTENTS : KNIT_CONTENTS);
                rowCol.html(cellContents);
            } else { // pattern view
                if(isOdd(row)) { // odd-number row => right side
                    rowCol.addClass((stitch.isPurl ? "rightSidePurl" : "rightSideKnit"));
                } else {            // even-number row => wrong side
                    rowCol.addClass((stitch.isPurl ? "wrongSidePurl" : "wrongSideKnit"));
                }
            }
            rowCol.addClass(stitch.color);
            tableRow.append(rowCol);
        }
        // border arrows for marking which side to start on
        var rightMarkerCol = $("<td></td>");
        rightMarkerCol.addClass("white");
        if(rowIsRightSide && isChartView) { // WS
            rightMarkerCol.html(LEFT_POINTING_ARROW);
        }
        tableRow.append(rightMarkerCol);
        table.append(tableRow);
    }
    $("#display").empty();
    $("#display").append(table);
}


function showPatternView() {
    var pattern = new Pattern(numRows, STITCHES_PER_ROW, currentPatternList);
    displayPattern(pattern, false);
}

function showChartView() {
    var pattern = new Pattern(numRows, STITCHES_PER_ROW, currentPatternList);
    displayPattern(pattern, true);
}

function setView(isChartView) {
    var oldView = CHART_VIEW;
    CHART_VIEW = isChartView;
    if(CHART_VIEW != oldView) { // if view has switched
        if(CHART_VIEW) {
            showChartView();
        } else {
            showPatternView();
        }
    }
}




$(document).ready(function() {
    
    $("#runCodeBtn").click(function() {
        var code = $("textarea").val();
        translateCodeToPattern();


        //var testPattern = new Pattern(pt);
        //displayChart(pt);
    });

    $("#chartViewBtn").click(function() {
        setView(true);
    });
    
    $("#patternViewBtn").click(function() {
        setView(false);
    });
});