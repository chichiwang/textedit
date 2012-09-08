/*  Author: Chi-chi Wang
  edittext-button.js
*/
;(function( $ ){

  var methods = {

    //init([{options}])
    init : function( options ) {
      var settings = $.extend({
                      //Default Settings
                      'inputEl'         :   '#inputEl',
                      'outputEl'        :   '#outputEl',
                      'toggleEls'       :   undefined,
                      'triggerEls'      :   undefined,
                      'inputAutoGrow'   :   false,
                      'defaultContent'  :   false,
                      'bindButton'      :   true,
                      'placeholderFix'  :   false
                    }, options);
      this.data('editTextButton', settings);
      var $inputEl = $(settings.inputEl),
          $outputEl = $(settings.outputEl),
          $buttonEl = this;
      if (settings.toggleEls) {
        var $toggleEls = '';
        for (var key in settings.toggleEls) {
          $toggleEls = $toggleEls + ', ' + key;
        }
        $toggleEls = $($toggleEls.slice(2));
      }
        //====================PRIVATE FUNCTIONS DECLARATIONS==================
          //stripHTML(str)
          //Replace all html/ascii code in string with string literal values
          function stripHTML (str) {
            var codeChart = {
                      lessThan  : '<',
                      greaterThan : '>',
                      space   : ' ',
                      ampersand : '&',
                      breakTag  : '\r\n'
                    };
            str = (str + '').replace(/(<br\s*\/?>\s*)/gi, codeChart.breakTag);
            str = (str + '').replace(/&lt;/g, codeChart.lessThan);
            str = (str + '').replace(/&gt;/g, codeChart.greaterThan);
            str = (str + '').replace(/&nbsp;/g, codeChart.space);
            return (str + '').replace(/&amp;/g, codeChart.ampersand);
          }

          //fixPlaceholder();
          //Simulates placeholder text for browsers that don't support the attribute
          function fixPlaceholder() {
            var message = $inputEl.attr('placeholder');
              //Checks for browser support of the HTML5 placeholder attribute
              function hasPlaceholderSupport() {
                var input = document.createElement('input');
                return ('placeholder' in input);
              }

              if (!hasPlaceholderSupport()) {
                //Bind placeholder functions to the given element
                (function() {
                  $inputEl.bind('focus.editTextButton', function () {
                        if ($inputEl.val() == message) {
                          $inputEl.val('');
                        }
                     })
                     .bind('blur.editTextButton', function () {
                        if ($inputEl.val() == '') {
                          $inputEl.val(message);
                        }
                     });
                })();
              }
          }//fixPlaceholder() END;

          //bindOutput2Input();
          //Binds output content to input content as it's being edited
          function bindOutput2Input() {
            if (settings.inputAutoGrow === true) {
              var $this       = $inputEl,
                  minHeight   = $this.height(),
                  lineHeight  = $this.css('lineHeight');


              var shadow = $('<div></div>').css({
                  position:   'absolute',
                  top:        -10000,
                  left:       -10000,
                  width:      $(this).width() - parseInt($this.css('paddingLeft')) - parseInt($this.css('paddingRight')),
                  fontSize:   $this.css('fontSize'),
                  fontFamily: $this.css('fontFamily'),
                  lineHeight: $this.css('lineHeight'),
                  resize:     'none'
              }).appendTo(document.body);

            }

                //inputChangeHandler()
                function inputChangeHandler() {
                  displayInputText.apply(this);
                  if (settings.inputAutoGrow === true) {
                    update.apply($this);
                  }
                }

                //update()
                //Auto-growing textareas; technique ripped from Facebook
                //Code snippet borrowed from:
                //  http://code.google.com/p/gaequery/source/browse/trunk/src/static/scripts/jquery.autogrow-textarea.js?r=2
                function update() {
                  var times = function(string, number) {
                      for (var i = 0, r = ''; i < number; i ++) r += string;
                      return r;
                  };
                  var val = '' + this.val().replace(/</g, '&lt;')
                                           .replace(/>/g, '&gt;')
                                           .replace(/&/g, '&amp;')
                                           .replace(/\n$/, '<br/>&nbsp;')
                                           .replace(/\n/g, '<br/>')
                                           .replace(/ {2,}/g, function(space) { return times('&nbsp;', space.length -1) + ' ' });
                  shadow.html(val);
                  $(this).css('height', Math.max(shadow.height(), minHeight));
                }

                //displayInputText()
                //Feed input text into output block
                function displayInputText() {
                  var inputText = formatSpecialCharacters($(this).val()),
                      message = $(this).attr('placeholder');
                    //Replace special characters with html codes
                    function formatSpecialCharacters (str) {
                      var codeChart = {
                                lessThan  : '&lt;',
                                greaterThan : '&gt;',
                                space   : '&nbsp;',
                                ampersand : '&amp;',
                                breakTag  : '<br />'
                              };
                      str = (str + '').replace(/&/g, codeChart.ampersand);
                      str = (str + '').replace(/</g, codeChart.lessThan);
                      str = (str + '').replace(/>/g, codeChart.greaterThan);
                      str = (str + '').replace(/ /g, codeChart.space);
                      return (str + '').replace(/(\r\n|\n\r|\r|\n)/g, codeChart.breakTag);
                    }//END formatSpecialCharacters();
                  //Begin displayInutText() execution
                  if ($(this).val() === message) {
                    inputText = "";
                  }
                  $outputEl.html(inputText);
                }//END displayInputText();

          //Begin bindOutput2Input() execution
          $inputEl.bind('blur.editTextButton', inputChangeHandler);
          $inputEl.trigger('blur.editTextButton');
          }
          //bindOutput2Input() END;

          //bindDisplayToggleButton()
          //Bind the click event of button element to toggle
          //the display of the input element and the output element
          function bindDisplayToggleButton() {
            function toggleDisplay() {
              if ($toggleEls) {
                $toggleEls.toggle();
              }
              else {
                $inputEl.toggle();
                $outputEl.toggle();
              }
            } //END toggleDisplay();s

            $buttonEl.bind('click.editTextButton', function() {
              toggleDisplay();
              return false;
            });
          }//bindDisplayToggleButton() END;

          //bindTriggerElement()
          //When Trigger Elements are clicked, set the toggle elements
          //to their user defined states
          function bindTriggerElement() {
            this.bind('click.editTextButton', function(){
              for (var key in settings.toggleEls) {
                $(' '+ key).toggle(settings.toggleEls['' + key]);
              }
            });
          }//END bindTriggerElement();
        //===============END PRIVATE FUNCTIONS==========================

      //BEGIN init() execution
      if (settings.defaultContent === true) {
        $inputEl.val(stripHTML($(settings.outputEl).html()));
      }
      if (settings.placeholderFix === true) {
        fixPlaceholder();
      }
      bindOutput2Input();
      if (settings.bindButton) {
        bindDisplayToggleButton();
      }
      if (settings.triggerEls) {
        var $triggerEls = $('' + settings.triggerEls);
        $triggerEls.each(function() {
          bindTriggerElement.apply($(this));
        });
      }
      // ...

    },//END init();
    //destroy()
    destroy : function( ) {
      var settings = this.data('editTextButton'),
          $inputEl = settings.inputEl;


      $inputEl.unbind('.editTextButton');
      this.unbind('.editTextButton');
      this.removeData('editTextButton');
      // ...

    }
  };

  $.fn.editTextButton = function( method ) {
    var args = arguments;
    return this.each( function() {
      that = $(this);
      if ( methods[method] ) {
        return methods[method].apply( that, Array.prototype.slice.call( args, 1 ));
      } else if ( typeof method === 'object' || ! method ) {
        if (!that.data('editTextButton')) {
          that.data('editTextButton', true);
          return methods.init.apply( that, args );
        }
        $.error( 'editTextButton already initialized on this element (#' + that.attr('id') + ') !' );
      } else {
        $.error( 'Method ' +  method + ' does not exist on jQuery.editTextButton' );
      }
    });
  };

})( jQuery );