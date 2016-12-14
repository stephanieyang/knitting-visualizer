/* CHART_VIEW is true if viewing the symbolic knitting pattern,
 * false if viewing the illustrated pattern.
 */
var CHART_VIEW = true;

/* CHART_PREVIEW_MODE is true if viewing the chart as an output of code input,
 * false if editing the chart as an input for code output.
 */
var CHART_PREVIEW_MODE = true;

var KNIT_CONTENTS = "&nbsp;";
var PURL_CONTENTS = "&#9679;";
var TEXTAREA_NEWLINE = "\n";


var STITCHES_PER_ROW;       // constant per knitting pattern
var numRows = 0;            // tracker for number of rows in the currently built pattern
var currentColor;           // tracker for the color of the current stitch in a pattern
var currentPatternList = [];    // list for building patterns, row by row
var currentRowList = [];        // list of stitches for current row
var stopProgram = false;    // true if code executes without runtime error, false otherwise

var currentPaletteColor = "white";

/* Toggles between View/Edit mode on Chart mode. */
function toggleChartPreviewMode() {
    CHART_PREVIEW_MODE = !CHART_PREVIEW_MODE;
    if(CHART_PREVIEW_MODE) {
        $("#chartModeBtn").html("View");
    } else {
        $("#chartModeBtn").html("Edit");
    }
}

function showPatternView() {
    var pattern = new Pattern(numRows, STITCHES_PER_ROW, currentPatternList);
    displayPattern(pattern, false);
}

function showChartView() {
    var pattern = new Pattern(numRows, STITCHES_PER_ROW, currentPatternList);
    console.log(pattern);
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

function translateChartToCode() {
    var table = $("#chartTable");
    var numChartRows = $("#chartTable tr").val();
    for(var i = 0; i < numChartRows; i++) {

    }
}



function getStitchListFromChart(chart) {
    var stitches = [];
    var numChartRows = $("#chartTable tr").length;
}

function translateCodeToPattern() {
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
        table.append(tableRow);
    }
    $("#display").empty();
    $("#display").append(table);

    if(isChartView) {
        // We just now created this table, so add a listener for Chart Edit Mode
        $("#chartTable td").click(function(event) {
            if(!CHART_PREVIEW_MODE) {
                // if the user presses CTRL (Windows) or the command button (Mac), change color to the one in the palette
                // (note: this also allows it when the Windows key is pressed on Windows computers, but that's not a huge concern here)
                var colorEditMode = event.ctrlKey || event.metaKeyCode;
                var stitchId = $(this).attr('id');
                //console.log($(this).attr('id'));
                /*
                if(colorEditMode) {
                    // clear the current class
                    $(this).removeClass($(this).attr('class'));
                    // set the new color
                    var colorToSet = $("#colorTableCurrent").attr('class');
                    $(this).addClass(colorToSet);
                } else {
                    // toggle knit/purl symbols
                    if($(this).html() == KNIT_CONTENTS) {   // knit stitch -> purl stitch
                        $(this).html(PURL_CONTENTS);
                    } else {                                // purl stitch -> knit stitch
                        $(this).html(KNIT_CONTENTS);
                    }
                }
                modifyChartStitch(stitchId);
                */
                modifyChartStitch(stitchId, colorEditMode);

            } else {
                console.log('clicked in preview mode');
            }
        });

    }
}

/*
 * Modifies the visible stitch in the output table and in the pattern in memory.
 * stitchId = id of the table cell that represents the stitch
 * modifyColor = true iff changing the cell color on CTRL/meta + click, false (toggling knit/purl) otherwise
 */
function modifyChartStitch(stitchId, modifyColor) {
    var chartRow = stitchId.split("-")[0];
    var chartCol = stitchId.split("-")[1];
    var stitchIndex;
    var stitchCell = $("#" + stitchId);
    if(isOdd(chartRow)) { // if WS row, need to get the right stitch index in the pattern list
        stitchIndex = STITCHES_PER_ROW - chartCol - 1;
    } else {
        stitchIndex = chartCol;
    }
    var listStitch = currentPatternList[chartRow][stitchIndex];
    if(modifyColor) {
        var colorToSet = $("#colorTableCurrent").attr('class');
        if(colorToSet == "white") return;
        // clear the current class
        // console.log(stitchId);
        // console.log("class: " + stitchCell.attr('class'));
        stitchCell.removeClass(stitchCell.attr('class'));
        // set the new color
        stitchCell.addClass(colorToSet);
        listStitch.color = colorToSet;
    } else {
        // toggle knit/purl symbols
        if(stitchCell.html() == KNIT_CONTENTS) {   // knit stitch -> purl stitch
            stitchCell.html(PURL_CONTENTS);
        } else {                                // purl stitch -> knit stitch
            stitchCell.html(KNIT_CONTENTS);
        }

        listStitch.isPurl = !listStitch.isPurl;
    }
    // console.log(listStitch);
    //var stitch = currentPatternList[chartRow][0];
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

    $("#colorTable td.color").click(function() {
        var colorId = $(this).attr('id');
        var color = colorId.split("-")[1]; // e.g., "color-red"-> "red"
        $("#colorTableCurrent").removeClass(currentPaletteColor);
        $("#colorTableCurrent").addClass(color);
        currentPaletteColor = color;

    });

    $("#chartModeBtn").click(function() {
        toggleChartPreviewMode();
    });

    $("#resizeChartBtn").click(function() {
        console.log("resize clicked");
        resizeChart();
    });

    $("#generateCodeBtn").click(function() {

        // (in case the user edits them but doesn't resize)
        $("#numRowsInput").val(currentPatternList.length); // number of rows
        $("#stitchesPerRowInput").val(currentPatternList[0].length); // number of stitches per row (cols per row)
        generateCode();
    });


});

function getFuncCallText(funcName, param, paramIsStringValue) {
    var valueWrapper =  (paramIsStringValue ? "\"" : "");
    return (funcName + "(" + valueWrapper + param + valueWrapper + ");" + TEXTAREA_NEWLINE);
}

function generateCode() {
    console.log("Generating code...");
    var currentColor = currentPatternList[0][0].color;
    var isPurlStitch = currentPatternList[0][0].isPurl;
    // initial info
    var codeText = getFuncCallText("setStitchesPerRow", STITCHES_PER_ROW, false);
    if(currentColor != "white") {
        codeText += getFuncCallText("setColor", currentColor, true);
    }

    /*
     * POSSIBLE CHANGE SCENARIOS AND SAMPLE OUTPUT:
     *     change color and stitch at the same time => knit(2); setColor("blue"); purl(2); 
     *     change color, but not stitch => knit(2); setColor("blue"); knit(2);
     *     change stitch only -> knit(2); purl(2);
     */

    console.log("at start, currentColor = " + currentColor + ", isPurlStitch = " + isPurlStitch);
    for(var i = 0; i < currentPatternList.length; i++) {
        var stitchCounter = 0;
        codeText += "// Row " + (i+1) + TEXTAREA_NEWLINE;
        console.log("*** ROW " + (i+1) + " ***");
        isPurlStitch = currentPatternList[i][0].isPurl;
        if(currentPatternList[i][0].color != currentColor) {
            currentColor = currentPatternList[i][0].color;
            codeText += getFuncCallText("setColor", currentColor, true);
        }
        for(var j = 0; j < STITCHES_PER_ROW; j++) {
            var currentStitch = currentPatternList[i][j];
            console.log(currentStitch);
            //var isPurlStitch = currentStitch.isPurl;
            console.log("currentColor = " + currentColor + ", isPurlStitch = " + isPurlStitch);
            if(currentStitch.color != currentColor) {
                console.log("HERE 1");
                // 
                codeText += getFuncCallText((isPurlStitch ? "purl" : "knit"), stitchCounter, false);
                codeText += getFuncCallText("setColor", currentStitch.color, true);
                currentColor = currentStitch.color;
                isPurlStitch = currentStitch.isPurl; // might stay the same, might change; either way this becomes a starting point
                stitchCounter = 1;
            } else if(currentStitch.isPurl != isPurlStitch) {
                // add function call for previous run of stitches
                console.log("HERE 2");
                codeText += getFuncCallText((isPurlStitch ? "purl" : "knit"), stitchCounter, false);
                stitchCounter = 1;
                isPurlStitch = currentStitch.isPurl;
            } else {
                console.log("HERE 3");
                stitchCounter++;
            }
        }
        if(stitchCounter == STITCHES_PER_ROW) {
            codeText += getFuncCallText((isPurlStitch ? "purlRow" : "knitRow"), "", true);
        } else {
            codeText += getFuncCallText((isPurlStitch ? "purl" : "knit"), stitchCounter, false);
        }
    }

    $("#codeText").val(codeText);
    console.log("done generating code, text = " + codeText);
}

function getNewFillerStitch() {
    return (new Stitch(false, "white"));
}

function resizeChart() {
    if(!CHART_VIEW || CHART_PREVIEW_MODE) {
        showError("Can't resize: CHART_VIEW = " + CHART_VIEW + ", CHART_PREVIEW_MODE = " + CHART_PREVIEW_MODE);
        // TODO: more helpful error message?
        return;
    }

    var currentNumberRows = currentPatternList.length;
    var currentStitchesPerRow = STITCHES_PER_ROW;
    var newNumberRows = parseInt($("#numRowsInput").val());
    var newStitchesPerRow = parseInt($("#stitchesPerRowInput").val());

    if(newStitchesPerRow <= 0 || newNumberRows <= 0) {
        showError("Invalid input");
        // TODO: decimal input?
    }

    var horizontalDiff = newStitchesPerRow - STITCHES_PER_ROW;
    var verticalDiff = newNumberRows - currentNumberRows;

    // if no dimensions have been modified, skip all proceeding steps
    //if((horizontalDiff == 0) && (verticalDiff == 0)) return;
    if((horizontalDiff == 0) && (verticalDiff == 0)) {
        console.log("no difference");
        return;
    }

    var chartTable = $("#chartTable tbody");
    // console.log("chartTable = ");
    // console.log(chartTable);

    // modify the visible and in-memory charts

    if(horizontalDiff > 0) {
        // need to increase the width => "grow" new stitches on each row from the left (since we go right->left)
        // here we initialize new stitches as white knit stitches
        for(var i = 0; i < currentNumberRows; i++) {
            var tableRow = $("#" + i + "-0").parent();
            for(var j = currentStitchesPerRow; j < newStitchesPerRow; j++) {
                var newStitchCell = $("<td></td>").attr("id", i + "-" + j);
                newStitchCell.addClass("white");
                newStitchCell.html(KNIT_CONTENTS);
                tableRow.prepend(newStitchCell);
                currentPatternList[i].push(getNewFillerStitch());
            }
        }

    } else if(horizontalDiff < 0) {
        // need to decrease the width => remove extra stitches on each row from the left
        for(var i = 0; i < currentNumberRows; i++) {
            //for(var j = 0; j < newStitchesPerRow; j++) { console.log(j); }
            for(var j = currentStitchesPerRow; j >= newStitchesPerRow; j--) {
                var cellToRemove = $("#" + i + "-" + j);
                //console.log("calling remove on #" + cellToRemove.attr('id'));
                cellToRemove.remove();
            }
            currentPatternList[i] = currentPatternList[i].slice(0, newStitchesPerRow);
        }

        
    } // third case (=) => do nothing
    STITCHES_PER_ROW = newStitchesPerRow;
    if(verticalDiff > 0) {
        // need to increase the height => add new rows onto the end (vertical top)
        for(var i = currentNumberRows; i < newNumberRows; i++) {
            var rowString = "<tr>";
            var newPatternRow = [];
            for(var j = 0; j < STITCHES_PER_ROW; j++) {
                var cellString = "<td class='white' id='" + i + "-" + (STITCHES_PER_ROW - j - 1) + "'>" + KNIT_CONTENTS + "</td>";
                rowString += cellString;
                newPatternRow.push(getNewFillerStitch());
            }
            rowString += "</tr>";
            var rowToAdd = $(rowString);
            chartTable.prepend(rowToAdd);
            currentPatternList.push(newPatternRow);
        }

    } else if(verticalDiff < 0) {
        // need to decrease the height => remove extra rows at the end (vertical top)
        for(var i = newNumberRows; i < currentNumberRows; i++) {
            var tableRow = $("#" + i + "-0").parent();
            tableRow.remove();
            currentPatternList = currentPatternList.slice(0, newNumberRows);
        }

    } // third case (=) => do nothing
}