# mw
*jQuery Modal Windows*

Library for creating modal windows on the site based on jQuery plugin.

## Getting Started

Include the js and css files which you can find in the dist folder.

```
<link rel="stylesheet" href="dist/mw.default.css" />
<script src="dist/mw.min.js"></script>
```

## Usage

Modal windows are controlled by the window manager which is accessible in code via `$.mw`. Each modal window used on the page must be added to the window manager. The window manager allows you to open, close windows, display windows on top of each other, and also set the default parameters.

### Default parameters

Using the window manager method `$.mw.defaults()`, you can set the common default parameters of the windows so that you do not specify them when creating each window. All windows added after calling `$.mw.defaults()` will use these parameters as default values.

Any default parameter can be overridden when adding a window to the manager.

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

### Adding modal windows

To add a window to the manager, use the method `$.mw.add()`

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

### Settings

Option | Type | Default | Description
------ | ---- | ------- | -----------
id | string | random | The identifier of the window. Should be unique. Used to open and retrieve a window instance using the manager.
theme | string | '' | The theme of the window. [Read more](#themes)
src | string | '' | The path to load the contents of the window. If this parameter is set, the content will be loaded with ajax request when the window is opened. 
content | jQuery selector &#124; string | '' | If the `src` parameter is not specified, then the `content` will be used as the contents of the window. If `content` is a string, then it will be used as the html of the contents of the window. 
width | integer &#124; string | 'auto' | The width of the window. If the value of the parameter is a number, then this value is in pixels. String variants are also possible: `'200px'`, `'60%'` 
height | integer &#124; string | 'auto' | The height of the window. If the value of the parameter is a number, then this value is in pixels. String variants are also possible: `'200px'`, `'60%'`. <br><br>Usually this parameter is not specified. 
offset | integer &#124; object | 50 | Minimum space between viewport and modal window. Can be set as object `{x: 20, y: 50}`
title | jQuery selector &#124; string &#124; boolean | true | The title of the window. If the `title` parameter is boolean, then the title will be shown or hidden depending on the value.
closeContent | jQuery selector &#124; string &#124; boolean | true | Allows to specify custom contents of the window close button. For example `<span class="close-button">Close window</span>`. If the `closeContent` parameter is boolean, then the close button will be shown or hidden depending on the value.
closeDelay | integer | 0 | Number of seconds of delay before closing the window. When the window is closed, the `mw_opened` class is removed, so it can be used to animate the effect of closing a window using css.

### Methods of window manager

Methods are called on manager instances `$.mw`:

```javascript
$.mw.open('id');
```

### Opening the window

### Themes


### Открытие окна

Для открытия окна необходимо использовать метод менеджера:

*$.mw.open(mw, data);*

###### mw {String}

Идентификатор окна, которое необходимо открыть.

###### data {String}

Дополнительные параметры, которые будут переданы вместе с ajax запросом при запросе соедржимого окна. Актуально только при использовании параметра *src*. Если указана строка (*param=value*), то содержимое окна будет запрошено методом GET, если объект - то POST.

Пример:

```javascript
$.mw.open('callback', {
	param1: 'value1',
	param2: 'value2'
});
```

### Закрытие окна

Обычно закрытие окна осуществляется пользователем при клике на кнопку "Закрыть" или при клике на затенении. Но если требуется закрыть окно через код, то можно воспользоваться следующими методами:

*$.mw.close(mw);*

Закрывает окно по его идентификатору.

*$.mw.closeAll();*

Закрывает все открытые окна.