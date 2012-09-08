/*  Author: Chi-chi Wang
	Quick Prototype Script
*/
$(document).ready( function() {

	"use strict";

//GLOBAL VARIABLES
	var hoverTimer,
		isMouseDown = false;
	
//BEGIN FUNCTIONS DECLARATIONS

	//setMouseDownFlag
	function setMouseDownFlag() {
		$(document).mousedown( function() {
			isMouseDown = true;
		}).mouseup( function() {
			isMouseDown = false;
		});
	}
  
	//function arrayOfTargets([startIndex], argList)
	//Takes a starting index value (optional) and arguments array
	//If no starting index value is given, defaults to 1
	//Returns an array containing all arguments except the first (startIndex)
	function arrayOfTargets(startIndex, argList) {
		//Prime the arguments (was a starting index given?)
		if (!(typeof (startIndex) == "number")) {
			argList = startIndex;
			startIndex = 1;
		}
		var targetArray = [];
		function copyArray(copyFrom, copyTo) {
			copyTo.length = copyFrom.length;
			for (var i = 0; i < copyFrom.length; i++)
				copyTo[i] = copyFrom[i];
		}
		//Begin arrayOfTargets execution
		copyArray(argList, targetArray);
		return targetArray.slice(startIndex,targetArray.length);
	}//END arrayOfTargets();

  	//openMenu(el)
  	function openMenu(el) {
  		window.clearTimeout(hoverTimer);
  		el.removeClass('menuClosed').addClass('menuOpen');
  	}
  	//closeMenu(el)
  	function closeMenu(el) {
  		window.clearTimeout(hoverTimer);
  		hoverTimer = window.setTimeout(function() {
  			el.removeClass('menuOpen').addClass('menuClosed');
  		}, 500);
  	}

  	//stripHTML(str)
  	//Replace all html/ascii code in string with string literal values
	function stripHTML (str) {
		var codeChart = {
							lessThan	: '<',
							greaterThan	: '>',
							space		: ' ',
							ampersand	: '&',
							breakTag	: '\r\n'
						};
		str = (str + '').replace(/(<br\s*\/?>\s*)+/gi, codeChart.breakTag);
		str = (str + '').replace(/&lt;/g, codeChart.lessThan);
		str = (str + '').replace(/&gt;/g, codeChart.greaterThan);
		str = (str + '').replace(/&nbsp;/g, codeChart.space);
		return (str + '').replace(/&amp;/g, codeChart.ampersand);
	}

	//makeInteractive(el)
	//Binds the menu to open and close on hover
	function makeInteractive(el, noClick) {
		var menuElement = $(el).children('menu').length ? $(el).children('menu') : $(el).children('section');

	  	$(el).hover(function() {
	  		if (!isMouseDown) {
		  		if ($('.menuOpen').length) {
		  			$('.menuOpen').removeClass('menuOpen').addClass('menuClosed');
		  		}
		  			openMenu(menuElement);
		  	}
	  	}, function() {
	  		closeMenu(menuElement);
	  	});

	  	if (((typeof(noClick) == 'boolean') && (noClick == true)) || (typeof(noClick) == 'undefined'))
	  	$(el).click(function() {
	  		if (menuElement.hasClass('menuOpen')) {
	  			menuElement.toggleClass('menuOpen').addClass('menuClosed');
	  		}
	  		else {
	  			openMenu(menuElement);
	  		}
	  	});
	}
	//makeInteractive() end;

	//mouseDownWhileHoverFix()
	//prevents an open menu from closing while mousedown

  //armPlaceholder(element);
  //Simulates placeholder text for browsers that don't support the attribute
  function armPlaceholder(element) {
	//Checks for browser support of the HTML5 placeholder attribute
	function hasPlaceholderSupport() {
		var input = document.createElement('input');
		return ('placeholder' in input);
	}
	//Bind placeholder functions to the given element
	function applyPlaceholder(el,msg) {
		if ($(el).val() == msg) {
			$(el).addClass('placeholder')
			 .val(msg);
		}
		$(el).focus( function () {
					if ($(this).val() == msg) {
						$(this).removeClass('placeholder').val('');
					}
			 })
			 .blur( function () {
					if ($(this).val() == '') {
						$(this).addClass('placeholder').val(msg);
					}
			 });
	}
  	//Begin armPlaceholder() execution
	var message = $(element).attr('placeholder');
	if (!hasPlaceholderSupport()) {
		applyPlaceholder(element, message);
	}
  }
  //armPlaceholder() END;
  
  //armOutput();
  //Binds output feedback to user input
  function armOutput(inputEl, outputEl) {
	//Feed input text into output block
	function displayInputText() {
		//Replace special characters with html codes
		function formatSpecialCharacters (str) {
			var codeChart = {
								lessThan	: '&lt;',
								greaterThan	: '&gt;',
								space		: '&nbsp;',
								ampersand	: '&amp;',
								breakTag	: '<br />'
							};
			str = (str + '').replace(/&/g, codeChart.ampersand);
			str = (str + '').replace(/</g, codeChart.lessThan);
			str = (str + '').replace(/>/g, codeChart.greaterThan);
			str = (str + '').replace(/ /g, codeChart.space);
			return (str + '').replace(/(\r\n|\n\r|\r|\n)/g, codeChart.breakTag);
		}
		//Begin displayInutText() execution
		var inputText = formatSpecialCharacters($(this).val());
		if ($(this).hasClass('placeholder')) {
			inputText = "";
		}
		$(outputEl).html(inputText);
	}
	//Begin armOutput() execution
	$(inputEl).keydown(displayInputText).keyup(displayInputText);
  }
  //armOutput() END;

  //armPopMenus(menuID, targetElements[, ...])
  function armPopMenu(menuID) {
  	var targetElements = arrayOfTargets(arguments);
  	//armMenuItems(el)
  	//Bind the handlers for interactions with menu li
  	function armMenuItems(el) {
  		var allClasses = [],
  			menuRoot = el.children('menu'),
  			menuLength = menuRoot.children('li').length;
  		//initialize array of menu classes
  		for (var i =0; i < menuLength; i++) {
  			allClasses[i] = menuRoot.children('li:eq('+ i +')').attr('class');
  		}
  		//CLICK HANDLER - MENU LI
  		menuRoot.children('li').click(function() {
  			var newClass = $(this).attr('class');
	  			//Remove menu classes from output element
	  			function removeMenuClasses(menuEl) {
		  			$.each(allClasses, function(index, value) {
		  				if ($(menuEl).hasClass(value)) {
		  					$(menuEl).removeClass(value);
		  				}
		  			});
		  		}
		  		//Swap which menu item is selected
		  		function changeSelected(newSelect) {
		  			menuRoot.children('li').each(function() {
		  				if ($(this).hasClass('selected')) {
		  					$(this).removeClass('selected');
		  				}
		  			});
		  			newSelect.addClass('selected');
		  		}
	  		//Begin Click Handler execution
  			$.each(targetElements, function() {
				var targetElement = '' + this;
  				removeMenuClasses(targetElement);
  				$(targetElement).addClass(newClass);
  			});
  			changeSelected($(this));
  		}); //END menu list click binding
  	} //armMenuItems() end;
  	//Begin armPopMenus() execution
  	makeInteractive($(menuID));
  	armMenuItems($(menuID));
  }
  //armPopMenu() END;

  //armSlideMenus(menuID, targetElements[, ...])
  function armSlideMenu(menuID) {
  	var $slideMenu = $(menuID + ' .slider'),
  		$menuElement = $(menuID).children('section'),
  		targetElements = arrayOfTargets(arguments);
  	//Function bound to slidechange event
  	function slideChangeHandler(e,el) {
	  	$.each(targetElements, function() {
	  		var slideVal = el.value,
	  			targetElement = '' + this;
	  		if ($(targetElement).hasClass('popMenu')) {
	  			$(targetElement).children('p').html(slideVal);
	  		} else {
	  			var fontSizeStyle = 'font-size: ' + slideVal + 'px !important;';
	  			$(targetElement).attr('style', fontSizeStyle);
	  		}
	  	});
	  }
  	//begin armSlideMenu() execution
  	//initialize slider
  	$slideMenu.slider({
  		min: 16,
  		max: 34
  	});
  	$slideMenu.bind("slide slidechange", slideChangeHandler);
  	$slideMenu.slider("option", "value", 18);
  	makeInteractive($(menuID), false);
  }
  //armSlideMenu() END;

  //bindDisplayToggleButton(el, targets[, ...])
  //Bind the click event of el to toggle the display of the target(s)
  function bindDisplayToggleButton(el) {
  	var targetElements = arrayOfTargets(arguments);

  	function toggleDisplay() {
	  	$.each(targetElements, function() {
	  		var targetElement = '' + this;
	  		$(targetElement).toggle();
	  	});
	}

	$(el).click(function() {
		toggleDisplay();
		return false;
	})

  }//bindDisplayToggleButton END;

//FUNCTIONS END;
	
//BEGIN GLOBAL EXECUTION
	$('html').removeClass('no-js');
	setMouseDownFlag();
	//Prime the input textarea with the outputFeed content
	$('#inputFeed textarea').val(stripHTML($('#outputFeed>p').html()));
	armPlaceholder('#inputFeed textarea');
	armOutput('#inputFeed textarea', '#outputFeed p');
	armPopMenu('#colorSelect', '#outputFeed>p', '#colorSelect', '#fontSelect>menu');
	armPopMenu('#fontSelect', '#outputFeed>p');
	armSlideMenu('#fontSizer', '#fontSizer', '#outputFeed>p');
	bindDisplayToggleButton('#inputText_toggle','#inputFeed', '#outputFeed>p');
	$('#output .popMenu').click(function() {
		$('#inputFeed').toggle(false);
		$('#outputFeed>p').toggle(true);
	});
	$('#fontSlide').bind("slidechange", function() {
		$('#fontSlide a').trigger('click');
	});
//GLOBAL EXECUTION END;
	
});