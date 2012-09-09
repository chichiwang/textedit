/*  Author: Chi-chi Wang
    Text Edit Prototype Script
    Dependencies: popout-menu.js, edittext-button.js
*/
$(document).ready( function() {

    "use strict";

//GLOBAL VARIABLES
    var hoverTimer,
        textFocused = false,
        screenWidth = screen.width,
        isMenuOpen = false;
    
//BEGIN FUNCTIONS DECLARATIONS

    //Track if input element gets focused
    $("#mobileInputFeed textarea").focus(function() {
        textFocused = true;
    }).blur(function() {
        textFocused = false;
    });

    //Detect if platform is iOS
    var iOS = false,
        p = navigator.platform;
    if ( p === 'iPad' || p === 'iPhone' || p === 'iPod' ) {
        iOS = true;
    }

    //FIX window_resize(): Prevent recursive resize event firings
    //The resize handler causes a window resize event in some browsers
    var resizeTimeoutId,
        winH = $(window).height(),
        winW = $(window).width();

    function window_resize(resizeFunc) {
        var winNH = $(window).height,
            winNW = $(window).width;
            
        if((winNH != winH)&&(winNW != winW)) {
            window.clearTimeout(resizeTimeoutId);
            resizeTimeoutId = window.setTimeout(resizeFunc, 10);
            winH = $(window).height();
            winW = $(window).width();
        }
    }
    //FIX window_resize END;
  
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
    if ('ontouchstart' in document.documentElement) {
        $slideMenu.slider({
            min: 12,
            max: 24
        });
        $slideMenu.bind("slide slidechange", slideChangeHandler);
        $slideMenu.slider("option", "value", 14);
    }
    else {
        $slideMenu.slider({
            min: 16,
            max: 34
        });
        $slideMenu.bind("slide slidechange", slideChangeHandler);
        $slideMenu.slider("option", "value", 18);
    }
  }
  //armSlideMenu() END;

  //mobileTextMenu()
  function mobileTextMenu (options) {

    var settings = $.extend({
            'menuBarEl'         : "#mobileMenuBar",
            'inputContainer'    : "#mobileInputFeed",
            'buttonEl'          : "#mobileTextButton",
            'confirmButton'     : "#deleteTextButton",
            'confirmEl'         : "#deleteConfirmation",
            'pageOutputEl'      : "#outputFeed>p",
            'confirmDelete'     : "#yesDelete",
            'cancelDelete'      : "#noDelete"
        }, options);

    var menuOffset,
        $confirmTextEl = $(settings.confirmEl +' p'),
        $textareaEl = $(settings.inputContainer + ' textarea'),
        confirmText = $confirmTextEl.html();

        //==== INTERNAL FUNCTIONS FOR mobileTextMenu() ====//
        //Dynamically set the height of the menu elements
        function textMenuResizeHandler() {
            //prevent resizing of elements when virtual keyboard is present
            if (textFocused) {
                return true;
            }
            
            menuOffset = window.innerHeight - $(settings.menuBarEl).outerHeight();

            $textareaEl.css('height', $(settings.inputContainer).height() - 80);
            if (!isMenuOpen) {
                $(settings.inputContainer)
                        .toggle(false)
                        .css({'top' : '', 'bottom' : (0-window.innerHeight)});
                $(settings.menuBarEl).css({'top' : '', 'bottom' : 0});
                $('#page-wrap').css({'visibility' : ''});
            }
            else {
                $(settings.menuBarEl).css({'top' : 0, 'bottom' : ''});
                $(settings.inputContainer)
                        .toggle(true)
                        .css({'top' : 0, 'bottom' : ''});
                $('#page-wrap').css({'visibility' : 'hidden'});
            }
        }//END textMenuResizeHandler();

        //Open/Close the menu
        function toggleMenu() {
            //Closing the menu
            if (isMenuOpen) {
                $('#page-wrap').css({'visibility' : ''});
                $(settings.menuBarEl)
                        .css({'top' : '', 'bottom' : menuOffset})
                        .animate({'bottom' : 0}, {queue: false, duration: 800});
                $(settings.inputContainer)
                        .css({'top' : 0, 'bottom' : ''})
                        .animate({'top' : menuOffset}, {queue: false, duration: 800, complete: function() {
                            $(settings.inputContainer).toggle(false).css({'top' : '', 'bottom' : (0-window.innerHeight)});
                        }});
                isMenuOpen = false;
            }
            //Opening the menu
            else {
                $(settings.menuBarEl)
                        .css({'top' : '', 'bottom' : 0})
                        .animate({'bottom' : menuOffset}, {queue: false, duration: 800, complete: function(){
                            $(settings.menuBarEl).css({'top' : 0, 'bottom' : ''});
                        }});
                $(settings.inputContainer)
                        .toggle(true)
                        .css({'top' : menuOffset, 'bottom' : ''})
                        .animate({'top' : 0}, {queue: false, duration: 800, complete: function() {
                            $(settings.inputContainer).toggle(true).css({'top' : 0, 'bottom' : ''});
                            $(settings.inputContainer).css({'top' : 0, 'bottom' : ''});
                            $('#page-wrap').css({'visibility' : 'hidden'});
                            $textareaEl.trigger('blur'); //Fix textarea size bug
                            $(window).trigger('resize'); //Fix textarea size bug
                        }});
                isMenuOpen = true;
            }
        }//END toggleMenu();
        //Set the bindings for the delete button 
        function armDeleteButton() {
            //First make sure the confirmation popup is hidden
            $(settings.confirmEl).toggle(false);
            $(settings.confirmButton).bind('click.mobileTextMenu', function() {
                if ($textareaEl.val() === "") {
                    $confirmTextEl.html('There is no text!');
                    $(settings.confirmDelete).html('OK')
                                             .css({'margin-right' : 'auto',
                                                   'margin-left' : 'auto',
                                                   'width' : '60%',
                                                   'float' : 'none'});
                    $(settings.cancelDelete).css('visibility', 'hidden');
                }
                $(settings.confirmEl).toggle(true);
            });
            $(settings.confirmDelete).bind('click.mobileTextMenu', function() {
                $textareaEl.val('');
                $textareaEl.trigger('blur.editTextButton');
                $confirmTextEl.html(confirmText);
                $(settings.confirmDelete).html('Confirm')
                                           .css({'margin-right' : '',
                                                 'margin-left' : '',
                                                 'width' : '',
                                                 'float' : ''});
                $(settings.cancelDelete).css('visibility', '');
                $(settings.confirmEl).toggle(false);
            });
            $(settings.cancelDelete).bind('click.mobileTextMenu', function() {
                $(settings.confirmEl).toggle(false);
            });
        } //END armDeleteButton();
        //==== END INTERNAL FUNCTIONS FOR mobileTextMenu() ====//

    //BEGIN mobileTextMenu() execution
    $(window).load(textMenuResizeHandler);

    if (iOS) {
        //Window scroll fix (address bar / window resize BS)
        $(window).scroll(function() {
                            if (!textFocused) {
                                textMenuResizeHandler();
                            }
                 }).resize(function() {
                            if (!textFocused) {
                                window_resize(textMenuResizeHandler);
                            }
                 });
        //Input scroll fix
        //iPhone requires 2-finger scrolling within a textarea
        //That's just bullshit.
        $textareaEl.bind('ontouchmove', function(e) {
            e.stopPropagation();
        });
    }

    $(settings.buttonEl).bind('click.mobileTextMenu', function() {
        toggleMenu();
    });
    $(settings.buttonEl).editTextButton({
                            'inputEl'       : settings.inputContainer + ' textarea',
                            'outputEl'      : settings.pageOutputEl,
                            'bindButton'    : false,
                            'defaultContent': true
                            });
    armDeleteButton();
  }//END mobileTextMenu();

  //mobileSettingsMenu()
  function mobileSettingsMenu(options) {
    var settings = $.extend({
            'settingsButton'    : "#mobileSettingsButton",
            'settingsMenu'      : "#mobileSettings"
        }, options);

    var $menu = $(settings.settingsMenu),
        $button = $(settings.settingsButton);

    function closeMobileInputFeed() {
        $('#page-wrap').css({'visibility' : ''});
        $('#mobileMenuBar').css({'top' : '', 'bottom' : 0})
        $('#mobileInputFeed').toggle(false).css({'top' : '', 'bottom' : (0-window.innerHeight)});
        isMenuOpen = false;
    }

    //Menu Button Bindings
    $button.bind('click.mobileSettings', function(e) {
        if (isMenuOpen) {
            $menu.toggleClass('menuOpenTop menuClosed');
        }
        else {
            $menu.toggleClass('menuOpen menuClosed');
        }
        e.stopPropagation();
    });

    function closeSettingsMenu() {
        $menu.toggleClass('menuOpen', false)
             .toggleClass('menuOpenTop', false)
             .toggleClass('menuClosed', true);
    }

    $('html').bind('click ontouchstart ontouchmove', closeSettingsMenu);
    $('#page-wrap').bind('click', closeSettingsMenu);
    $(window).bind('scroll', closeSettingsMenu);

    //fontSelect Handler
    $('.fontSelect').bind('click.mobileSettings', function() {
        closeMobileInputFeed();
        $('#fontSelect menu').switchClass('menuClosed', 'menuOpen', 500);
    });
    $('#fontSelect menu li').bind('click.mobileSettings', function() {
        $('#fontSelect menu').switchClass('menuOpen', 'menuClosed', 800);
    });
    //colorSelect Handler
    $('.colorSelect').bind('click.mobileSettings', function() {
        closeMobileInputFeed();
        $('#colorSelect menu').switchClass('menuClosed', 'menuOpen', 500);
    });
    $('#colorSelect menu li').bind('click.mobileSettings', function() {
        $('#colorSelect menu').switchClass('menuOpen', 'menuClosed', 800);
    });
    //fontSizer Handler
    $('.fontSizer').bind('click.mobileSettings', function() {
        closeMobileInputFeed();
        $('#fontSizer section').switchClass('menuClosed', 'menuOpen', 500);
    });
    $('#fontSizeDone').bind('click.mobileSettings', function() {
        $('#fontSizer section').switchClass('menuOpen', 'menuClosed', 800);
    });
  }//END mobileSettingsMenu();

  //armMobileFontSize();
  function armMobileFontSize(options) {
    var settings = $.extend({
            'minSize'           : 12,
            'maxSize'           : 24,
            'upArrow'           : '#fontUp',
            'downArrow'         : '#fontDown',
            'fontIndicator'     : '#currentFontSize',
            'target'            : '#outputFeed p'
        }, options);
    var $upArrow = $(settings.upArrow),
        $downArrow = $(settings.downArrow),
        $fontIndicator = $(settings.fontIndicator),
        $target = $(settings.target);

    var currentFontSize = parseInt($fontIndicator.html());
    $target.css('font-size', currentFontSize);

    $upArrow.bind('click.mobileFont', function () {
        currentFontSize = parseInt($fontIndicator.html());
        if (currentFontSize < settings.maxSize) {
            currentFontSize += 1;
            $target.css('font-size', currentFontSize);
            $fontIndicator.html(currentFontSize + 'px');
        }
    });
    $downArrow.bind('click.mobileFont', function () {
        currentFontSize = parseInt($fontIndicator.html());
        if (currentFontSize > settings.minSize) {
            currentFontSize -= 1;
            $target.css('font-size', currentFontSize);
            $fontIndicator.html(currentFontSize + 'px');
        }
    });
  }//END armMobileFontSize();
//FUNCTIONS END;
    
//BEGIN GLOBAL EXECUTION
    $('html').removeClass('no-js');
    //Mobile Device Specific Functionality
    if ((screenWidth <= 1024) && ('ontouchstart' in document.documentElement)) {
        $('body').append('<link href="assets/css/mobile.min.css" rel="stylesheet" type="text/css">');
        mobileTextMenu();
        $('#colorSelect').popout({ 'menuTargets' : '#outputFeed>p, #colorSelect, #fontSelect>menu',
                                    'toggleOpenClose' : false });
        $('#fontSelect').popout({ 'menuTargets' : '#outputFeed>p',
                                  'toggleOpenClose' : false });
        mobileSettingsMenu();
        armMobileFontSize();
    }
    //Font Size Slider Menu
    else {
        $('#fontSlide').html('');
        armSlideMenu('#fontSizer', '#fontSizer', '#outputFeed>p');
        $('#fontSlide').bind("slidechange", function() {
            $('#fontSlide a').trigger('click');
        });
        //PopOut Menus
        $('#colorSelect').popout({ 'menuTargets' : '#outputFeed>p, #colorSelect, #fontSelect>menu' });
        $('#fontSelect').popout({ 'menuTargets' : '#outputFeed>p' });
        $('#fontSizer').popout({ 'flagSelected' : false });
        //Edit Text Button
        $('#inputText_toggle').editTextButton({
                                'inputEl' : '#inputFeed textarea',
                                'outputEl' : '#outputFeed>p',
                                'toggleEls' : { '#inputFeed' : false,
                                                '#outputFeed>p': true },
                                'triggerEls' : '#output .popMenu',
                                'inputAutoGrow' : true,
                                'defaultContent' : true,
                                'placeholderFix' : true });

        $('#mobileMenuBar').remove();
        $('#mobileInputFeed').remove();
        $('#deleteConfirmation').remove();
    }
    //Background Color Menu
    $('#bgcSelect').popout({ 'flagSelected' : false,
                             'menuTargets' : '#outputFeed, .buttonTab, header',
                             'toggleOpenClose' : false });
//GLOBAL EXECUTION END;
    
});