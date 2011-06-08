var API;
(function()
{
    if(API)
    {
        var attachClipboardListeners = function(el, listener)
        {
            var deferredListener = function()
            {
                window.setTimeout(listener, 1);
            };

            el.onpaste = deferredListener;
            el.oncut = deferredListener;
        };


        var attachCharCounter = function(textEl, limit, options)
        {
            var counter = options.counter;
            var enforceLimit = options.enforceLimit;

            var update = function()
            {
                if(enforceLimit && textEl.value.length > limit)
                {
                    textEl.value = textEl.value.slice(0, limit);
                }

                if(counter)
                {
                    if(counter.nodeName.toLowerCase() == 'input')
                    {
                        counter.value = limit - textEl.value.length;
                    }
                    else
                    {
                        API.emptyNode(counter);
                        counter.appendChild(document.createTextNode(limit - textEl.value.length));                        
                    }
                }
            };

            var onkey = function(e, keyCode)
            {
                // Backspace (8) is included for keydown auto-repeats, which do not
                    // fire keypress events in all browsers

                if (keyCode == 45 || keyCode == 46 || keyCode == 127 || keyCode == 8)
                {
                    update();
                }
            };

            var onchar = function(e, keyCode)
            {
                window.setTimeout(function()
                {
                    update();
                }, 0);
            };

            var onshortcutchar = function(e, charCode) {
                var that = this;

                if (!charCode || charCode == 68 || charCode == 86 || (charCode > 87 && charCode < 91))
                {

                    // Clipboard, undo/redo operations may not have completed yet

                    window.setTimeout(function()
                    {
                        update();
                    }, 1);
                }
            };

            API.attachKeyboardListeners(
                textEl,
                {
                    onchar: onchar,
                    onkey: onkey,
                    onshortcutchar: onshortcutchar
                }
            );
        };

        API.attachCharCounter = attachCharCounter;
    }
})();
