/* CHART_PREVIEW_MODE is true if viewing the chart as an output of code input,
 * false if editing the chart as an input for code output.
 */
var CHART_PREVIEW_MODE = true;


var currentPaletteColor = "gray";


function setUpChartEdit() {
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
    });}


/* Toggles between View/Edit mode on Chart mode. */
function toggleChartPreviewMode() {
    CHART_PREVIEW_MODE = !CHART_PREVIEW_MODE;
    if(CHART_PREVIEW_MODE) {
        $("#chartModeBtn").html("View");
    } else {
        $("#chartModeBtn").html("Edit");
    }

    if(CHART_VIEW) {
        // We just now created this table, so add a listener for Chart Edit Mode
        setUpChartEdit();

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
        // don't add anything if the palette color hasn't been chosen
        if(colorToSet == "gray") return;
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

$(document).ready(function() {
    /*
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
    */



    $("#chartModeBtn").click(function() {
        toggleChartPreviewMode();
    });

    $("#colorTable td.color").click(function() {
        var colorId = $(this).attr('id');
        var color = colorId.split("-")[1]; // e.g., "color-red"-> "red"
        $("#colorTableCurrent").removeClass(currentPaletteColor);
        $("#colorTableCurrent").addClass(color);
        currentPaletteColor = color;

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
    /*
    if(currentColor != "white") {
        codeText += getFuncCallText("setColor", currentColor, true);
    }
    */    
    codeText += getFuncCallText("setColor", currentColor, true);

    /*
     * POSSIBLE CHANGE SCENARIOS AND SAMPLE OUTPUT:
     *     change color and stitch at the same time => knit(2); setColor("blue"); purl(2); 
     *     change color, but not stitch => knit(2); setColor("blue"); knit(2);
     *     change stitch only -> knit(2); purl(2);
     */

    //console.log("at start, currentColor = " + currentColor + ", isPurlStitch = " + isPurlStitch);
    for(var i = 0; i < currentPatternList.length; i++) {
        var stitchCounter = 0;
        codeText += "// Row " + (i+1) + TEXTAREA_NEWLINE;
        //console.log("*** ROW " + (i+1) + " ***");
        isPurlStitch = currentPatternList[i][0].isPurl;
        if(currentPatternList[i][0].color != currentColor) {
            currentColor = currentPatternList[i][0].color;
            codeText += getFuncCallText("setColor", currentColor, true);
        }
        for(var j = 0; j < STITCHES_PER_ROW; j++) {
            var currentStitch = currentPatternList[i][j];
            //console.log(currentStitch);
            //var isPurlStitch = currentStitch.isPurl;
            //console.log("currentColor = " + currentColor + ", isPurlStitch = " + isPurlStitch);
            if(currentStitch.color != currentColor) {
                // 
                codeText += getFuncCallText((isPurlStitch ? "purl" : "knit"), stitchCounter, false);
                codeText += getFuncCallText("setColor", currentStitch.color, true);
                currentColor = currentStitch.color;
                isPurlStitch = currentStitch.isPurl; // might stay the same, might change; either way this becomes a starting point
                stitchCounter = 1;
            } else if(currentStitch.isPurl != isPurlStitch) {
                // add function call for previous run of stitches
                codeText += getFuncCallText((isPurlStitch ? "purl" : "knit"), stitchCounter, false);
                stitchCounter = 1;
                isPurlStitch = currentStitch.isPurl;
            } else {
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

    
    setUpChartEdit();
}