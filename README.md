# mw
*jQuery Modal Windows*

Library for creating modal windows on the site based on jQuery plugin.

## Getting Started

Include the js and css files which you can find in the dist folder. Убедитесь, что на сайте подключена библиотека jQuery (>= 3.x.x)

```
<link rel="stylesheet" href="dist/mw.default.css" />
<script src="dist/mw.min.js"></script>
```

## Темы оформления

Внешний вид окна определяется темой оформления. Тема - это набор CSS стилей, которые реализуют конкретную тему оформления окна. Каждая тема определяется уникальным символьным идентификатом, например, `default` или `white-round-window`. Тема по-умолчанию задается при создании окна. При необходимости тему можно сменить во время открытия окна. Пример реализации темы оформления окна можно посмотреть в файле `dist/mw.default.css`.

### Структура верстки окна

Во время создания окна библиотека генерирует следующий каркас окна и добавляет его в `$('body')`:

```html
<div class="mw mw_id_{{ Идентификатор окна }} mw_theme_{{ Символьный код темы }} mw_state_{{ Символьный код состояния окна }}">
    <div class="mw__inner">
        <div class="mw__title">
            {{ Заголовок окна }}
        </div>
        <div class="mw__close"></div>
        <div class="mw__content">
            {{ Контент окна }}
        </div>
        <div class="mw__loading"></div>
    </div>
</div>
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

Также имеется возможность задать параметры по умолчанию для каждой темы отдельно (или сразу для нескольких тем). Для этого первым параметром необходимо передать символьный идентификатор темы или массив символьных идентификаторв, а вторым параметры по-умолчанию:

```javascript
$(function () {
    $.mw
        .defaults('my-cool-theme', {
            offset: 30,
            width: 250
        })
        .defaults(['my-cool-theme', 'another-theme'], {
            width: 300
        });
});
```

Таким образом можно определить общие настройки для всех тем оформления, а затем задать уточняющие параметры для каждой отдельной темы:

```javascript
$(function () {
    $.mw
        .defaults({
            width: 'auto',
            offset: {
                x: 0,
                y: 50
            },
            title: false
        })
        .defaults('wide-theme', {
            offset: 0,
            width: '100%'
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
theme | string | '' | The theme of the window.
src | string | '' | The path to load the contents of the window. If this parameter is set, the content will be loaded with ajax request when the window is opened. 
content | jQuery selector &#124; string | '' | If the `src` parameter is not specified, then the `content` will be used as the contents of the window. If `content` is a string, then it will be used as the html of the contents of the window. 
width | integer &#124; string | 'auto' | The width of the window. If the value of the parameter is a number, then this value is in pixels. String variants are also possible: `'200px'`, `'60%'` 
height | integer &#124; string | 'auto' | The height of the window. If the value of the parameter is a number, then this value is in pixels. String variants are also possible: `'200px'`, `'60%'`. <br><br>Usually this parameter is not specified. 
offset | integer &#124; object | 50 | Minimum space between viewport and modal window. Can be set as object `{x: 20, y: 50}`
title | jQuery selector &#124; string &#124; boolean | true | The title of the window. If the `title` parameter is boolean, then the title will be shown or hidden depending on the value.
closeContent | jQuery selector &#124; string &#124; boolean | true | Allows to specify custom contents of the window close button. For example `<span class="close-button">Close window</span>`. If the `closeContent` parameter is boolean, then the close button will be shown or hidden depending on the value.
closingDuration | integer | 0 | Длительность закрытия окна в секундах. Этот параметр может быть использован для анимации эффекта закрытия окна с помощью CSS стилей.
openingDuration | integer | 0 | Длительность открытия окна в секундах. Этот параметр может быть использован для анимации эффекта открытия окна с помощью CSS стилей.
opening | function | null | Функция обратного вызова, которая вызывается перед открытием окна.
open | function | null | Функция обратного вызова, которая вызывается после открытия окна.
load | function | null | Функция обратного вызова, которая вызывается после загрузки содержимого окна.
closing | function | null | Функция обратного вызова, которая вызывается перед закрытием окна.
close | function | null | Функция обратного вызова, которая вызывается после закрытия окна.
update | function | null | Функция обратного вызова, которая вызывается после обновления размеров и положения окна.

### Методы менеджера окон

Methods are called on manager instances `$.mw`:

#### Открытие окон

```javascript
$.mw.open(id, data, options);
```

Option | Type | Description
------ | ---- | -----------
id* | string |The identifier of the window. Обязательный параметр.
data | string &#124; object | A plain object or string that is sent to the server with the request. Используется для окон, у которых содержимое загружается посредством ajax.
options | object | Параметры открытия окна. Может содержать следующие ключи:
∟&nbsp;theme | string | Новая тема окна.
∟&nbsp;close | boolean | Если `true`, то будут закрыты все остальные окна. В противном случае окно будет открыто поверх других открытых окон.
∟&nbsp;clear | boolean | Если `true`, то перед загрузкой содержимого окна старый контент будет сразу удален.

Пример:

```javascript
$.mw.open('callback',
    {
        param1: 'value1',
        param2: 12345
    },
    {
    	close: true
    }
);
```

или

```html
<a href="javascript:void(0);" onclick="$.mw.open('feedback', {param: 12345});">Открыть окно</a>
```

#### Закрытие окон

Обычно закрытие окна осуществляется пользователем при клике на кнопку "Закрыть" или при клике на overlay под окном. Но если требуется закрыть окно программно, то можно воспользоваться следующими методами:

```javascript
$.mw.close(id); // Закрывает окно по его идентификатору
```

```javascript
$.mw.closeAll(); // Закрывает все открытые окна
```

#### Блокирование закрытия окна

Бывают ситуации, когда необходимо заблокировать возможность закрытия окна пользователем. Например, если требуется сделать окно с подтверждением возрастного ограничения. Для этого можно воспользоваться следующими методами:

```javascript
$.mw.disableClose(); // Запретить закрытие окон
```

```javascript
$.mw.enableClose(); // Разрешить закрытие окон
```

#### z-index

По-умолчанию библиотека использует значение `z-index: 3000`. Если требуется изменить это значение, то можно воспользоваться методом:

```javascript
$.mw.startZIndex(value);
```

#### Экземпляр окна

Экземпляр окна можно получить с помощью менеджера окон по его идентификатору:

```javascript
$.mw.get(id, callback);
```

Option | Type | Description
------ | ---- | -----------
id* | string | The identifier of the window. Обязательный параметр.
callback | function | Функция обратного вызова. В качестве первого параметра в функцию будет передан экземпляр окна. В качестве `this` будет установлен контейнер окна `<div class="mw" />`.

Данный метод удобно использовать для окон, содержимое которых загружается динамически посредством ajax. В этом случае можно инкапсулировать скрипты, инициализирующие содержимое окна, в загружаемом файле:

```javascript
$(function () {
    $.mw
        .defaults({
            width: 'auto',
            theme: 'default',
            offset: 50
        })
        .add({
            id: 'window',
            src: '/ajax/window.html',
            width: 600,
            title: 'Пример окна с динамическим содержимым'
        });
    
    $.mw.open('window');
});
```

```html
<!-- /ajax/window.html -->
<p>
    Контент окна
</p>
<button type="button">Закрыть окно</button>

<script type="text/javascript">
    $.mw.get('window', function (mw) {
    	$(this).find('button').on('click', function () {
    		mw.close();
    	});
    });
</script> 
```

### Методы экземпляра окна

Методы окна вызываются на его экземпляре, который может быть получен с помощью менеджера `$.mw.get(id, callback)`:

```javascript
$.mw.get('window', function (mw) {
    mw.title('Заголовок окна');
    mw.load({param1: 'value1'});
});

// or

var mw = $.mw.get('window');
mw.title('Заголовок окна');
```

Method | Argument | Description
------ | ---- | -----------
`content` | value:(jQuery selector &#124; string) | Метод позволяет получить текущее значение параметра `content` (если не передан параметр `value`) или установить новое значение. Если устанавливается новое значение и окно в данный момент открыто, то содержимое окна будет сразу перезагружено.
`src` | value:(jQuery selector &#124; string) | Метод позволяет получить текущее значение параметра `src` (если не передан параметр `value`) или установить новое значение. Если устанавливается новое значение и окно в данный момент открыто, то содержимое окна будет сразу перезагружено.
`title` | value:(jQuery selector &#124; string &#124; boolean) | Метод позволяет получить текущее значение параметра `title` (если не передан параметр `value`) или установить новое значение. Если передано `false`, то заголовок будет скрыт, в противном случае заголовок будет показан.
`closeContent` | value:(jQuery selector &#124; string &#124; boolean) | Метод позволяет получить текущее значение параметра `closeContent` (если не передан параметр `value`) или установить новое значение. Если передано `false`, то кнопка закрытия окна будет скрыта, в противном случае кнопка будет показана.
`open` | data:(string &#124; object)<br />options:object | Метод позволяет открыть окно. Параметры аналогичны методу `$.mw.open()`.
`close` |  | Метод позволяет закрыть окно.
`load` | data:(string &#124; object)<br />options:object | Метод позволяет перезагрузить содержимое окна. Данный метод удобно использовать, если, например, в окне выводится форма и ее необходимо отправить на сервер.
`loading` | value:boolean | Метод позволяет получить текущее значение параметра `loading` (если не передан параметр `value`) или установить новое значение. Если устанавливается новое значение, то `true/false` включает/выключает индикацию загрузки окна.
`opened` |  | Возвращает `true`, если окно в данный момент открыто и `false` в противном случае.
`update` |  | Вызывает принудительный перерасчет размеров и положения окна. Данный метод удобно использовать, если содержимое окна меняется программно, и необходимо обновить положение окна после изменений.
`on` | event:string<br />handler:function | Метод позволяет повесить обработчик на событие окна.
`off` | event:string<br />handler:function | Метод позволяет снять обработчик на событие окна.

### События

Существует несколько способов подписаться на события окна:

```javascript
// подписка во время создания окна
$.mw.add({
    id: 'window',
    src: '/ajax/window.html',
    width: 600,
    open: function (mw) {
    	console.log('Окно открыто!', mw.opened());
    },
    close: function (mw) {
    	console.log('Окно закрыто!', mw.opened());
    }
});

// подписка с помощью методов экземпляра окна
var mw = $.mw.get('window');
mw.on('open', function (mw) {
    console.log('Окно открыто!', mw.opened());
});

// подписка с помощью контейнера окна
$.mw.get('window', function (mw) {
    $(this).off('close').on('close', function () {
    	console.log('Окно закрыто!');
    });
});
```

> В последнем примере перед подпиской на событие вызывается `$(this).off('close')`. Следует помнить, что контейнер окна никогда не уничтожается и если подписка на событие происходит при каждом открытии окна, то обработчики событий будет накапливаться. Поэтому в примере происходит отписка от прослушивания события.

Event | Params | Description
------ | ---- | -----------
opening | mw, data | Функция обратного вызова, которая вызывается перед открытием окна.
open | mw, data | Функция обратного вызова, которая вызывается после открытия окна.
load | mw, data | Функция обратного вызова, которая вызывается после загрузки содержимого окна.
closing | mw | Функция обратного вызова, которая вызывается перед закрытием окна.
close | mw | Функция обратного вызова, которая вызывается после закрытия окна.
update | mw | Функция обратного вызова, которая вызывается после обновления размеров и положения окна.