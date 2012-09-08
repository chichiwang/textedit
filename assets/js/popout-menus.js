/*  Author: Chi-chi Wang
  popout-menus.js
  Sets mouseover and mouseout on menu elements to toggle hide/show
*/
;(function( $ ){

  var hoverTimer,           //Delay timer variable
      isMouseDown = false,  //Flag to track user left mouse button state
      numMenus = 0;         //Flag to track number of popmenu instances

  var methods = {

    //Declare close menu and open menu classes
    closedMenuClass : 'menuClosed',
    openMenuClass   : 'menuOpen',
    selectedClass   : 'selected',

    //init([{options}])
    //Constructor to set the entire menu element up
    init : function(options) {
      var that = this,
          settings = $.extend({
            'menuTargets' : undefined,
            'flagSelected' : true,
            'toggleOpenClose' : true
          }, options);
      this.data('popout', settings);

      //Ensure a flag is set up to track mousedown and mouseup
      if (numMenus === 0) {
        (function() {
            $(document).bind('mousedown.popout', function() {
              isMouseDown = true;
            }).bind('mouseup.popout', function() {
              isMouseDown = false;
            });
        })();
      }
      numMenus += 1;

      //makeInteractive()
      //Binds the menu to open and close on hover
      function makeInteractive() {
          var $menuElement = this.children('menu').length ? this.children('menu') : this.children('section'),
              openMenus = '.' + methods.openMenuClass;

          //Close all other menus
          function closeOtherMenus() {
            if ($(openMenus).length) {
                  $(openMenus).each(function() {
                    methods.closeMenu.apply($(this), [true]);
                  });
            }
          }
              
          //Open the menu on hover
          if (!('ontouchstart' in document.documentElement)) {
            this.bind('mouseover.popout', function() {
              if (!isMouseDown) {
                closeOtherMenus();
                methods.openMenu.apply($menuElement);
              }
            }).bind('mouseout.popout', function() {  //Close the menu on mouseout
              methods.closeMenu.apply($menuElement);
            }).bind("click.popout", function() {
              if ($menuElement.hasClass(methods.openMenuClass)) {
                methods.closeMenu.apply($menuElement, [true]);
              }
            });
          }
          //Menu click handler
          else {
            this.bind("click.popout", function() {
              if ($menuElement.hasClass(methods.openMenuClass)) {
                methods.closeMenu.apply($menuElement, [true]);
              }
              else {
                closeOtherMenus();
                methods.openMenu.apply($menuElement);
              }
            });
          }
      }//END makeInteractive();
      
      //BEGIN init() execution
      if (settings.toggleOpenClose) {
        makeInteractive.apply(this);
      }
      //Bind the menu li to flag selected and target the menu targets
      if (settings.menuTargets || (settings.flagSelected === true)) {
        //bindMenuLiClick()
        //Bind Menu Li click events to this function
        function bindMenuLiClick() {
          if (settings.flagSelected === true) {
            //remove selected class from all menu li elements
            $(this).parent('menu').children('li').each(function() {
              if ($(this).hasClass(methods.selectedClass)) {
                $(this).removeClass(methods.selectedClass);
              }
            });
          }
          if (settings.menuTargets) {
            //set menu targets
            methods.applyClassToTargets.apply(this, [settings.menuTargets]);
          }
          if (settings.flagSelected === true) {
            //apply the selected flag class to the current menu li element
            $(this).addClass(methods.selectedClass);
          }
        }//END bindMenuLiClick();
        this.children('menu').children('li').bind('click.popout', function() {
          bindMenuLiClick.apply(this);
        });
      }
    },//END init();
    //destroy()
    //Deconstructor - remove all bindings associated with this instance
    destroy : function( ) {
      this.removeData('popout');
      this.unbind('.popout');
      this.children('menu').children('li').unbind('.popout');

      if (numMenus === 1) {
        $(document).unbind('.popout');
      }
      numMenus -= 1;
      //return this.each(function(){
        //$(window).unbind('.tooltip');
      //})

    },
    //openMenu()
    //Toggle the given menu element to open
    openMenu : function() {
      window.clearTimeout(hoverTimer);
      this.removeClass(methods.closedMenuClass).addClass(methods.openMenuClass);
    },
    //closeMenu([noDelay])
    //Toggle the given menu element to close after half a second
    //noDelay: set an optional argument to true to skip the delay
    closeMenu : function(noDelay) {
      window.clearTimeout(hoverTimer);
      if (!noDelay) {
        var that = this;
        hoverTimer = window.setTimeout(function() {
          that.removeClass(methods.openMenuClass).addClass(methods.closedMenuClass);
        }, 500);
      }
      else {
        this.removeClass(methods.openMenuClass).addClass(methods.closedMenuClass);
      }
    },

    //applyClassToTargets()
    applyClassToTargets : function(targets) {
      var $targetElements = $(targets),
          allClasses = [],
          newClass = $(this).attr('class'),
          menuRoot = $(this).parent('menu'),
          menuLength = menuRoot.children('li').length;

          //Remove from each target element all classes under the menu menuEl
          function removeMenuClasses(menuEl) {
            $.each(allClasses, function(index, value) {
              if ($(menuEl).hasClass(value)) {
                $(menuEl).removeClass(value);
              }
            });
          }

        //Begin applyClassToTargets() execution
        //initialize array of menu classes
        for (var i =0; i < menuLength; i++) {
          allClasses[i] = menuRoot.children('li:eq('+ i +')').attr('class');
        }
        $targetElements.each(function() {
          removeMenuClasses(this);
          $(this).addClass(newClass);
        });
    }, //END applyClassToTargets();

    //changeSelectedListItem($newSelect)
    //Swap which list item is selected
    changeSelectedListItem : function($newSelect) {
      if (!($newSelect instanceof jQuery)) {
        $newSelect = $($newSelect);
      }
      
      $newSelect.addClass(methods.selectedClass);
    }
  };

  $.fn.popout = function( method ) {
    var args = arguments;
    return this.each( function() {
      that = $(this);
      if ( methods[method] ) {
        return methods[method].apply( that, Array.prototype.slice.call( args, 1 ));
      } else if ( typeof method === 'object' || ! method ) {
        if (!that.data('popout')) {
          that.data('popout', true);
          return methods.init.apply( that, args );
        }
        $.error( 'Popout Menu already initialized on this element (#' + that.attr('id') + ') !' );
      } else {
        $.error( 'Method ' +  method + ' does not exist on jQuery.popout' );
      }
    });
  };

})( jQuery );