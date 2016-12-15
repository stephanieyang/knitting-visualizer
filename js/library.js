PAGE_ALLOWS_EDITS = false;
CHART_PREVIEW_MODE = true;

$(document).ready(function() {
	document.getElementById("codeText").readOnly = true;;
	$("a").click(function() {
		var id = $(this).attr("id");
		var desc = infoLibrary[id].description;
		var code = infoLibrary[id].code;
		$("#infoArea").html(desc);
		$("textarea").val(code);
	});
});