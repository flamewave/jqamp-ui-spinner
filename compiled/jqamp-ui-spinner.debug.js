/*!
 * jqAmp UI Spinner v1.0 (for jQuery/jQuery UI)
 *
 * Copyright 2012, Tony Kramer
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * https://github.com/flamewave/jqamp-ui-spinner/raw/master/GPL-LICENSE.txt
 * https://github.com/flamewave/jqamp-ui-spinner/raw/master/MIT-LICENSE.txt
 */

/*
 * For documentation and for the latest version, see:
 * https://github.com/flamewave/jqamp-ui-spinner
 *
 * Dependencies:
 * - jQuery (1.7.1+)
 * - jQuery-ui (1.8.18+ - core, widget, button)
 * - jQuery MouseWheel (3.0.6+ - optional, for mousewheel support)
 */ (function($) {
    var defaultIcons = ['ui-icon-triangle-1-n', 'ui-icon-triangle-1-s'];

    $.widget('jqAmpUI.spinner', {
        version: '1.0',
        options: {
            disabled: false,
            readonly: false,
            keyboard: {
                allowed: null,
                upDownArrows: {
                    defaultAction: 'step',
                    ctrlAction: 'halfStep',
                    shiftAction: 'page'
                },
                pageUpDown: true
            },
            mousewheel: {
                defaultAction: 'step',
                ctrlAction: 'halfStep',
                shiftAction: 'page'
            },
            buttons: {
                position: 'inside',
                // inside | outside | insideStacked | outsideStacked
                up: {
                    icon: defaultIcons[0],
                    title: null
                },
                down: {
                    icon: defaultIcons[1],
                    title: null
                },
                defaultAction: 'step',
                ctrlAction: 'halfStep',
                shiftAction: 'page'
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
        },

        uiSpinner: null,
        document: null,
        window: null,

        _timeout: null,
        _interval: null,
        _spinCount: 0,
        _isSpinning: false,

        _previous: undefined,

        _kbEvents: false,
        _mwEvents: false,
        _buttons: false,

        _create: function() {
            var element = this.element,
                uiSpinner, options = this.options,
                $this = this;
            this.document = $(element.style ? element.ownerDocument : element.document || element);
            this.window = this.document[0].defaultView || this.document[0].parentWindow;
            this._setValue(this._parse(element.val()), false, false);

            // load min, max, and step from input attributes
            $.each(['min', 'max', 'step'], function(i, option) {
                var value = element.attr(option);
                if (value !== undefined && value.length && !options[option]) options[option] = $this._parse(value);
            });

            // Ensure that the input's initial value is formatted properly.
            this.uiSpinner = uiSpinner = element.addClass('ui-spinner-input ui-corner-all').attr({
                'autocomplete': 'off',
                'role': 'spinbutton',
                'aria-valuemin': this._format(this._minVal()),
                'aria-valuemax': this._format(this._maxVal()),
                'aria-valuenow': this.value()
            }).wrap(this._uiSpinnerHtml()).bind({
                'focus.spinner': function() {
                    uiSpinner.addClass('ui-state-active');
                    $this._previous = $this.value();
                },
                'blur.spinner': function(event) {
                    var val = $this.value();
                    uiSpinner.removeClass('ui-state-active');
                    element.attr('aria-valuenow', val);
                    if ($this._compare($this._previous, val) !== 0) $this._trigger('change', event);

                    $this._previous = undefined;
                }
            }).parent();

            this.uiSpinner.bind({
                'mouseenter.spinner': function(event) {
                    uiSpinner.addClass('ui-state-hover');
                },
                'mouseleave.spinner': function(event) {
                    uiSpinner.removeClass('ui-state-hover');
                }
            });

            if (options.buttons) this._setupButtons();

            if (options.keyboard) this._setupKeyboard();

            if (options.mousewheel) this._setupMouseWheel();

            // Ensure widgit is disabled if the disabled option or attribute are set.
            if (options.disabled || element._prop('disabled')) this._setOption('disabled', true);

            if (options.readonly || element._prop('readonly')) this._setOption('readonly', true);

            // Turning off autocomplete prevents browser from remembering value when navigating history; re-enable autocomplete if page is unloaded before widget is destroyed.
            $(this.window).bind('beforeunload.spinner', function() {
                element.removeAttr('autocomplete');
            });
        },

        _uiSpinnerHtml: function() {
            return '<span class="ui-widget ui-spinner ui-spinner-nobuttons" />';
        },

        destroy: function() {
            $(this.window).unbind('beforeunload.spinner');
            this.element.siblings('.ui-spinner-button').remove();
            this.element.unbind('.spinner').unwrap().removeClass('ui-spinner-input').removeAttr('disabled autocomplete role aria-valuemin aria-valuemax aria-valuenow');
            $.Widget.prototype.destroy.call(this);
        },

        _setupButtons: function() {
            if (this._buttons) return;

            var buttons = this.options.buttons,
                $this = this,
                stacked = false,
                inside = true;
            if (!buttons) return;

            if (buttons.position) {
                if (buttons.position === 'insideStacked' || buttons.position === 'outsideStacked') stacked = true;

                if (buttons.position === 'outside' || buttons.position === 'outsideStacked') inside = false;
            }

            if (inside) this.uiSpinner.addClass('ui-widget-content ui-corner-all ui-spinner-inside').children('.ui-spinner-input').removeClass('ui-corner-all');
            else this.uiSpinner.addClass('ui-spinner-outside').removeClass('ui-widget-content ui-corner-all').children('.ui-spinner-input').addClass('ui-corner-all');

            this.uiSpinner.removeClass('ui-spinner-nobuttons').addClass(stacked ? 'ui-spinner-stacked' : 'ui-spinner-adjacent');

            var element = this.element[0],
                document = this.document;
            this.uiSpinner.append(this._buttonHtml(stacked, inside)).children('.ui-spinner-button').attr('tabIndex', -1).button().removeClass('ui-corner-all').bind({
                'mousedown.spinner': function(event) {
                    // ensure focus is on (or stays on) the text field
                    event.preventDefault();
                    if (document.activeElement !== element) element.focus();

                    if ($this.options.disabled || $this.options.readonly) return;

                    if (!$this._start(event)) return;

                    $this._spin($this._getAmount(buttons, event.ctrlKey, event.shiftKey), $(event.currentTarget).hasClass('ui-spinner-down'), true, event);
                },
                'mouseup.spinner': function(event) {
                    $this._stop(event);
                }
            });

            if (buttons && buttons.up && buttons.up.title) this.uiSpinner.children('.ui-spinner-up').attr('title', buttons.up.title);

            if (buttons && buttons.down && buttons.down.title) this.uiSpinner.children('.ui-spinner-down').attr('title', buttons.down.title);

            this._buttons = true;
        },

        _removeButtons: function() {
            if (!this._buttons) return;

            this.uiSpinner.removeClass('ui-spinner-inside ui-spinner-outside ui-spinner-stacked ui-spinner-adjacent ui-widget-content ui-corner-all').addClass('ui-spinner-nobuttons').children('.ui-spinner-input').addClass('ui-corner-all').end().children('.ui-spinner-button').remove();

            this._buttons = false;
        },

        _buttonHtml: function(stacked, inside) {
            var buttons = this.options.buttons,
                upcorner, downcorner;
            if (stacked) {
                upcorner = inside ? ' ui-corner-tr' : ' ui-corner-top';
                downcorner = inside ? 'ui-corner-br' : 'ui-corner-bottom';
            } else {
                upcorner = inside ? '' : ' ui-corner-left';
                downcorner = 'ui-corner-right';
            }

            function _getIcon(name, index) {
                if (!buttons || !buttons[name] || !buttons[name].icon || typeof buttons[name].icon !== 'string') return defaultIcons[index];

                return buttons[name].icon;
            }

            return '<a class="ui-spinner-button ui-spinner-up' + upcorner + '"><span class="ui-icon ' + _getIcon('up', 0) + '">&#9650;</span></a>' + '<a class="ui-spinner-button ui-spinner-down ' + downcorner + '"><span class="ui-icon ' + _getIcon('down', 1) + '">&#9660;</span></a>';
        },

        _setupKeyboard: function() {
            var $this = this,
                options = this.options,
                keyboard = options.keyboard,
                keyCode = $.ui.keyCode;
            if (this._kbEvents || !keyboard) return;

            this.element.bind({
                'keydown.spinner': function(event) {
                    if (options.disabled || options.readonly || !keyboard) return;

                    switch (event.which) {
                    case keyCode.UP:
                        if (keyboard === true || keyboard.upDownArrows) {
                            if ($this._start(event)) $this._spin($this._getAmount(keyboard.upDownArrows, event.ctrlKey, event.shiftKey), false, false, event);

                            event.preventDefault();
                            return;
                        }
                        break;

                    case keyCode.DOWN:
                        if (keyboard === true || keyboard.upDownArrows) {
                            if ($this._start(event)) $this._spin($this._getAmount(keyboard.upDownArrows, event.ctrlKey, event.shiftKey), true, false, event);

                            event.preventDefault();
                            return;
                        }
                        break;

                    case keyCode.PAGE_UP:
                        if (keyboard === true || keyboard.pageUpDown) {
                            if ($this._start(event)) $this._spin($this._getPage(), false, false, event);

                            event.preventDefault();
                            return;
                        }
                        break;

                    case keyCode.PAGE_DOWN:
                        if (keyboard === true || keyboard.pageUpDown) {
                            if ($this._start(event)) $this._spin($this._getPage(), true, false, event);

                            event.preventDefault();
                            return;
                        }
                        break;
                    }

                    if (keyboard === true || !keyboard.allowed || $this._isAllowedKey(event.which, event)) return;

                    if ($.isFunction(keyboard.allowed) && keyboard.allowed.apply($this, [event.which, event])) return;

                    else if ($.isArray(keyboard.allowed) && keyboard.allowed.indexOf(event.which) >= 0) return;

                    // Don't allow the key that was pressed to do anything since it is not an allowed key.
                    event.preventDefault();
                },
                'keyup.spinner': function(event) {
                    $this._stop(event);
                }
            });
            this._kbEvents = true;
        },

        _isAllowedKey: function(keyCode) {
            return $.isControlKey(keyCode);
        },

        _removeKeyboard: function() {
            if (!this._kbEvents) return;

            this.element.unbind('keydown.spinner').unbind('keyup.spinner');
            this._kbEvents = false;
        },

        _setupMouseWheel: function() {
            var $this = this,
                mousewheel = this.options.mousewheel;
            if (this._mwEvents || !mousewheel) return;

            this.element.bind('mousewheel.spinner', function(event, delta) {
                if (!delta || $this.options.disabled || $this.options.readonly) return;

                if (!$this._start(event)) return;

                event.preventDefault();
                $this._spin($this._getAmount(mousewheel, event.ctrlKey, event.shiftKey), delta < 0, false, event);

                clearTimeout($this._timer);
                $this._timer = setTimeout(function() {
                    if ($this._isSpinning) $this._stop(event);
                }, 100);
            });
            this._mwEvents = true;
        },

        _removeMouseWheel: function() {
            if (!this._mwEvents) return;

            this.element.unbind('mousewheel.spinner');
            this._mwEvents = false;
        },

        _getAmount: function(obj, ctrl, shift) {
            if (!obj || typeof obj !== 'object') {
                // Use defaults
                if (ctrl) return this._getHalfStep();

                if (shift) return this._getPage();

                return this._getStep();
            }

            if (ctrl) return obj.ctrlAction ? this._actionAmount(obj.ctrlAction) : this._getHalfStep();

            if (shift) return obj.shiftAction ? this._actionAmount(obj.shiftAction) : this._getPage();

            return obj.defaultAction ? this._actionAmount(obj.defaultAction) : this._getStep();
        },

        _actionAmount: function(action) {
            if (action === 'halfStep') return this._getHalfStep();

            if (action === 'page') return this._getPage();

            return this._getStep();
        },

        _getStep: function() {
            return this.options.step || 1;
        },

        _getHalfStep: function() {
            return this.options.halfStep || this._getStep();
        },

        _getPage: function() {
            return this.options.page || this._getStep();
        },

        _parse: function(val) {
            if ($.isFunction(this.options.parse)) return this.options.parse.apply(this, [val]);

            try {
                return this._defaultParse(val);
            } catch (e) {
                throw 'SpinnerException: Unable to parse the value specified without a custom parser (parse option). Reason: ' + e;
            }
        },

        _defaultParse: function(val) {
            if (typeof val === 'number') return val;

            return parseFloat(val) || 0;
        },

        _format: function(val) {
            if (val === undefined || val === null || val === false) return '';

            if ($.isFunction(this.options.format)) return this.options.format.apply(this, [val]);

            try {
                return this._defaultFormat(val);
            } catch (e) {
                throw 'SpinnerException: Unable to convert value to a string without a custom converter (format option). Reason: ' + e;
            }
        },

        _defaultFormat: function(val) {
            return val.toString();
        },

        _compare: function(left, right) {
            if ($.isFunction(this.options.compare)) return this.options.compare.apply(this, [left, right]);

            try {
                return this._defaultCompare(left, right);
            } catch (e) {
                throw 'SpinnerExpcetion: Unable to compare the value type without a custom converter (compare option).';
            }
        },

        _defaultCompare: function(left, right) {
            if (left === null || left === undefined) left = this._emptyVal() || 0;

            if (right === null || right === undefined) right = this._emptyVal() || 0;

            if (left === right || left == right) return 0;

            if (left < right) return -1;

            return 1;
        },

        _isEmptyVal: function(val) {
            var empty = this._emptyVal();
            if (empty === false) return false;

            return this._compare(empty, val === undefined ? this.value() : val) === 0;
        },

        _emptyVal: function() {
            var empty = this.options.empty;
            if (empty === false || empty === undefined) return false;

            if ($.isFunction(empty)) return empty.apply(this);

            this.options.empty = empty = this._parse(empty);
            return empty;
        },

        _minVal: function() {
            var min = this.options.min;
            if (min === false || min === undefined) return false;

            if ($.isFunction(min)) return min.apply(this);

            this.options.min = min = this._parse(min);
            return min;
        },

        _maxVal: function() {
            var max = this.options.max;
            if (max === false || max === undefined) return false;

            if ($.isFunction(max)) return max.apply(this);

            this.options.max = max = this._parse(max);
            return max;
        },

        _checkMinMax: function(val, currentValue) {
            var min = this._minVal(),
                max = this._maxVal();
            if (min !== false && this._compare(val, min) < 0) {
                if (this._compare(currentValue, min) === 0) return false;

                return min;
            } else if (max !== false && this._compare(val, max) > 0) {
                if (this._compare(currentValue, max) === 0) return false;

                return max;
            }

            return val;
        },

        _setValue: function(val, raiseChange, noMinMaxCheck) {
            if (!noMinMaxCheck) {
                val = this._checkMinMax(val, this.value());
                if (val === false) return;
            }

            var isEmpty = this._isEmptyVal(val),
                formattedVal = this._format(val),
                triggerChange = raiseChange && formattedVal !== this.element.val();
            this.element.val(isEmpty ? '' : formattedVal).attr('aria-valuenow', val);
            if (triggerChange) this._trigger('change');
        },

        _adjustValue: function(count, amount, decrement, raiseChange, event) {
            if (this.options.disabled || !amount) return false;

            var currentValue = this.value(),
                val = this._checkMinMax($.isFunction(amount) ? amount.call(this, [currentValue, count, decrement]) : this._defaultValueCalc(currentValue, amount, count, decrement), currentValue);
            if (val === false) {
                if (this._isSpinning) this._stop(event);

                return false;
            }

            if (this._isSpinning && this._trigger('spin', event, {
                value: val
            }) === false) return false;

            this._setValue(val, raiseChange, true);
            return true;
        },

        _defaultValueCalc: function(value, amount, count, decrement) {
            try {
                if (decrement) return value - (amount * count);

                return value + (amount * count);
            } catch (e) {
                throw 'SpinnerException: Unable to increment/decrement the value without a custom stepper (step, halfStep, and page options).';
            }
        },

        _increment: function(spinCount) {
            var incremental = this.options.incremental;
            if (incremental) return $.isFunction(incremental) ? incremental.apply(this, [spinCount]) : this._defaultIncrement(spinCount);

            return 1;
        },

        _defaultIncrement: function(spinCount) {
            return Math.floor(spinCount * spinCount * spinCount / 50000 - spinCount * spinCount / 500 + 17 * spinCount / 200 + 1);
        },

        _start: function(event) {
            if (!this._isSpinning && this._trigger('start', event) === false) return false;

            if (!this._spinCount) this._spinCount = 1;

            this._isSpinning = true;
            return true;
        },

        _spin: function(amount, decrement, repeat, event) {
            if (!this._spinCount) this._spinCount = 1;

            if (!this._adjustValue(this._increment(this._spinCount), amount, decrement, false, event)) {
                this._stop(event);
                return;
            }

            this._spinCount++;
            if (repeat) this._repeat(amount, decrement, event);
        },

        _repeat: function(amount, decrement, event) {
            var delay = this.options.delay;
            if (typeof delay !== 'number' || delay <= 0) delay = 500;

            var $this = this;
            this._timeout = setTimeout(_firstInterval, delay);

            function _firstInterval() {
                clearTimeout($this._timeout);
                $this._timeout = null;
                $this._spin(amount, decrement, false, event);
                $this._interval = setInterval(function() {
                    $this._spin(amount, decrement, false, event);
                }, 40);
            }
        },

        _stop: function(event) {
            clearTimeout(this._timeout);
            clearInterval(this._interval);
            this._timeout = null;
            this._interval = null;
            this._spinCount = 0;

            if (this._isSpinning) {
                this._isSpinning = false;
                this._trigger('stop', event);
            }
        },

        _setOption: function(key, value) {
            var options = this.options,
                element = this.element,
                uiSpinner = this.uiSpinner,
                setupkb, setupmw, setupbtns;
            switch (key) {
            case 'disabled':
                options.disabled = value;
                element._prop('disabled', value).parent()[value ? 'addClass' : 'removeClass']('ui-spinner-disabled ui-state-disabled').attr('aria-disabled', value);
                if (options.buttons) uiSpinner.children('.ui-spinner-button').button(value ? 'disable' : 'enable');
                break;

            case 'readonly':
                options.readonly = value;
                element._prop('readonly', value).parent()[value ? 'addClass' : 'removeClass']('ui-spinner-readonly');
                if (options.buttons) uiSpinner.children('.ui-spinner-button').button(value ? 'disable' : 'enable');
                break;

            case 'keyboard':
                options.keyboard = value;
                this._removeKeyboard();
                this._setupKeyboard();
                break;

            case 'mousewheel':
                options.mousewheel = value;
                this._removeMouseWheel();
                this._setupMouseWheel();
                break;

            case 'buttons':
                options.buttons = value;
                this._removeButtons();
                this._setupButtons();
                break;

            case 'format':
                options.format = value;
                this._setValue(this.value(), false, true);
                break;

            case 'min':
                options.min = value;
                var min = this._minVal();
                if (min !== false && this._compare(this.value(), min) < 0) this._setValue(min, true, true);
                break;

            case 'max':
                options.max = value;
                var max = this._maxVal();
                if (max !== false && this._compare(this.value(), max) > 0) this._setValue(max, true, true);
                break;

            case 'empty':
                if (value === false || value === undefined) {
                    var empty = this._emptyVal();
                    options.empty = false;
                    if (!element.val() && empty !== false) this._setValue(empty, false, true);
                } else {
                    options.empty = value;
                    if (this._isEmptyVal(this.value())) element.val('');
                }
                break;

            default:
                // incremental, delay, parse, compare, step, halfStep, page
                $.Widget.prototype._setOption.call(this, key, value);
                break;
            }
            return this;
        },

        // Public methods

        value: function(val) {
            var options = this.options;

            // Method called as a getter.
            if (val === undefined) {
                val = this.element.val();
                if (val) return this._parse(val);

                // return a clone of the empty object so that the original empty object does not get modified.
                if (options.empty !== undefined && options.empty !== false) this._cloneValue(options.empty);

                return null;
            }

            if (!options.disabled) this._setValue(this._parse(val), true, false);

            return this;
        },

        _cloneValue: function(val) {
            if (typeof val !== 'object') return val;

            if (val instanceof Date) return new Date(val.getTime());

            return $.extend(true, {}, val);
        },

        stepUp: function(count) {
            this._adjustValue(count || 1, this._getStep(), false, true, null);
            return this;
        },

        stepDown: function(count) {
            this._adjustValue(count || 1, this._getStep(), true, true, null);
            return this;
        },

        halfStepUp: function(count) {
            this._adjustValue(count || 1, this._getHalfStep(), false, true, null);
            return this;
        },

        halfStepDown: function(count) {
            this._adjustValue(count || 1, this._getHalfStep(), true, true, null);
            return this;
        },

        pageUp: function(count) {
            this._adjustValue(count || 1, this._getPage(), false, true, null);
            return this;
        },

        pageDown: function(count) {
            this._adjustValue(count || 1, this._getPage(), true, true, null);
            return this;
        },

        spinStart: function(duration, decrement) {
            if (this._isSpinning) this._stop(null);

            if (!this._start(null)) return;

            if (duration === true) {
                decrement = true;
                duration = 0;
            }

            var $this = this;
            this._spin(this._getStep(), decrement, false, null);
            this._interval = setInterval(function() {
                $this._spin($this._getStep(), decrement, false, null);
            }, 40);

            if (duration) setTimeout(function() {
                $this._stop(null);
            }, duration);
        },

        spinStop: function() {
            this._stop(null);
        },

        // Selects the input value.
        select: function() {
            if (!this.options.disabled) this.element.select();

            return this;
        },

        readonly: function() {
            this._setOption('readonly', true);
            return this;
        },

        editable: function() {
            this._setOption('readonly', false);
            return this;
        },

        widget: function() {
            return this.uiSpinner;
        }
    });

    // Properly make use of the "prop" jQuery function if it exists, otherwise use the old "attr" way.
    $.fn._prop = function(name, value) {
        if (this.prop) return value === undefined ? this.prop(name) : this.prop(name, value);

        if (value === false) return this.removeAttr(name);

        return value === undefined ? this.attr(name) : this.attr(name, value === true ? name : value);
    }

    $.isControlKey = function(keyCode) {
        // See http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes for a list of key codes.
        return (keyCode <= 47 && keyCode != 32) || (keyCode >= 91 && keyCode <= 95) || (keyCode >= 112 && [186, 187, 188, 189, 190, 191, 192, 219, 220, 221, 222].indexOf(keyCode) === -1);
    }

})(jQuery);

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
 */ (function($) {
    $.widget("jqAmpUI.numeric", $.jqAmpUI.spinner, {
        version: "1.0",
        options: {
            culture: null,
            radix: 10
        },

        _isAllowedKey: function(keyCode) {
            if (event.ctrlKey && [65, 67, 86, 88, 89, 90].indexOf(keyCode) !== -1) return true; // Keyboard shortcuts for select all, copy, paste, cut, redo, and undo

            if (keyCode === 109 || keyCode === 110 // negative sign and decimal on num pad
            ||
            (keyCode >= 48 && keyCode <= 57) // 48 - 57 are numerical key codes for key pad nubers
            ||
            (keyCode >= 96 && keyCode <= 105)) // 96 - 105 are numerical key codes for num pad numbers
            return true;

            if (!event.shift && (keyCode === 189 || keyCode === 190)) // negative sign and decimal on key pad
            return true;

            return $.isControlKey(keyCode);
        },

        _parse: function(val) {
            if (typeof val === "number") return val;

            try {
                return Globalize.parseFloat(val, this.options.radix, this.options.culture) || 0;
            } catch (e) {
                throw 'SpinnerException: Unable to parse the value specified without a custom parser (parse option). Reason: ' + e;
            }
        },

        _format: function(val) {
            if (val === undefined || val === null || val === false) return "";

            try {
                if (typeof val !== "number") val = Globalize.parseFloat(val, this.options.radix, this.options.culture) || 0;

                if (!val && val !== 0) val = 0;

                return Globalize.format(val, this.options.format, this.options.culture) || "";
            } catch (e) {
                throw 'SpinnerException: Unable to convert value to a string without a custom converter (format option). Reason: ' + e;
            }
        },

        _cloneValue: function(val) {
            if (typeof val !== "number") return Globalize.parseFloat(val, this.options.radix, this.options.culture) || 0;

            return val;
        }
    });

})(jQuery);
