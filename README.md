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
To be continued 


#### Options

| Name        | Description | 
| ----------- | ----------- | 
| `target`     | CSS Selector or DOM element which widget will mount to <br> *By default widget takes all the available space inside it's container    | 
| `customer_id`   | Your specific customer id in Speechki         |
| `book_language` | Default language of the book, speakers will be filtered according to language |

#### Methods

| Name        | Description | 
| ----------- | ----------- | 
| `on`     | Allows you to subscribe to `select` event, which gets triggered when user selects speaker | 
| `changeLanguage`   | Changes languages and triggers speakers reload        |

