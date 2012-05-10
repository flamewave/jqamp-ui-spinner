/*!
* jqAmp UI Spinner v1.0 (for jQuery/jQuery UI) - Numeric extension
*
* Copyright 2012, Tony Kramer
* Dual licensed under the MIT or GPL Version 2 licenses.
* https://github.com/flamewave/jqamp-ui-spinner/raw/master/GPL-LICENSE.txt
* https://github.com/flamewave/jqamp-ui-spinner/raw/master/MIT-LICENSE.txt
*/

/*
* Numeric spinner extension for core spinner widget.
* For documentation and for the latest version, see:
* https://github.com/flamewave/jqamp-ui-spinner
*
* Dependencies:
* - jQuery (1.7.1+)
* - jQuery Globalize
* - jQuery-ui (1.8.18+ - core, widget, button)
* - jQuery MouseWheel (3.0.6+ - optional, for mousewheel support)
*/
(function($)
{
    $.widget("jqAmpUI.numeric", $.jqAmpUI.spinner, {
        version: "1.0",
        options: {
            culture: null,
            radix: 10
        },

        _isAllowedKey: function(keyCode)
        {
            if (event.ctrlKey && [65, 67, 86, 88, 89, 90].indexOf(keyCode) !== -1)
                return true; // Keyboard shortcuts for select all, copy, paste, cut, redo, and undo

            if (keyCode === 109 || keyCode === 110 // negative sign and decimal on num pad
                || (keyCode >= 48 && keyCode <= 57) // 48 - 57 are numerical key codes for key pad nubers
                || (keyCode >= 96 && keyCode <= 105)) // 96 - 105 are numerical key codes for num pad numbers
                return true;

            if (!event.shift && (keyCode === 189 || keyCode === 190)) // negative sign and decimal on key pad
                return true;

            return $.isControlKey(keyCode);
        },

        _parse: function(val)
        {
            if (typeof val === "number")
                return val;

            try
            {
                return Globalize.parseFloat(val, this.options.radix, this.options.culture) || 0;
            }
            catch (e)
            {
                throw 'SpinnerException: Unable to parse the value specified without a custom parser (parse option). Reason: ' + e;
            }
        },

        _format: function(val)
        {
            if (val === undefined || val === null || val === false)
                return "";

            try
            {
                if (typeof val !== "number")
                    val = Globalize.parseFloat(val, this.options.radix, this.options.culture) || 0;

                if (!val && val !== 0)
                    val = 0;

                return Globalize.format(val, this.options.format, this.options.culture) || "";
            }
            catch (e)
            {
                throw 'SpinnerException: Unable to convert value to a string without a custom converter (format option). Reason: ' + e;
            }
        },

        _cloneValue: function(val)
        {
            if (typeof val !== "number")
                return Globalize.parseFloat(val, this.options.radix, this.options.culture) || 0;

            return val;
        }
    });

})(jQuery);