# Text Edit Interface Prototype #
Author: Chi-chi Wang

**Demo hosted at**: [http://textedit.wangchiyi.com](http://textedit.wangchiyi.com)

Languages: HTML5, CSS3, javascript

Code Libraries used:
  * [HTML5 Shiv](https://github.com/aFarkas/html5shiv)
  * [Normalize.css](http://necolas.github.com/normalize.css/)
  * [CSS3 PIE](http://css3pie.com)
  * [jQuery 1.7.2](http://jquery.com)
  * [jQuery UI 1.8.21](http://jqueryui.com)

## Purpose ##
A browser based front-end interface for editing text and choosing display settings.  Menus are provided for changing the display font face, font color and font size.

The interface is size-responsive and designed to be mobile-adaptive in order that it provides a fluid experience regardless of the device used for browsing.

This project became the vehicle by which I learned and practice a large swath of skills and tools in front-end development.  Below are listed the skills and tools I familiarised myself with in developing this interface.

## Skills and Tools Practiced ##

  1. **Building from a HTML Template**

     Built a HTML template which contains the following:
       - [HTML5 Shiv](https://github.com/aFarkas/html5shiv)
       - [Normalize CSS](http://necolas.github.com/normalize.css/)
       - [jQuery](http://jquery.com)
       - Favicon / Touch Icons

  2. **CSS3PIE**

     CSS Progressive Internet Explorer found at [http://css3pie.com/](http://css3pie.com/).

     This is a tool that provides a few CSS3 features to older Internet Explorer browsers (IE6-IE9).  Namely it helps Internet Explorer render border-radius, box-shadow and linear-gradient.  It is very useful in making a page cross-browser compliant.

  3. **Colorzilla Ultimate CSS Gradient Editor**

     Found at [http://www.colorzilla.com/gradient-editor/](http://www.colorzilla.com/gradient-editor/)

     This online UI allows a designer/developer to intuitively design gradients for use on the web.  After you've created your gradient it will provide you with all of the browser-compatible properties and values you need in your style sheet to render your gradient.

  4. **jQuery UI**
     
     Found at [http://jqueryui.com](http://jqueryui.com)

     jQuery UI provides widgets of common user interface objects for use in your project.  For this particular project I only used two functions within the library: the *slider widget* and the ability to *animte between css classes*.  I used the Themeroller to choose just the components I would need in the project to be included in the library.

  5. **CSS Font Loading**

     For this project I utilized free online web fonts and learned how to load them into the user's browser through CSS3's @font-face.  I used online [font-face kits](http://www.fontsquirrel.com/) in order that I had all of the font file formats used by the various browser, thus ensuring cross-browser compatibility.

  6. **CSS3 Gradient Syntax**

     While the Colorzilla CSS Gradient Editor is very useful for your standard linear gradients I found a need to create more complex gradients for other elements in this project.  (specifically to create the shine on popup elements on the mobile version of the browser application)

     For this I dug deeper into CSS3 gradient syntax and learned the various ways different browsers interpret linear gradient properties and display them.  [This page](http://www.the-art-of-web.com/css/linear-gradients/) was an especially useful starting point for my inquiries.

  7. **jQuery Plugin Authoring**
     
     I also made my very first attempts at building jQuery plugins in developing the Text Edit Interface.  I built two plugins for the project: one to handle the drop-down menus found on the desktop/laptop version of the site, and one to handle the text-editing functionality central to the page.

     These plugins can be found in the assets/js directory.  The files are titled popout-menus.js and edittext-button.js

  8. **Form Validation**

     I studied how to use regular expressions to parse the input strings provided by the user to strip them of malicious potential.  This is to prevent code insertion exploits and the like.

  9. **Class Heavy CSS**

     This is the first project wherein I made heavy use of css classes to style a page.  I used a modular, object-like approach to the display of page elements.

  10. **Responsive/Adaptive Design**

     This is the first project in which I made the elements responsive and the functionality adaptive to the device by which the page is accessed.

     By using userAgent detection and browser feature detection in javascript I could infer if the user is on a smaller touch device or else infer they are on a larger mouse/trackpad device.  Using this information I could dynamically load a stylesheet with specific style overrides.  At the same time I could intialize different javascript event handlers depending on what sort of device I am assuming the user to be accessing the page with.

     The result of this is the presentation of different visual elements and functionality depending on if the user is on a pc or mobile device.