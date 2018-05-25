# Rejoiner2 Node.js client wrapper

## Install

````bash
yarn add rejoiner2
````

or

````bash
npm install rejoiner2 --save
````

## Use

````js
var Rejoiner2 = require('rejoiner2')

var apiClient = new Rejoiner2({
  // Your seven character Rejoiner2 Site ID
  siteId: 'eXaMpLe',
  // Your account's 40 character API key
  apiKey: 'tHiSaPiKeYiSjUsTaNeXaMpLeAnDyOuCaNtUsEiT',
})
````

## Ping

The `ping` endpoint can be used to verify your credentials are working.

````js
apiClient.verify.ping()
  .then(...)
  .catch(...)
````

## Customer Endpoints

### Convert Customer

````js
apiClient.customer.convert({
  email: 'test@example.com',
  cart_data: {
    cart_value: 10000,
    cart_item_count: 1,
    promo: 'COUPON_CODE',
    return_url: 'https://www.example.com/return_url',
    ...
  },
  cart_items: {
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
})
  .then(...)
  .catch(...)
````

### Journey Cancellation

````js
apiClient.customer.cancel('test@example.com')
  .then(...)
  .catch(...)
````

### Customer Unsubscribe

````js
apiClient.customer.unsubscribe('test@example.com')
  .then(...)
  .catch(...)
````

### Record Explicit Customer Consent

````js
apiClient.customer.optIn('test@example.com')
  .then(...)
  .catch(...)
````

## Email List Endpoints

### Email Lists

````js
apiClient.lists.get()
  .then(...)
  .catch(...)
````

### Retrieving Listing of Contacts

````js
apiClient.lists.contacts('eXaMpLeLiStId').get()
  .then(...)
  .catch(...)
````

### Add Customer to List

````js
apiClient.lists.contacts('eXaMpLeLiStId').add('test@example.com')
  .then(...)
  .catch(...)
````

### Remove Customer From List

````js
apiClient.lists.contacts('eXaMpLeLiStId').remove('test@example.com')
  .then(...)
  .catch(...)
````
