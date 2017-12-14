/**
 * ModalWindow 2.4
 * JQuery plugin for creating modal windows
 * https://github.com/andruvs/mw
 *
 * Copyright 2016-2017, Andrew Golovchak
 *
 * Released on: December 9, 2017
 */

(function($){

    if (!!$.mw)
    {
        return;
    }

    var ModalWindow = function(options)
    {
        this._options = $.extend({
            content: '',
            src: '',
            width: 'auto',
            height: 'auto',
            position: 'auto',
            offset: 50,
            theme: '',
            title: true,
            closeContent: true,
            closeDelay: 0,
            open: null,
            load: null,
            close: null,
            update: null
        }, options);

        this.id = '';
        if (typeof this._options.id === 'string' && this._options.id !== '')
        {
            this.id = this._options.id;
        }
        else
        {
            this.id = '' + Math.round(Math.random() * 1e6);
        }

        this._options.zIndex = 0;

        this._options.closeDelay = parseFloat(this._options.closeDelay);
        if (isNaN(this._options.closeDelay) || this._options.closeDelay < 0)
        {
            this._options.closeDelay = 0;
        }

        this._opened = false;
        this._loading = false;

        this.$mw = $('<div class="mw mw_id_' + this.id + '" />').hide();
        if (typeof this._options.theme === 'string' && this._options.theme !== '')
        {
            this.$mw.addClass('mw_theme_' + this._options.theme);
        }

        this.$inner = $('<div class="mw__inner" />').appendTo(this.$mw);
        this.$title = $('<div class="mw__title" />').appendTo(this.$inner);
        this.$close = $('<div class="mw__close" />').appendTo(this.$inner);
        this.$content = $('<div class="mw__content" />').appendTo(this.$inner);
        this.$loading = $('<div class="mw__loading" />').appendTo(this.$inner);

        var self = this;
        this.$close.on('click.mw', function()
        {
            self.close();
        });

        this.title(this._options.title);
        this.closeContent(this._options.closeContent);

        this.on('open', this._options.open);
        this.on('load', this._options.load);
        this.on('close', this._options.close);
        this.on('update', this._options.update);
    };

    ModalWindow.prototype.content = function(value)
    {
        if (typeof value !== 'undefined')
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
        if (typeof value !== 'undefined')
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
        if (typeof value !== 'undefined')
        {
            if (value === false)
            {
                this.$title.hide();
            }
            else
            {
                if (typeof value === 'string')
                {
	                this._options.title = value;
                    this.$title.html(value);
                }
                else if (value instanceof jQuery)
                {
	                this._options.title = value;
                    this.$title.empty().append(value);
                }
                this.$title.show();
            }
            return;
        }
        return this._options.title;
    };

    ModalWindow.prototype.closeContent = function(value)
    {
        if (typeof value !== 'undefined')
        {
            if (value === false)
            {
                this.$close.hide();
            }
            else
            {
                if (typeof value === 'string')
                {
	                this._options.closeContent = value;
                    this.$close.html(value);
                }
                else if (value instanceof jQuery)
                {
	                this._options.closeContent = value;
                    this.$close.empty().append(value);
                }
                this.$close.show();
            }
            return;
        }
        return this._options.closeContent;
    };

    ModalWindow.prototype.zIndex = function(value)
    {
        if (typeof value !== 'undefined')
        {
            value = parseInt(value);
            if (!isNaN(value))
            {
                this._options.zIndex = value;
                this.$mw.css('z-index', value);
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
        return this.$mw;
    };

    ModalWindow.prototype.open = function(data, options)
    {
        $.mw.open(this, data, options);
    };

    ModalWindow.prototype._open = function(data, options)
    {
        if (this._opened)
        {
            return;
        }
        this._opened = true;

        if (this.$mw.parent().length === 0)
        {
            this.$mw.appendTo('body');
        }

        this.load(data, options);

        this.$mw.show();

        var self = this;
        setTimeout(function()
        {
            self.$mw.addClass('mw_opened');
            self.$mw.trigger('open', [self, data]);
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

        this.$mw.removeClass('mw_opened');

        var self = this;
        setTimeout(function()
        {
            self.$mw.hide();

            if (self._options.content instanceof jQuery)
            {
                var placeholder = $('.mw-placeholder[data-mw="' + this.id + '"]');
                if (placeholder.length > 0)
                {
                    placeholder.replaceWith(self._options.content);
                }
            }

            self.$mw.trigger('close', [self]);

        }, this._options.closeDelay * 1000);
    };

    ModalWindow.prototype.load = function(data, options)
    {
        if (!$.isPlainObject(options))
        {
	        options = {};
        }

        if (typeof this._options.src === 'string' && this._options.src !== '')
        {
            this.loading(true);

            if (options.clear === true)
            {
                this.$content.empty();
            }

            var self = this;
            this.$content.load(this._options.src, data, function()
            {
                self.loading(false);
                self.update();
	            self.$mw.trigger('load', [self, data]);
            });
        }
        else if (typeof this._options.content === 'string')
        {
            this.$content.html(this._options.content);
            this.update();
            this.loading(false);
	        this.$mw.trigger('load', [this, data]);
        }
        else if (this._options.content instanceof jQuery)
        {
            if (this._options.content.closest('.mw').length === 0)
            {
                this._options.content.replaceWith('<div class="mw-placeholder" data-mw="' + this.id + '" />');

                this.$content.empty().append(this._options.content);
                this.update();
                this.loading(false);
	            this.$mw.trigger('load', [this, data]);
            }
        }
    };

    ModalWindow.prototype.loading = function(value)
    {
        if (value === true)
        {
            this._loading = true;
            this.$loading.show();
            this.$mw.addClass('mw_loading');
        }
        else if (value === false)
        {
            this._loading = false;
            this.$loading.hide();
	        this.$mw.removeClass('mw_loading');
        }
        return this._loading;
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

        var top, left, width, height, offsetX, offsetY,
            windowWidth = $(window).width(),
            windowHeight = $(window).height();

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

        if (this._options.width === 'auto')
        {
	        this.$mw.css('width', '');
        }
        else
        {
            this.$mw.css('width', this._options.width);
        }
	    width = this.$mw.outerWidth();
        if ((width + 2 * offsetX) > windowWidth)
        {
	        width = windowWidth - 2 * offsetX;
        }
	    this.$mw.css('width', width);

        if (this._options.height === 'auto')
        {
	        this.$mw.css('height', '');
            if (this._options.position === 'fixed')
            {
                height = Math.min(windowHeight - 2 * offsetY, this.$mw.outerHeight());
                this.$mw.css('height', height);
            }
            else
            {
                height = this.$mw.outerHeight();
            }
        }
        else
        {
            this.$mw.css('height', this._options.height);
            height = this.$mw.outerHeight();
        }

	    left = (windowWidth - width) / 2;

	    top = (windowHeight - height) / 2;
	    if (top < offsetY)
	    {
		    top = offsetY;
	    }

        if (this._options.position === 'fixed')
        {
            this.$mw.css({
                position: 'fixed',
                left: left + 'px',
                top: top + 'px'
            });
        }
        else
        {
            top += $(window).scrollTop();

            this.$mw.css({
                position: 'absolute',
                left: left + 'px',
                top: top + 'px'
            });
        }

        this.$mw.trigger('update', [this]);
    };

    ModalWindow.prototype.on = function(event, handler)
    {
        if (typeof event === 'string' && $.isFunction(handler))
        {
            this.$mw.on(event, handler);
        }

        return this;
    };

    ModalWindow.prototype.off = function(event, handler)
    {
        if (typeof event === 'string')
        {
            this.$mw.off(event, handler);
        }

        return this;
    };

    var ModalWindowManager = function()
    {
        this.$overlay = $('<div class="mw-overlay" />');

        this._defaults = null;

        this._mw = {};
        this._stack = [];

        this._startZIndex = 3000;
        this._zIndex = null;

        this._closeDisabled = false;

        var self = this;
        this.$overlay.on('click.mw', function()
        {
            self.closeAll();
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

	ModalWindowManager.prototype.startZIndex = function(value)
    {
	    value = parseInt(value);
	    if (!isNaN(value))
        {
            this._startZIndex = value;
        }
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
            if (typeof mw.id === 'string' && mw.id !== '')
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
        if (typeof mw === 'string' && mw !== '')
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
                        id: mw,
                        content: content
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

        if (typeof callback === 'undefined')
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

    ModalWindowManager.prototype.open = function(mw, data, options)
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

        if (!$.isPlainObject(options))
        {
	        options = {};
        }

        if (this._zIndex === null)
        {
	        this._zIndex = this._startZIndex;
        }

        this._stack.push(mw);

        this._showOverlay();

        mw.zIndex(this._zIndex + 1);
        mw._open(data, options);

        this._zIndex += 2;

        if (options.close === true)
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
            if (typeof theme === 'string' && theme !== '')
            {
                theme = 'mw-overlay_theme_' + theme;
            }
        }

        if (theme !== '')
        {
            if (!this.$overlay.hasClass(theme))
            {
                this.$overlay
                    .removeClass()
                    .addClass('mw-overlay ' + theme);
            }
        }
        else
        {
            this.$overlay
                .removeClass()
                .addClass('mw-overlay');
        }

        if (this.$overlay.parent().length === 0)
        {
            this.$overlay.appendTo('body');
        }

        this.$overlay.css('z-index', this._zIndex);

        if (this.$overlay.hasClass('mw-overlay_opened'))
        {
            this.$overlay.show();
        }
        else
        {
            this.$overlay.addClass('mw-overlay_opened').fadeIn();
        }
    };

    ModalWindowManager.prototype._hideOverlay = function()
    {
        this.$overlay.removeClass('mw-overlay_opened').fadeOut();
    };

    $.mw = new ModalWindowManager();

})(jQuery);