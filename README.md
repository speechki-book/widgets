# Speechki Speakers Widget

This is a widget which demonstrates Speechki speakers

## Usage

### Default

1. Paste script code somewhere on your page 
```html
<script defer src="https://widget.speechki.org/widget.js"></script>
```

2. Create widget with `Speechki` library
```javascript
const widget = Speechki.widget({
  target: '#widget1',
  customer_id: YOUR_CUSTOMER_ID,
  book_language: DEFAULT_LAGUAGE,
});
```

### ESM
Not available yet


### Options

| Name        | Description | 
| ----------- | ----------- | 
| `target`     | CSS Selector or DOM element which widget will mount to <br> *By default widget takes all the available space inside it's container    | 
| `customer_id`   | Your specific customer id in Speechki         |
| `book_language` | Default language of the book, speakers will be filtered according to language |

### Methods

`on(name, callback)` subscribes to widget event.

Events data:
```javascript
{
  event // name of the event
  data: {
    ... // data passed with the event
}
```

##### Events
| Name        | Description | Data  |
| ----------- | ----------- | ----- |
| `select`    | Triggers when users selects the speaker    |  `name` - speaker name <br> `id` - speaker id <br> `slug` - speaker slug |



`off(name, callback)` unsubscribes from widget event.

`changeLanguage(language)` changes the language filter in widget


## Examples

### Default

```html
...
<head>
  <script defer src="https://widget.speechki.org/widget.js"></script>
</head>
<body>
  ...
    <div id="widget1"></div>
  ...
  <script>
    document.addEventListener('DOMContentLoaded', function () {
      const widget1 = Speechki.widget({ // creates widget
        target: '#widget1',
        customer_id: 3,
        book_language: 'english',
      });
    
      function onSelect(event) {
        alert(event.data.name);
      }
    
      widget1.on('select', onSelect); // subscribe to the event    
      widget1.off('select', onSelect); // unsibscribe from the event
    
      widget1.changeLanguage('spanish') // change language filter to spanish
    });    
  </script>
</body>
```
