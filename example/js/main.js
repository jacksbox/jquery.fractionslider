$(window).load(function(){
	$('.slider').fractionSlider({
		'fullWidth': 			true,
		'controls': 			true, 
		'pager': 				true,
		'responsive': 			true,
		'dimensions': 			"1000,400",
	    'increase': 			false,
		'pauseCallback': 		function(){console.log(this);},
		'resumeCallback': 		function(){console.log("resumeCallback");},
		'startCallback': 		function(){console.log("startCallback");}
	});
	
	$('.fraction-slider').mouseenter(function(){
		$('.slider').fractionSlider("pause")
	});
	$('.fraction-slider').mouseleave(function(){
		$('.slider').fractionSlider("resume")
	});

});