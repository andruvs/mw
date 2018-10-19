# mw
jQuery Modal Windows

This is a cute plugin for creating modal windows using a jQuery on your website.

## Quick start

Include the jQuery library, out mw.js and CSS styles for the required modal window theme.

## Usage

If you want to create a modal window you firstly have to add it to modal window manager. The manager allows to manage all of the windows added to the website page. This manager also allows you to set default parameters for all windows.

This manager can be called using *$.mw*

### Default parameters

If you want to set default parameters for all modal windows, firstly use method *#.mw.defaults()*. All of the windows added after `defaults()` method will inherit the parameters as default. 

All of the default parameters can be overridden by *$.mw.add* method.

```javascript
$(function () {
    $.mw
        .defaults({
            width: 'auto',
            theme: 'default',
            offset: {
                x: 0,
                y: 50
            },
            title: false
        });
});
```

### Adding the windows

All of the modal windows for the page have to be added to the manager:

```javascript
$(function () {
    $.mw
        .defaults({
            width: 'auto',
            theme: 'default',
            offset: {
                x: 0,
                y: 50
            },
            title: false
        })
        .add({
            id: 'feedback',
            src: '/widgets/feedback/',
            width: 600
        })
        .add({
            id: 'callback',
            src: '/widgets/callback/',
            width: 600,
            title: 'Перезвоните мне'
        });
});
```

### Window Parameters

###### id {String}

The window identifier. It must be unique. It's used for window opening or getting the instance of window from the manager.

###### theme {String}

The window theme. It's implemented using CSS styles.

###### src {String}

The path for loading the window contents. If it's set, the window contents will be loaded using AJAX during the window opening. The request method (GET or POST are supported) depends on the parameters of *$.mw.open* method.

###### content {jQuery selector, String}

If the parameter *src* is not set, selector *content* will be used as the window contents. If the *content* is string, it'll be used as window html contents.

###### width {Number, String}

Default window width. It can be set both as number (value in pixels) and as string like *'200px'* or *'60%'*

###### height {Number, String}

The window height. It can be set both as number (value in pixels) and as string like *'200px'* or *'60%'*

This parameter is used seldom because of the window variable height that depends on the contents.

###### offset {Number, Object}

Indent of the window from the browser edges. The number sets the same indent both horizontal and vertical directions. You can also set it as the object and set different values for horizontal and vertical indent:


```javascript
offset: {
    x: 20,
    y: 50
}
```

###### title {jQuery selector, String, Boolean}

The window title. If it's set to *false* title is hidden.

### Opening the window

You can use the manager's method:

*$.mw.open(mw, data);*

###### mw {String}

The window identifier you want to open.

###### data {String}

Additional request parameters getting the window contents. It's usually used when *src* parameter is set. If this parameter is set as a string (*param=value&foo=bar*), window contents will be requested using GET, and POST for the object.

For example:

```javascript
$.mw.open('callback', {
	param1: 'value1',
	param2: 'value2'
}); // POST request will be called
```

### Window closing

The modal window is usually closed by user clicking the "close" button or the window overlay. You can also use this method can be used to close the modal window programmatically.

*$.mw.close(mw);*

This method closes the window with it's identifier.

*$.mw.closeAll();*

This method closes all opened modal windows.