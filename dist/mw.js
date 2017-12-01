/**
 * ModalWindow 2.3
 * JQuery plugin for creating modal windows
 *
 * Copyright 2016, Andrew Golovchak
 *
 * Released on: September 29, 2017
 */

(function($){

    if (!!$.mw)
    {
        return;
    }

    var ModalWindow = function(options)
    {
        this._options = $.extend({
            'content' : '',
            'src' : '',
            'width' : 'auto',
            'height' : 'auto',
            'offset' : 50,
            'theme' : '',
            'title' : true,
            'closeContent' : true,
            'closeDelay' : 0
        }, options);

        this.id = '';
        if (typeof this._options.id == 'string' && this._options.id != '')
        {
            this.id = this._options.id;
        }
        else
        {
            this.id = '' + Math.round(Math.random() * 1000000) + '_' + (new Date().getTime());
        }

        this._options.zIndex = 0;

        this._options.closeDelay = parseFloat(this._options.closeDelay);
        if (isNaN(this._options.closeDelay) || this._options.closeDelay < 0)
        {
            this._options.closeDelay = 0;
        }

        this._opened = false;
        this._loading = false;

        this._element = $('<div class="mw mw_id_' + this.id + '" />').hide();
        if (typeof this._options.theme == 'string' && this._options.theme != '')
        {
            this._element.addClass('mw_theme_' + this._options.theme);
        }

        this._elementInner = $('<div class="mw__inner" />').appendTo(this._element);

        this._elementTitle = $('<div class="mw__title" />').appendTo(this._elementInner);
        this._elementClose = $('<div class="mw__close" />').appendTo(this._elementInner);
        this._elementContent = $('<div class="mw__content" />').appendTo(this._elementInner);
        this._elementLoading = $('<div class="mw__loading" />').appendTo(this._elementInner);

        var self = this;
        this._elementClose.on('click.mw', function()
        {
            self.close();
        });

        this.title(this._options.title);
        this.closeContent(this._options.closeContent);
    };

    ModalWindow.prototype.content = function(value)
    {
        if (typeof value != 'undefined')
        {
            this._options.content = value;
            if (this._opened)
            {
                this.load();
            }
            return;
        }
        return this._options.content;
    };

    ModalWindow.prototype.src = function(value)
    {
        if (typeof value != 'undefined')
        {
            this._options.src = value;
            if (this._opened)
            {
                this.load();
            }
            return;
        }
        return this._options.src;
    };

    ModalWindow.prototype.title = function(value)
    {
        if (typeof value != 'undefined')
        {
            if (value === false)
            {
                this._elementTitle.hide();
            }
            else
            {
                if (typeof value == 'string')
                {
                    this._elementTitle.html(value);
                }
                else if (value instanceof jQuery)
                {
                    this._elementTitle.append(value);
                }
                this._elementTitle.show();
            }
            return;
        }
        return this._elementTitle;
    };

    ModalWindow.prototype.closeContent = function(value)
    {
        if (typeof value != 'undefined')
        {
            if (value === false)
            {
                this._elementClose.hide();
            }
            else
            {
                if (typeof value == 'string')
                {
                    this._elementClose.html(value);
                }
                else if (value instanceof jQuery)
                {
                    this._elementClose.append(value);
                }
                this._elementClose.show();
            }
            return;
        }
        return this._elementClose;
    };

    ModalWindow.prototype.zIndex = function(value)
    {
        if (typeof value != 'undefined')
        {
            value = parseInt(value);
            if (!isNaN(value))
            {
                this._options.zIndex = value;
                this._element.css('z-index', value);
            }
            return;
        }
        return this._options.zIndex;
    };

    ModalWindow.prototype.theme = function()
    {
        return this._options.theme;
    };

    ModalWindow.prototype.element = function()
    {
        return this._element;
    };

    ModalWindow.prototype.open = function(data, callback)
    {
        $.mw.open(this, data, callback);
    };

    ModalWindow.prototype._open = function(data, callback)
    {
        if (this._opened)
        {
            return;
        }
        this._opened = true;

        if (this._element.parent().length == 0)
        {
            this._element.appendTo($('body'));
        }

        if (data !== false && data !== null)
        {
            this.load(data, true, callback);
        }

        this._element.show();

        var self = this;
        setTimeout(function()
        {
            self._element.addClass('mw_opened');
            self._element.trigger('open', [self, data]);
        }, 1);

        this.update();
    };

    ModalWindow.prototype.close = function()
    {
        $.mw.close(this);
    };

    ModalWindow.prototype._close = function()
    {
        if (!this._opened)
        {
            return;
        }
        this._opened = false;

        this._element.removeClass('mw_opened');

        var self = this;

        setTimeout(function()
        {
            self._element.hide();

            if (self._options.content instanceof jQuery)
            {
                var placeholder = $('.mw-placeholder[data-mw="' + this.id + '"]');
                if (placeholder.length > 0)
                {
                    placeholder.replaceWith(self._options.content);
                }
            }

            self._element.trigger('close', [self]);

        }, this._options.closeDelay * 1000);
    };

    ModalWindow.prototype.load = function(data, clear, callback)
    {
        if (typeof this._options.src == 'string' && this._options.src != '')
        {
            this.loading(true);

            if (clear === true)
            {
                this._elementContent.empty();
            }

            var self = this;
            this._elementContent.load(this._options.src, data, function()
            {
                self.loading(false);
                self.update();
                if ($.isFunction(callback))
                {
                    callback.call(self);
                }
            });
        }
        else if (typeof this._options.content == 'string')
        {
            this._elementContent.html(this._options.content);
            this.update();
            this.loading(false);
            if ($.isFunction(callback))
            {
                callback.call(this);
            }
        }
        else if (this._options.content instanceof jQuery)
        {
            if (this._options.content.closest('.mw').length == 0)
            {
                this._options.content.replaceWith('<div class="mw-placeholder" data-mw="' + this.id + '" />');

                this._elementContent.empty().append(this._options.content);
                this.update();
                this.loading(false);
                if ($.isFunction(callback))
                {
                    callback.call(this);
                }
            }
        }
    };

    ModalWindow.prototype.loading = function(value)
    {
        if (value === true)
        {
            this._loading = true;
            this._elementLoading.show();
        }
        else if (value === false)
        {
            this._loading = false;
            this._elementLoading.hide();
        }
        else
        {
            return this._loading;
        }
    };

    ModalWindow.prototype.opened = function()
    {
        return this._opened;
    };

    ModalWindow.prototype.update = function()
    {
        if (!this._opened)
        {
            return;
        }

        var top, left, width, height, offsetX, offsetY;

        if ($.isPlainObject(this._options.offset))
        {
            offsetX = parseInt(this._options.offset.x);
            offsetY = parseInt(this._options.offset.y);
        }
        else
        {
            offsetX = offsetY = parseInt(this._options.offset);
        }

        if (isNaN(offsetX) || offsetX < 0)
        {
            offsetX = 0;
        }
        if (isNaN(offsetY) || offsetY < 0)
        {
            offsetY = 0;
        }

        this._element.css('width', '');
        if (this._options.width == 'auto')
        {
            width = this._element.outerWidth();
        }
        else
        {
            this._element.css('width', this._options.width);
            width = this._element.outerWidth();
        }

        this._element.css('height', '');
        if (this._options.height == 'auto')
        {
            if (this._options.position == 'fixed')
            {
                height = Math.min($(window).height() - 2 * offsetY, this._element.outerHeight());
                this._element.css('height', height + 'px');
            }
            else
            {
                height = this._element.outerHeight();
            }
        }
        else
        {
            this._element.css('height', this._options.height);
            height = this._element.outerHeight();
        }

        if (this._options.position == 'fixed')
        {
            left = ($(window).width() - width) / 2;
            if (left < offsetX)
            {
                left = offsetX;
            }

            top = ($(window).height() - height) / 2;
            if (top < offsetY)
            {
                top = offsetY;
            }

            this._element.css({
                'position' : 'fixed',
                'left' : left + 'px',
                'top' : top + 'px'
            });
        }
        else if (this._options.position != 'auto')
        {
            left = ($(window).width() - width) / 2;
            if (left < offsetX)
            {
                left = offsetX;
            }

            top = $(window).scrollTop() + ($(window).height() - height) / 2;
            if (top < offsetY)
            {
                top = offsetY;
            }

            this._element.css({
                'position' : 'absolute',
                'left' : left + 'px',
                'top' : top + 'px'
            });
        }

        this._element.trigger('update', [self]);
    };

    ModalWindow.prototype.on = function(event, handler)
    {
        if (typeof event == 'string' && $.isFunction(handler))
        {
            this._element.on(event, handler);
        }

        return this;
    };

    ModalWindow.prototype.off = function(event, handler)
    {
        if (typeof event == 'string')
        {
            this._element.off(event, handler);
        }

        return this;
    };

    var ModalWindowManager = function()
    {
        this._elementOverlay = $('<div class="mw-overlay" />');

        this._defaults = null;

        this._mw = {};
        this._stack = [];

        this._startZIndex = 3000;
        this._zIndex = this._startZIndex;

        this._closeDisabled = false;

        var self = this;
        this._elementOverlay.on('click.mw', function()
        {
            var l = self._stack.length;
            if (l > 0)
            {
                self.close(self._stack[l - 1]);
            }
        });

        $(window).on('resize.mw', function()
        {
            var id, mw;
            for (id in self._mw)
            {
                mw = self._mw[id];
                if (mw.opened())
                {
                    mw.update();
                }
            }
        });
    };

    ModalWindowManager.prototype.defaults = function(options)
    {
        if ($.isPlainObject(options))
        {
            this._defaults = $.extend({}, options);
        }
        else
        {
            this._defaults = null;
        }
        return this;
    };

    ModalWindowManager.prototype.add = function(mw)
    {
        if ($.isPlainObject(mw))
        {
            if (this._defaults !== null)
            {
                mw = $.extend($.extend({}, this._defaults), mw);
            }
            mw = new ModalWindow(mw);
        }
        if (mw instanceof ModalWindow)
        {
            if (typeof mw.id == 'string' && mw.id != '')
            {
                if (!this._mw.hasOwnProperty(mw.id))
                {
                    this._mw[mw.id] = mw;
                }
            }
        }
        return this;
    };

    ModalWindowManager.prototype.get = function(mw, callback)
    {
        if (typeof mw == 'string' && mw != '')
        {
            if (this._mw.hasOwnProperty(mw))
            {
                mw = this._mw[mw];
            }
            else
            {
                var content = $('[data-mw="' + mw + '"]');
                if (content.length > 0)
                {
                    this.add({
                        'id' : mw,
                        'content' : content
                    });

                    if (this._mw.hasOwnProperty(mw))
                    {
                        mw = this._mw[mw];
                    }
                }
            }
        }

        if (!(mw instanceof ModalWindow))
        {
            mw = null;
        }

        if (typeof callback == 'undefined')
        {
            return mw;
        }
        else if (mw !== null)
        {
            if ($.isFunction(callback))
            {
                callback.call(mw.element(), mw);
            }
        }

        return this;
    };

    ModalWindowManager.prototype.open = function(mw, data, callback, close)
    {
        mw = this.get(mw);
        if (mw === null)
        {
            return this;
        }

        if (mw.opened())
        {
            return this;
        }

        this._stack.push(mw);

        this._showOverlay();

        mw.zIndex(this._zIndex + 1);
        mw._open(data, callback);

        this._zIndex += 2;

        if (close === true)
        {
            var i = this._stack.length;
            if (i > 1)
            {
                while(--i > 0)
                {
                    this.close(this._stack[0]);
                }
            }
        }

        return this;
    };

    ModalWindowManager.prototype.close = function(mw)
    {
        if (this._closeDisabled)
        {
            return this;
        }

        mw = this.get(mw);
        if (mw === null)
        {
            return this;
        }

        if (!mw.opened())
        {
            return this;
        }

        var i = this._stack.length;

        while(--i > -1)
        {
            if (mw === this._stack[i])
            {
                break;
            }
        }

        mw._close();

        if (i > -1)
        {
            this._stack.splice(i, 1);
            i = this._stack.length;
            if (i > 0)
            {
                this._zIndex = this._stack[i - 1].zIndex() - 1;
                this._showOverlay();
                this._zIndex += 2;
                return this;
            }
        }

        this._zIndex = this._startZIndex;
        this._hideOverlay();

        return this;
    };

    ModalWindowManager.prototype.closeAll = function()
    {
        if (this._closeDisabled)
        {
            return this;
        }

        var id, mw;
        for (id in this._mw)
        {
            mw = this._mw[id];
            if (mw.opened())
            {
                mw._close();
            }
        }

        this._stack.length = 0;

        this._zIndex = this._startZIndex;
        this._hideOverlay();

        return this;
    };

    ModalWindowManager.prototype.disableClose = function()
    {
        this._closeDisabled = true;
        return this;
    };

    ModalWindowManager.prototype.enableClose = function()
    {
        this._closeDisabled = false;
        return this;
    };

    ModalWindowManager.prototype._showOverlay = function()
    {
        var theme = '',
            l = this._stack.length;

        if (l > 0)
        {
            theme = this._stack[l - 1].theme();
            if (typeof theme == 'string' && theme != '')
            {
                theme = 'mw-overlay_theme_' + theme;
            }
        }

        if (theme != '')
        {
            if (!this._elementOverlay.hasClass(theme))
            {
                this._elementOverlay
                    .removeClass()
                    .addClass('mw-overlay ' + theme);
            }
        }
        else
        {
            this._elementOverlay
                .removeClass()
                .addClass('mw-overlay');
        }

        if (this._elementOverlay.parent().length == 0)
        {
            this._elementOverlay.appendTo($('body'));
        }

        this._elementOverlay.css('z-index', this._zIndex);

        if (this._elementOverlay.hasClass('mw-overlay__opened'))
        {
            this._elementOverlay.show();
        }
        else
        {
            this._elementOverlay.addClass('mw-overlay__opened').fadeIn();
        }
    };

    ModalWindowManager.prototype._hideOverlay = function()
    {
        this._elementOverlay.removeClass('mw-overlay__opened').fadeOut();
    };

    $.mw = new ModalWindowManager();

})(jQuery);