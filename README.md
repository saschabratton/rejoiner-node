# Rejoiner Node.js client wrapper

## Install

````bash
yarn add rejoiner
````

or

````bash
npm install rejoiner --save
````

## Use

````js
var Rejoiner = require('rejoiner')

var client = new Rejoiner({
  // Your Site ID
  siteId: 'eXaMpLe',
  // Your API key
  apiKey: 'tHiSaPiKeYiSjUsTaNeXaMpLeAnDyOuCaNtUsEiT',
})
````

## Ping

The `ping` endpoint can be used to verify your credentials are working.

````js
client.verify.ping()
  .then(...)
  .catch(...)
````

## Customer Endpoints

### Convert Customer

````js
client.customer.convert({
  email: 'test@example.com',
  cart_data: {
    cart_value: 20000,
    cart_item_count: 2,
    promo: 'COUPON_CODE',
    return_url: 'https://www.example.com/return_url',
    ...
  },
  cart_items: [
    {
      product_id: 'example',
      name: 'Example Product',
      price: 10000,
      description: 'Information about Example Product.',
      category: [
        'Example Category 1',
        'Example Category 2',
      ],
      item_qty: 1,
      qty_price: 10000,
      product_url: 'https://www.example.com/products/example',
      image_url: 'https://www.example.com/products/example/images/example.jpg',
      ...
    },
    {
      product_id: 'example2',
      name: 'Example Product 2',
      price: 10000,
      description: 'Information about Example Product 2.',
      category: [
        'Example Category 2',
        'Example Category 3',
      ],
      item_qty: 1,
      qty_price: 10000,
      product_url: 'https://www.example.com/products/example2',
      image_url: 'https://www.example.com/products/example2/images/example.jpg',
      ...
    },
    ...
  ],
})
  .then(...)
  .catch(...)
````

### Journey Cancellation

````js
client.customer.cancel('test@example.com')
  .then(...)
  .catch(...)
````

### Customer Unsubscribe

````js
client.customer.unsubscribe('test@example.com')
  .then(...)
  .catch(...)
````

### Record Explicit Customer Consent

````js
client.customer.optIn('test@example.com')
  .then(...)
  .catch(...)
````

## Email List Endpoints

### Email Lists

````js
client.lists.get()
  .then(...)
  .catch(...)
````

### Retrieving Listing of Contacts

````js
client.lists.contacts('eXaMpLeLiStId').get()
  .then(...)
  .catch(...)
````

#### With optional page number for pagination

````js
client.lists.contacts('eXaMpLeLiStId').get(2)
  .then(...)
  .catch(...)
````

### Add Customer to List

````js
client.lists.contacts('eXaMpLeLiStId').add('test@example.com')
  .then(...)
  .catch(...)
````

### Remove Customer From List

````js
client.lists.contacts('eXaMpLeLiStId').remove('test@example.com')
  .then(...)
  .catch(...)
````
