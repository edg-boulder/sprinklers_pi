(function(){
	$(document).bind('pageinit', function () {
	  $('#systemz').bind('change', function (e) {
		$.get("bin/run", {
		  system: this.value
		});
	  });
	});
	var timeout = 0;
	function pad(n, width, z) {
	  z = z || '0';
	  n = n + '';
	  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
	}
	$('#page1').on('pagebeforeshow', function () {
	  $.ajax("json/state", {async: false, dataType: "json", error: function () { alert ("Communications Failure" ); }, success: function (data) {
		$('#zones_lv span').text(data.zones);
		$('#schedules_lv span').text(data.schedules);
		var dt = new Date(data.timenow*1000);
		$('#version').text("V"+data.version);
		$('#timediv').empty().append('' + pad(dt.getUTCHours(),2) + ':' + pad(dt.getUTCMinutes(),2) + ':' + pad(dt.getUTCSeconds(),2) + ' ' + pad(dt.getUTCFullYear(),4) + '/' + pad(dt.getUTCMonth()+1,2) + '/' + pad(dt.getUTCDate(),2) );
		checkAnim(data);
	  }});
	});
	function checkAnim(data) {
		$('#systemz').val(data.run).slider('refresh');
		if (data.offtime != null) {
		  timeout = (new Date().getTime()) / 1000 + parseInt(data.offtime);
		  $('#szone').text(data.onzone);
		  $('#sgif').css('display', 'block');
		  if (parseInt(data.offtime) == 99999)
			$('#spantime').text("--:--");
		  else
			window.setTimeout(function () {updateAnim();}, 1);
		} else
		  $('#sgif').css('display', 'none');
	}
	function updateAnim() {
	  if ($.mobile.activePage.attr("id") != "page1") return;
	  var remaining = Math.floor(timeout - (new Date().getTime()) / 1000);
	  if (remaining >= 0) {
		$('#spantime').text(
		  Math.floor(remaining / 60).toString() + ":" + 
		  ("00" + (remaining % 60).toString()).substr(-2));
		  window.setTimeout(function () {updateAnim();}, 1000);
	  } else {
		$.getJSON("json/state", checkAnim);
	  }
	}
})();