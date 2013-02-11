/*
 * jQuery Fraction Slider v0.6
 * http://fractionslider.jacksbox.de
 *
 * Author: Mario Jäckle
 * eMail: support@jacksbopx.de
 *
 * Copyright 2013, jacksbox.design
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */


(function($) {
	
	/** ************************* **/
	/** SLDIER CLASS  **/
	/** ************************* **/
	
	// here happens all the fun
	var FractionSlider = function(element, options){
		
		var vars = {
			init: true, 
			currentSlide: 0,
			maxSlide: 0,
			currentStep: 0,
			maxStep: 0,
			currentObj: 0,
			maxObjs: 0,
			finishedObjs: 0,
		};
		
		// objs for current step
		var fractionObjs = null;
		
		// the slider element
		var slider = $(element);
		
		vars.maxSlide = slider.children('.slide').length - 1;
		
		// some more needed vars
		var sliderWidth = slider.width();
		var bodyWidth = $('body').width();
		var offsetX = (bodyWidth-sliderWidth)/2;
		if(options['fullWidth']){
			sliderWidth = bodyWidth;
		}
		var sliderHeight = slider.height();
		
		init();
		
		/** ************************* **/
		/** FUNCTIONS **/
		/** ************************* **/
		
		function init(){
			// some basic stuff
			slider.addClass('fraction-slider');
			
			if(options['controls']){
				slider.append('<a href="#" class="prev" ></a><a href="#" class="next" ></a>');
				
				slider.find('.next').bind('click', function(){
					slider.find('*').stop();
					endSlide(vars.currentSlide);
					vars.currentSlide++;
					vars.currentStep = 0;
					if(vars.currentSlide > vars.maxSlide){
						vars.currentSlide = 0;
					}
					startSlide();
				})
				slider.find('.prev').bind('click', function(){
					slider.find('*').stop();
					endSlide(vars.currentSlide);
					vars.currentSlide--;
					vars.currentStep = 0;
					if(vars.currentSlide < 0){
						vars.currentSlide = vars.maxSlide;
					}
					startSlide();
				})
			}

			if(options['fullWidth']){
				slider.css({'overflow': 'visible'});
			}else{
				slider.css({'overflow': 'hidden'});
			}
			
			
			// all importent stuff is done, everybody has taken a shower, we can go
			// starts the slider and the slide rotation
			slideRotation();
		}
		
		function slideRotation(){
			// set timeout | first slide instant start
			if(vars.init){
				var timeout = 0;
				vars.init = false;
			}else{
				var timeout = options['timeout'];
				vars.init = false;
			}
			
			// console.log('TIMEOUT');
			// timeout after slide is complete	
			setTimeout(function(){
					// console.log('slide change:');
					endSlide(vars.currentSlide-1);
					startSlide();
				}, 
				timeout
			);
		}
		
		// starts a slide
		function startSlide(){
			
			if(options['backgroundAnimation']){
				backgroundAnimation()
			};
			
			var slideObj = slider.children('.slide:eq('+vars.currentSlide+')');
			
			if(slideObj.length == 0){
				vars.currentSlide = 0;
				slideObj = slider.children('.slide:eq('+vars.currentSlide+')');
			}
			// console.log(' start slide: '+vars.currentSlide);
			
			getStepsForSlide();
			
			slideObj.show();
			slideObj.children().hide();
			
			vars.currentObj = 0;
			vars.maxObjs = 0;
			vars.finishedObjs = 0;
			
			iterateSteps();
		}
		
		// ends a slide
		function endSlide(slide){
			if(slide < 0){
				return;
			}
			var slideObj = slider.children('.slide:eq('+slide+')');
			
			// console.log(' end slide: '+slide);
			
			var objs = slider.children('.slide:eq('+slide+')').children();
			
			objs.each(function(){
				var obj = $(this);
				var position = obj.position();
				var transition = obj.attr("data-out");
				var easing = obj.attr("data-ease-out");
				
				if(transition == null){
					transition = options['transitionOut'];
				}
				
				if(easing == null){
					easing = options['easeOut'];
				}
				
				moveObjectOut(obj, position, transition, easing);
			}).promise().done(function(){slideObj.hide()});
		}
		
		// gets the maximum step for the current slide
		function getStepsForSlide(){
			var objs = slider.children('.slide:eq('+vars.currentSlide+')').children();
			var maximum = 0;
			
			objs.each(function() {
			  var value = parseFloat($(this).attr('data-step'));
			  maximum = (value > maximum) ? value : maximum;
			});
			
			vars.maxStep = maximum;
			// console.log('  max steps: '+ vars.maxStep);
		}
		
		/** SLIDE TIMELINE **/
		function iterateSteps(){
			
			if(vars.currentStep == 0){
				var objs = slider.children('.slide:eq('+vars.currentSlide+')').children('*:not([data-step]), *[data-step="'+vars.currentStep+'"]');
			}else{
				var objs = slider.children('.slide:eq('+vars.currentSlide+')').children('*[data-step="'+vars.currentStep+'"]');
			}
			
			vars.maxObjs = objs.length;
			
			fractionObjs = objs;
			
			if(vars.maxObjs > 0){
				
				vars.currentObj = 0;
				vars.finishedObjs = 0;
				
				iterateObjs();
			}else{	
				slider.trigger('fraction:stepFinished');
			}
		}
		
		function iterateObjs(){
			
			var obj = $(fractionObjs[vars.currentObj]);
			
			var position = obj.attr("data-position").split(',');
			var transition = obj.attr("data-in");
			var delay = obj.attr("data-delay");
			var speed = obj.attr('data-speed');
			var easing = obj.attr('data-ease-in');
			// check for special options
			var special = obj.attr("data-special");
            
			if(position == null){
				position = options['position'].split(',');
			}
			if(transition == null){
				transition = options['transitionIn'];
			}
			if(delay == null){
				delay = options['delay'];
			}
			if(easing == null){
				easing = options['easeIn'];
			}
				
			moveObjectIn(obj, position, transition, delay, speed, easing, special);
			
			vars.currentObj++;
			
			if(vars.currentObj < vars.maxObjs){
				iterateObjs();
			}else{
				vars.currentObj = 0;
			}
		}
		
		function objFinished(){
			vars.finishedObjs++;
			
			// console.log('  finished: '+vars.finishedObjs +"/"+ vars.maxObjs);
			
			if(vars.finishedObjs == vars.maxObjs){
				slider.trigger('fraction:stepFinished');
			}
		}
		
		slider.bind('fraction:stepFinished', function(){
			vars.currentStep++
			if(vars.currentStep > vars.maxStep){
				if(options['autoChange']){
					vars.currentSlide++;
					vars.currentStep = 0;

					slideRotation();
				}
				
				return;
			}
			iterateSteps();
		});
		
		/** ************************* **/
		/** TRANSITIONS **/
		/** ************************* **/
		
		/** IN TRANSITION **/
		function moveObjectIn(obj, position, transition, delay, speed, easing, special){
			var startY = null;
			var startX = null;
			var targetY = null;
			var targetX = null;
			
			// set start position
			switch(transition){
				case 'left':
					startY = position[0];
					startX = sliderWidth;
					break;
				case 'bottomLeft':
					startY = sliderHeight;
					startX = sliderWidth;
					break;
				case 'topLeft':
					startY = obj.outerHeight()*-1;
					startX = sliderWidth;
					break;
				case 'top':
					startY = obj.outerHeight()*-1;
					startX = position[1];
					break;
				case 'bottom':
					startY = sliderHeight;
					startX = position[1];
					break;
				case 'right':
					startY = position[0];
					startX = 0 - offsetX- obj.outerWidth();
					break;
				case 'bottomRight':
					startY = sliderHeight;
					startX = 0 - offsetX- obj.outerWidth();
					break;
				case 'topRight':
					startY = obj.outerHeight()*-1;
					startX = 0 - offsetX- obj.outerWidth();
					break;
			}
			
			// set target position
			targetY = position[0];
			targetX = position[1];
			
			if(speed == null){
				speed =options['speedIn'];
			}else{
				speed = parseInt(speed);
			}
			
			// set the delay
			setTimeout(function(){
				// for special=cylce 
				if(special == 'cycle'){
					var tmp = obj.prev();
					if(tmp.length > 0){
						var tmpPosition = $(tmp).attr('data-position').split(',');
					    	tmpPosition = {'top':tmpPosition[0],'left':tmpPosition[1]};
						var tmpTransition = $(tmp).attr('data-out');
							if(tmpTransition == null){
								tmpTransition = options['transitionOut'];
							}
						moveObjectOut(tmp, tmpPosition, tmpTransition, speed);
					}
				}
				// transition start
				 obj.css({"top": startY+"px", "left": startX+"px"})
					.show()
					.animate({"top": targetY+"px", "left": targetX+"px"}, 
							 speed, 
							 easing, 
							 function(){
							 	objFinished();
							 	}
							)
					.addClass('altSlider_el_active');
			},delay);
		}
		
		/** OUT TRANSITION **/
		function moveObjectOut(obj, position, transition, speed, easing){
			var targetY = null;
			var targetX = null;
			
			// set target position
			switch(transition){
				case 'left':
					targetY = position['top'];
					targetX = 0 - offsetX - 100 - obj.outerWidth();
					break;
				case 'bottomLeft':
					targetY = sliderHeight;
					targetX = 0 - offsetX - 100 - obj.outerWidth();
					break;
				case 'topLeft':
					targetY = obj.outerHeight()*-1;
					targetX = 0 - offsetX - 100 - obj.outerWidth();
					break;
				case 'top':
					targetY = obj.outerHeight()*-1;
					targetX = position['left'];
					break;
				case 'bottom':
					targetY = sliderHeight;
					targetX = position['left'];
					break;
				case 'right':
					targetY = position['top'];
					targetX = sliderWidth;
					break;
				case 'bottomRight':
					targetY = sliderHeight;
					targetX = sliderWidth;
					break;
				case 'topRight':
					targetY = obj.outerHeight()*-1;
					targetX = sliderWidth;
					break;
			}
			
			// get speed for the out transition
			if(speed == null){
				if(position['left']>targetX){
					distX = Math.abs(position['left']-targetX);
				}else
				if(position['left']>targetX){
					distX = Math.abs(targetX-position['left']);
				}else{
					distX = 0;
				}
				
				if(position['top']>targetY){
					distY = Math.abs(position['top']-targetY);
				}else
				if(targetY>position['top']){
					distY = Math.abs(targetY-position['top']);
				}else{
					distY = 0;
				}
				
				dist = Math.sqrt((distX*distX)+(distY*distY));
				
				// calculate the speed for transition
				var speed = (dist * (options['speedOut']/1000));	
			}	
			
			// transition start
			obj.animate({"top": targetY+"px", "left": targetX+"px"}, 
						speed, 
						easing, 
						function(){
							obj.hide();
							}
						)
				.removeClass('altSlider_el_active');
		}
		
		function backgroundAnimation(){
			if(options['backgroundElement'] == null || options['backgroundElement'] == ""){
				var el = slider;
			}else{
				var el = $(options['backgroundElement']);
			}
			
			var oldPos = el.css('background-position');
			    oldPos = oldPos.split(' ');
			var moveX = options['backgroundX'];	
			var moveY = options['backgroundY'];
			var x = Number(oldPos[0].replace(/[px]/g, '')) + moveX;	
			var y = Number(oldPos[0].replace(/[px]/g, '')) + moveY;
			
			el.animate({backgroundPositionX: x+'px', backgroundPositionY: y+'px'}, options['backgroundSpeed'], options['backgroundEase']);
		}
	}
	
	/** ************************* **/
	/** PLUGIN  **/
	/** ************************* **/
	
  	$.fn.fractionSlider = function(options) {
	
		// defaults & options
		var options = $.extend( {
		  'position'					: '0,0',				// default position | should never be used
		  'transitionIn'        		: 'left',				// defaulöt in - transition
		  'transitionOut' 				: 'left',				// default out - transition
		  'fullWidth' 					: false,				// transition over the full width of the window
		  'delay' 						: 0,					// default delay for elements
		  'timeout'						: 2000,					// default timeout before switching slides
		  'speedIn'						: 2500,					// default in - transition speed
		  'speedOut'					: 1000,					// default out - transition speed
		  'easeIn'						: 'easeOutExpo',		// default easing in
		  'easeOut'						: 'easeOutCubic',		// default easing out
		
		  'controls'					: false,				// controls on/false
		  'autoChange'					: true,					// auto change slides
		
		  'backgroundAnimation'			: false,				// background animation
		  'backgroundElement'			: null,					// element to animate | default fractionSlider element
		  'backgroundX'					: 500,					// default x distance
		  'backgroundY'					: 500,					// default y distance
		  'backgroundSpeed'				: 2500,					// default background animation speed
		  'backgroundEase'				: 'easeOutCubic',		// default background animation easing
		}, options);
		
		// ready for take-off 
		var slider = new FractionSlider(this, options);
  	};

	/** ************************* **/
	/** EASING EXTEND  **/
	/** ************************* **/

	// based on jqueryui (http://jqueryui.com/)
	// based on easing equations from Robert Penner (http://www.robertpenner.com/easing)

	var baseEasings = {};

	$.each( [ "Quad", "Cubic", "Quart", "Quint", "Expo" ], function( i, name ) {
		baseEasings[ name ] = function( p ) {
			return Math.pow( p, i + 2 );
		};
	});

	$.extend( baseEasings, {
		Sine: function ( p ) {
			return 1 - Math.cos( p * Math.PI / 2 );
		},
		Circ: function ( p ) {
			return 1 - Math.sqrt( 1 - p * p );
		},
		Elastic: function( p ) {
			return p === 0 || p === 1 ? p :
				-Math.pow( 2, 8 * (p - 1) ) * Math.sin( ( (p - 1) * 80 - 7.5 ) * Math.PI / 15 );
		},
		Back: function( p ) {
			return p * p * ( 3 * p - 2 );
		},
		Bounce: function ( p ) {
			var pow2,
				bounce = 4;

			while ( p < ( ( pow2 = Math.pow( 2, --bounce ) ) - 1 ) / 11 ) {}
			return 1 / Math.pow( 4, 3 - bounce ) - 7.5625 * Math.pow( ( pow2 * 3 - 2 ) / 22 - p, 2 );
		}
	});

	$.each( baseEasings, function( name, easeIn ) {
		$.easing[ "easeIn" + name ] = easeIn;
		$.easing[ "easeOut" + name ] = function( p ) {
			return 1 - easeIn( 1 - p );
		};
		$.easing[ "easeInOut" + name ] = function( p ) {
			return p < 0.5 ?
				easeIn( p * 2 ) / 2 :
				1 - easeIn( p * -2 + 2 ) / 2;
		};
	}); // end easing
})( jQuery );