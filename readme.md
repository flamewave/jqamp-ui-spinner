# jQuery Amplified UI Spinner
*For jQuery/jQuery UI*  
*Version 1.0*

*Copyright 2012, Tony Kramer*  
*Dual licensed under the MIT or GPL Version 2 licenses.*  
[GPL License](https://github.com/flamewave/jqamp-ui-spinner/raw/master/GPL-LICENSE.txt)  
[MIT License](https://github.com/flamewave/jqamp-ui-spinner/raw/master/MIT-LICENSE.txt)

For documentation and for the latest version, see:  
https://github.com/flamewave/jqamp-ui-spinner

## Description
This widget allows you to turn any input into a spinner control where the user is able to use buttons, keyboard arrows (and page up/down keys), and the mouse wheel to interact with the input's value to increase and decrease the value. It is very similar to the jQuery UI Spinner widget, but has many more advanced options and supports types other than numeric values.

**Note:** By default the buttons for the spinner are displayed adjacent to each other. This design decision was made so that the widgit is more touchscreen friendly. It is, however, possible to change the behavior so that they are stacked on top of each other instead (see the buttons option below).

## Dependencies
* jQuery (1.7+)
* jQuery-ui (1.8.18+ - core, widget, button)
* jQuery MouseWheel (3.0.6+, optional, for mousewheel support)

## Use
```javascript
$('#myInput').spinner([options]);
```

## API Documentation

### Available Options
*(and their default values)*

* **disabled:** `false`  
    Indicates if the widget is disabled.

* **readonly:** `false`  
    Indicates if the widget will accept user input/interaction.
    
* **keyboard:** `true`  
    Indicates if keyboard keys should be allowed to interact with the input value. This option can be one of the following values:

    * `Boolean`**:**  
        Enables/disables the keyboard interaction. If enabled, the default keyboard options specified below will be used.

    * `Object`**:**  
        Enables keyboard interaction and specified how the keyboard interaction is handled. The following properties are supported:

        * **allowed:** `null`  
            Specifies which keys are allowed to modify the input content. Control keys are always allowed. Can be either one of the following values:
            
            * `Array`**:**  
                An array of the allowed keyboard key codes that are allowed. A `null` or empty array will allow all keys.

            * `Function`**:** `bool function(int keyCode)`  
                Returns a value indicating if the specified keyboard key code is allowed.

        * **upDownArrows:** `Object`  
            Specifies if the up/down arrow keys allow the user to increment/decrement the value. Can be one of the following values:

            * `Boolean`**:**  
                Enables/disabled up/down arrow keys. If enabled, the default arrow key options specified below will be used.

            * `Object`**:**  
                Enables up/down arrow keys and allows their interaction with the widget to be customized. The following properties are supported:

                * **defaultAction**: `"step"`  
                    Specifies the default action to perform when the up/down arrow keys are pressed with no modifier keys pressed.  
                    Available values: `"step"`, `"halfStep"`, and `"page"`.

                * **ctrlAction**: `"halfStep"`  
                    Specifies the action to perform when the up/down arrow keys are pressed and the keyboard ctrl modifier key is pressed.  
                    Available values: `"step"`, `"halfStep"`, and `"page"`.

                * **shiftAction**: `"page"`  
                    Specifies the action to perform when the up/down arrow keys are pressed and the keyboard shift modifier key is pressed.  
                    Available values: `"step"`, `"halfStep"`, and `"page"`.

        * **pageUpDown**: `true`  
            Indicates if the page up/down keys are enabled or disabled. If enabled, when pressed, the `"step"` command will be performed on the widget.

* **mousewheel:** `true`  
    Indicates if the mousewheel (when the mouse is over the input) should be allowed to interact with the input value. For the mousewheel functionality to work, the jQuery MouseWheel plugin must be present. The option can be one of the following values:

    * `Boolean`**:**  
        Enables/disables the mousewheel interaction. If enabled, the default mousewheel options specified below will be used.
    
    * `Object`**:**  
        Enables mousewheel interaction and allows customization of how it will interact with the widget. Can be one of the following values:

        * **defaultAction:** `"step"`  
            Specifies the default action to perform when the mousewheel is scrolled with no modifier keys pressed.  
            Available values: `"step"`, `"halfStep"`, and `"page"`.

        * **ctrlAction:** `"halfStep"`  
            Specifies the action to perform when the mousewheel is scrolled and the keyboard ctrl modifier key is pressed. Note: some browsers may use this combination for zooming the page content. This default functionality can not be overridden.  
            Available values: `"step"`, `"halfStep"`, and `"page"`.

        * **shiftAction:** `"page"`  
            Specifies the action to perform when the mousewheel is scrolled and the keyboard shift modifier key is pressed.  
            Available values: `"step"`, `"halfStep"`, and `"page"`.

* **buttons:** `true`  
    Indicates if up/down buttons will be displayed next to the input allowing the user to click them to increment/decrement the input value. The option can be one of the following values:

    * `Boolean`**:**  
        Enables/disables the button display. If enabled, the default button options specified below will be used.
    
    * `Object`**:**  
        Enables button display and allows customization of how the buttons appear and interact with the widget. Can be one of the following values:

        * **position:** `"inside"`  
            Allows customization of the position of the buttons. Supported values are:
            * `"inside"`: The buttons will be inside of the border and will be side-by-side.
            * `"outside"`: The buttons will be outside of the border and will be side-by-side.
            * `"insideStacked"`: The buttons will be inside of the border and will be stacked.
            * `"outsideStacked"`: The buttons will be outside of the border and will be stacked.

        * **up:** `{ icon: "ui-icon-triangle-1-n", title: null }`
        * **down:** `{ icon: "ui-icon-triangle-1-s", title: null }`  
            Allows customization of the up/down buttons. The icon property allows you to specify a CSS class that represents the icon for the button. The title property allows you to specify the tool-tip of the button. If this option is null or if one of the properties are not specified or invalid then the defaults will be used.

        * **defaultAction:** `"step"`  
            Specifies the default action to perform when the buttons are clicked with no modifier keys pressed.  
            Available values: `"step"`, `"halfStep"`, and `"page"`.

        * **ctrlAction:** `"halfStep"`  
            Specifies the action to perform when the buttons are clicked and the keyboard ctrl modifier key is pressed.  
            Available values: `"step"`, `"halfStep"`, and `"page"`.

        * **shiftAction:** `"page"`  
            Specifies the action to perform when the buttons are clicked and the keyboard shift modifier key is pressed.  
            Available values: `"step"`, `"halfStep"`, and `"page"`.

* **incremental:** `true`  
    Controls the number of steps taken during a recurring spin operation. Can be one of the following values:

    * `Boolean`**:**  
        When `true`, the stepping delta will increase the longer the spin operation. When `false`, all steps will be equal (as defined by the `step` option).

    * `Function`**:** `int function(int spinCount)`  
        Returns the number of steps that should occur for the current spin. The spin counter is given as the only parameter.

* **delay:** `500`  
    The number of milliseconds to delay when a button/key is pressed and held before a recurring spin operation is started.

* **format:** `null`  
    Controls how the value is formatted for display in the input. Can be:

    * `false`/`null`/`undefined` **or any value that is not a function:**  
        Use the default display format (`toString()` method of the object).

    * `Function`**:** `string function(object value)`  
        Returns the formatted display string of the value.

* **parse:** `null`  
    Controls how the value is parsed from the input's value. Can be:

    * `false`/`null`/`undefined` **or any value that is not a function:**  
        Use the default parsing (`parseFloat()` Java Script function).

    * `Function`**:** `object function(string value)`  
        Returns the parsed object value from the specified string representation of the value.

* **compare:** `null`  
    Controls how two instances of the value object are compared. Can be:

    * `false`/`null`/`undefined` **or any value that is not a function:**  
        Use the default comparison (default Java Script comparison operators: `===, <, and >`).

    * `Function`**:** `int function(object left, object right)`  
        Returns a value indicating how the left value compares to the right.
        * `0`: left and right are equal
        * `1`: left is greater than right
        * `-1`: left is less than right

* **min:** `false`  
    Specifies the minimum value of the input. Can be either an object value or a function that returns the minimum value. A value of `false` or `undefined` will disable the minimum value.

* **max:** `false`  
    Specifies the maximum value of the input. Can be either an object value or a function that returns the maximum value. A value of `false` or `undefined` will disable the maximum value.

* **empty:** `false`  
    Specifies the empty value of the input. Can be either an object value or a function that returns the empty value. A value of `false` or `undefined` will disable the empty value.
    The empty value is the value that will treated as an empty string, so the input value will be emptied whenever it's value equals the empty value. For example, if the empty value is `0`, then whenever the value of the input would be `0`, instead the input value will be empty to the user. Also if the input's value is empty when the spinner widget is created, then the empty value will be the default value.

* **step:** `1`  
    The size of the step to take when the `"step"` action is performed. The value can be:
    
    * `Object`**:**  
        Represents the step size (amount to add/subtract)

    * `Function`**:** `object function(object currentValue, int multiplier, bool decrement)`  
        Returns the new value to use. `currentValue` is the current value to add/subtract to/from, `multiplier` is the number of steps to add/subtract (when adding/subtracting more than one step at a time), and `decrement` is a value indicating if a subtraction operation should be performed instead of an addition operation.

* **halfStep:** `0.5`  
    The size of the step to take when the `"halfStep"` action is performed. This option is identical to the `"step"` option with the following exception: it can be set to `false`/`undefined` to disable the `"halfStep"` action.

* **page:** `10`  
    The size of the step to take when the `"page"` action is performed. This option is identical to the `"halfStep"` option.

### Full Options Object    

Here is the full options object and the default values:

```javascript
{
    disabled: false,
    readonly: false,
    keyboard: {
        allowed: null,
        upDownArrows: {
            defaultAction: "step",
            ctrlAction: "halfStep",
            shiftAction: "page"
        },
        pageUpDown: true
    },
    mousewheel: {
        defaultAction: "step",
        ctrlAction: "halfStep",
        shiftAction: "page"
    },
    buttons: {
        position: "inside",
        up: {
            icon: "ui-icon-triangle-1-n",
            title: null
        },
        down: {
            icon: "ui-icon-triangle-1-s",
            title: null
        },
        defaultAction: "step",
        ctrlAction: "halfStep",
        shiftAction: "page"
    },
    incremental: true,
    delay: 500,
    format: null,
    parse: null,
    compare: null,
    min: false,
    max: false,
    empty: false,
    step: 1,
    halfStep: 0.5,
    page: 10
}
```

### Events
* **start:**  
    Triggered before a spin, can be cancelled to prevent spin by returning false.

* **spin:**  
    Triggered during increment/decrement, can be cancelled to prevent spin by returning false. The current value is passed as the only property ("value") of the "ui" (2nd) parameter.

* **stop:**  
    Triggered after a spin.

* **change:**  
    Triggered when the value of the spinner has changed and the input is no longer focused.

### Methods
* **destroy()**  
    Removes the spinner functionality completely. This will return the input back to its pre-init state.

* **widget()**  
    Returns the widget container.

* **option(optionName[, value])**  
    Get or set any spinner option. If no value is specified, will act as a getter.

* **option(options)**  
    Set multiple spinner options at once by providing an options object.

* **disable()**  
    Disable the spinner input and buttons.

* **enable()**  
    Enable the spinner input and buttons.

* **readonly()**  
    Makes the widget read-only so that it no longer accepts user interaction.

* **editable()**  
    Makes the widget editable so that it will accept user interaction.

* **select()**  
    Selects the input value.

* **value([newValue])**  
    Gets or sets the spinner's value object.

* **stepUp([count])**  
    Performs a "step" action that adds one step (or the specified number of steps) to the current value of the input.

* **stepDown([count])**  
    Performs a "step" action that subtracts one step (or the specified number of steps) to the current value of the input.

* **halfStepUp([count])**  
    Performs a "halfStep" action that adds one half-step (or the specified number of half-steps) to the current value of the input.

* **halfStepDown([count])**  
    Performs a "halfStep" action that subtracts one half-step (or the specified number of half-steps) to the current value of the input.

* **pageUp([count])**  
    Performs a "page" action that adds one page (or the specified number of pages) to the current value of the input.

* **pageDown([count])**  
    Performs a "page" action that subtracts one page (or the specified number of pages) to the current value of the input.

* **spinStart([duration][, decrement])**  
    Starts the widget spinning, optionally for the specified duration (in milliseconds) and optionally decrements the value instead of incrementing it.

* **spinStop()**  
    Stops the current spin operation, if there is one.

### Utility Methods
* **jQuery.isControlKey(keyCode)**  
    Returns a value indicating if the specified keyboard key code is a control key.

## Extending The Spinner
The spinner widget was designed with extensibility in mind so that custom spinner widgets for specific object types can easily be built on top of the core spinner widget. This section contains information on how to easily extend the spinner widget to build a spinner for a custom object type.

In addition to overriding the default options, there are several internal methods that can be overridden in case a user provides a non-standard option value and to override the default ways of handling specific scenarios. This is a list of the methods and a description of what they handle.

* `string _uiSpinnerHtml()`  
    Returns the HTML element that wraps the input.

* `void _setupButtons()`  
    Adds the buttons to the side of the input.

* `void _removeButtons()`  
    Removes the buttons from the side of the input.

* `string _buttonHtml(bool stacked, bool inside)`  
    Returns the HTML for the buttons that are added to the side of the input.

* `void _setupKeyboard()`  
    Adds keyboard event listeners for user interaction using the keyboard.

* `bool _isAllowedKey(int keyCode)`  
    Returns a value indicating if the specified key code is always allowed, regardless of restrictions set in the keyboard option. By default, this method simply returns the return value of the $.isControlKey() method.

* `void _removeKeyboard()`  
    Removes keyboard event listeners for user interaction using the keyboard.

* `void _setupMouseWheel()`  
    Adds mousewheel event listeners for user interaction using the mouse wheel.

* `void _removeMouseWheel()`  
    Removes mousewheel event listeners for user interaction using the mouse wheel.

* `object _getStep()`  
    Gets the value of the step option or the default step value to use if the step option is invalid.

* `object _getHalfStep()`  
    Gets the value of the halfStep option or the default halfStep value to use if the halfStep option is invalid or disabled.

* `object _getPage()`  
    Gets the value of the page option or the default page value to use if the page option is invalid or disabled.

* `object _defaultParse(string value)`  
    Parses the specified string to the needed object type if no parse option is specified.

* `string _defaultFormat(object value)`  
    Formats the specified object value to a string if no format option is specified.

* `int _defaultCompare(object left, object right)`  
    Compares two object instances if no compare option is specified. See the compare option for details.

* `object _defaultValueCalc(object currentValue, object amount, int count, bool decrement)`  
    Increments and decrements the current value by the specified amount the specified number of times and returns the result.

* `int _defaultIncrement(int spinCount)`  
    Returns the stepping delta for the specified spin count if the incremental option is true. See the incremental option for details.

* `object _cloneValue(object value)`  
    Returns a deep clone of the object instance. This is used to clone the empty value (if there is one) when the input's value is empty so that the empty value will never be modified. Otherwise, due to the way object referencing works in Java Script, if the empty value is returned by the value() method it could be unintentionally modified.
