var infoLibrary = {
	"variables":{
		description:"<p><strong>Variables</strong> are changeable values. They can be numbers, strings (text inside quotation marks), complex data objects, and so on.</p>",
		code:"var numStitches = 5;\n\nsetColor(\"green\");\nsetStitchesPerRow(numStitches);\nknitRow();"
	},
	"functions":{
		description:"<p><strong>Functions</strong> are packaged, reusable code. They can take additional information or input (called the \"argument(s)\") as variables to work with.</p>",
		code:"setStitchesPerRow(6);\nsetColor(\"purple\");\n\nfunction singleRow() {\n  knit(1);\n  purl(1);\n  knit(1);\n  purl(1);\n  knit(1);\n  purl(1);\n}\n\nsingleRow();\nsingleRow();"
	},
	"loops":{
		description:"<p><strong>Loops</strong> allow you to repeat code over and over, potentially hundreds or thousands of time if you want!</p>",
		code:"setStitchesPerRow(8);\nsetColor(\"lightblue\");\n\nfunction ribStitchRow() {\n  for(var i = 0; i < 4; i++) {\n    knit(1);\n    purl(1);\n  }\n}\nfor(var row = 0; row < 10; row++) {\n  ribStitchRow();\n"
	},
	"conditionals":{
		description:"<p><strong>Conditionals</strong> allow you to change what code you run based on what's true at a given moment in the program.</p>",
		code:"setStitchesPerRow(8);\nsetColor(\"blue\");\n\nfunction isEven(n) {\n  return (n % 2 == 0);\n}\n\nfunction stockinetteRow(rowNumber) {\n  if(isEven(rowNumber)) {\n    knitRow();\n  } else {\n    purlRow();\n  }\n}\n\nfor(var i = 0; i < 6; i++) {\n  stockinetteRow(i);\n}"
	},
	"kvcode":{
		description:"<p>You can use six predefined functions to code in the Knitting Visualizer:</p>\n<ul>\n<li><code>setStitchesPerRow(numberOfStitches)</code> - specifies the width of the piece in stitches, used EXACTLY ONCE per program!</li>\n<li><code>setColor(colorName)</code> - changes the color of the yarn</li>\n<li><code>knit(numberOfStitches)</code> - adds <code>numberOfStitches</code> knit stitches at once</li>\n<li><code>purl(numberOfStitches)</code> - adds <code>numberOfStitches</code> purl stitches at once</li>\n<li><code>knitRow()</code> - adds knit stitches from the beginning to the end of a row (assuming you start at the beginning of a row!)</li>\n<li><code>purlRow()</code> - adds purl stitches from the beginning to the end of a row (assuming you start at the beginning of a row!)</li>\n</ul>",
		code:"setStitchesPerRow(8);\nsetColor(\"purple\");\n\nknit(2);\npurl(2);\nknit(2);\npurl(2);\n\nsetColor(\"green\");\n\nknitRow();\npurlRow();\n\nsetColor(\"pink\");\nknit(1);\npurl(1);\nknit(1);\npurl(1);\nknit(1);\npurl(1);\nknit(1);\npurl(1);"
	},
	"knit":{
		description:"<p>A <strong>knit stitch</strong> is one of the central building blocks in a knitting pattern. It is accomplished through using needles to create loops in yarn.</p><iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/Sjf37u6hdcM\" frameborder=\"0\" allowfullscreen></iframe>",
		code:"setStitchesPerRow(1);\nsetColor(\"green\");\n\nknit(1);"
	},
	"purl":{
		description:"<p>A <strong>purl stitch</strong> is the other central building block in a knitting pattern, after knitting stitches. A purl is basically a backwards knit stitch, so that the \"front\" of the stitch appears on the other side of the knitted piece.</p><iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/lkb0YyrzPWA\" frameborder=\"0\" allowfullscreen></iframe>",
		code:"setStitchesPerRow(1);\nsetColor(\"green\");\n\npurl(1);"
	},
	"garter":{
		description:"<p><strong>Garter stitch</strong>, unlike knit stitches and purl stitches, refers to an overall pattern of knitted (knit and purl) stitches.</p><p>Garter stitch is very simple: you knit every stitch on every row!</p>",
		code:"setStitchesPerRow(8);\nsetColor(\"lightblue\");\n\nfor(var i = 0; i < 6; i++) {\n  knitRow();\n}"
	},
	"stockinette":{
		description:"<p><strong>Stockinette stitch</strong> is done by alternating rows of knit stitches and rows of purl stitches, which creates a uniform front and back.</p><p>Note that because knit and purl stitches are not the same size in reality, when you knit stockinette stitch in real life you will see your piece start to curl at the edges! You can avoid this by adding a border of a different kind of stitch, such as seed stitch.</p>",
		code:"setStitchesPerRow(15);\nsetColor(\"orange\");\n\n\nfor(var row = 0; row < 15; row++) {\n  if(row % 2 == 0) {\n    knitRow();\n  } else {\n    purlRow();\n  }\n}"
	},
	"rib":{
		description:"<p><strong>Rib stitch</strong> is done by alternating short strings of knit stitches and purl stitches.</p><p>When knitted, rib stitch results in alternating columns of raised and lowered stitches, which lend a stretchy and flexible quality to the product. As such, it is common to see rib stitch used in gloves, hats, and anything else fitted on the body!</p><iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/VJ4BZ3or1Aw\" frameborder=\"0\" allowfullscreen></iframe>",
		code:"setStitchesPerRow(24);\nsetColor(\"yellow\");\n\nfunction ribUnit(stitchesPerCol) {\n  knit(stitchesPerCol);\n  purl(stitchesPerCol);\n}\n\nfor(var row = 0; row < 10; row++) {\n  for(var i = 0; i < 6; i++) {\n    ribUnit(2);\n  }\n}"
	},
	"seed":{
		description:"<p><strong>Seed stitch</strong> is done by alternating knit and purl stitches, and then alternating their order on different rows. The result is a pattern of raised bumps.</p><p>Seed stitch should be used primarily on pieces with an <em>even number</em> of stitches.</p><p>Unlike stockinette stitch, seed stitch creates an alternating pattern of knit and purl stitches. This balance means that seed stitch is less likely to stretch or otherwise change dimensions, which is why it may be used as a border to prevent stretching or curling in stockinette stitch.</p>",
		code:"setStitchesPerRow(8);\nsetColor(\"green\");\n\nfor(var i = 0; i < 4; i++) {\n  for(var j = 0; j < 4; j++) {\n    knit(1);\n    purl(1);\n  }\n  for(var j = 0; j < 4; j++) {\n    purl(1);\n    knit(1);\n  }\n}"
	},
	"moss":{
		description:"<p>Like seed stitch, <strong>moss stitch</strong> creates a pattern of raised bumps.</p><p>However, unlike seed stitch moss stitch is frequently used for pieces with an odd number of stitches, which creates different patterns on the front and back of the knitted piece.</p>",
		code:"setStitchesPerRow(21);\nsetColor(\"green\");\n\nfunction outerRow() {\n  knit(1);\n  for(var i = 0; i < 10; i++) {\n    purl(1);\n    knit(1);\n  }\n}\n\nfunction innerRow() {\n  purl(1);\n  for(var i = 0; i < 10; i++) {\n    knit(1);\n    purl(1);\n  }\n}\n\nfunction mossRepeat() {\n    outerRow();\n    innerRow();\n    innerRow();\n    outerRow();\n}\n\nfor(var times = 0; times < 5; times++) {\n    mossRepeat();\n}"
	},
	"sides":{
		description:"<p>The first side you start doing knit and purl stitches on (not the side you cast on with!) is generally called the <strong>right side</strong> of the knitted piece, due to being the side of the piece that is most frequently shown and/or that is often considered the front of the knitted piece. The <strong>left side</strong></p><p>Because knitting is done start-to-end and end-to-start again, the first knitted row and all odd-numbered rows are knitted on the right side. The second row and all even-numbered rows are knitted on the wrong side.</p>",
		code:"",
	},
	"chart":{
		description:"<p>Knitting charts are typically read <strong>from the bottom upwards</strong>.</p><p>When knitting on the right side, read from right to left.</p><p>When knitting on the wrong side, read from left to right.</p>",
		code:"",
	},
	"scarf":{
		description:"<p>Here's a pattern for a simple scarf: a stockinette scarf with a seed stitch to discourage curling or deformation based on the different stitches. (In reality you'd need a lot more than 38 rows for a scarf, but that pattern will be recognizable by then!)</p>",
		code:"setStitchesPerRow(24);\nsetColor(\"purple\");\n// Row 1\n\nfunction seedStitchBorder(numStitches, isRS) {\n  for(var i = 0; i < numStitches/2; i++) {\n    if(isRS) {\n      knit(1);\n      purl(1);\n    } else {\n      purl(1);\n      knit(1);\n    }\n  }\n}\n\nfor(var i = 0; i < 4; i++) {\n  seedStitchBorder(24, (i % 2 == 0));\n}\nfor(var i = 0; i < 30; i++) {\n  seedStitchBorder(4, (i % 2 == 0));\n  if(i % 2 == 0) { // RS row\n    knit(16);\n  } else {\n    purl(16);\n  }\n  seedStitchBorder(4, (i % 2 == 0));\n}\n\nfor(var i = 0; i < 4; i++) {\n  seedStitchBorder(24, (i % 2 == 0));\n}	"
	},
	"coaster":{
		description:"<p>A simple square garter stitch coaster is an easy first project for any beginner.</p>",
		code:"setStitchesPerRow(24);\nsetColor(\"lightblue\");\n// Row 1\n\nfor(var i = 0; i < 24; i++) {\n  knitRow();\n}"
	},
};