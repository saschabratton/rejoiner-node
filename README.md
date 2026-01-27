# Rejoiner Node.js Client

A Node.js client for the [Rejoiner](https://rejoiner.com) email marketing and cart abandonment platform API.

## Install

```bash
npm install rejoiner --save
```

## Configuration

```js
const Rejoiner = require('rejoiner')

const client = new Rejoiner({
  siteId: 'yourSiteId',
  apiKey: 'yourApiKey',

  // Optional
  apiVersion: 2,              // API version: 1 (default) or 2
  webhookSecret: 'secret',    // For webhook verification
})
```

### Environment Variables

Configuration can also be set via environment variables:

- `REJOINER_SITE_ID` - Your site ID
- `REJOINER_API_KEY` - Your API key
- `REJOINER_WEBHOOK_SECRET` - Webhook secret for verification (optional)

```js
// With env vars set, you can instantiate without options
const client = new Rejoiner()
```

## Verify Credentials

```js
client.verify.ping()
```

## Webhooks

Verify incoming webhook signatures:

```js
const signatureHeader = req.headers['x-rejoiner-signature']
const payload = req.rawBody // Raw request body as string

const isValid = client.verifyWebhook(signatureHeader, payload)
```

Requires `webhookSecret` to be configured.

## Customer Endpoints

### Get Customer

```js
// By email (API v1 and v2)
client.customer.get('test@example.com')
client.customer.getByEmail('test@example.com')

// By phone (API v2 only)
client.customer.getByPhone('+15551234567')
client.customer.get('+15551234567', 'by_phone')
```

### Update Customer

```js
client.customer.update({
  email: 'test@example.com',
  first_name: 'Test',
  last_name: 'User',
  // ... other customer fields
})
```

### Convert Customer

```js
client.customer.convert({
  email: 'test@example.com',
  cart_data: {
    cart_value: 20000,
    cart_item_count: 2,
    promo: 'COUPON_CODE',
    return_url: 'https://www.example.com/cart',
  },
  cart_items: [
    {
      product_id: 'SKU123',
      name: 'Example Product',
      price: 10000,
      item_qty: 2,
      qty_price: 20000,
      product_url: 'https://www.example.com/products/example',
      image_url: 'https://www.example.com/images/example.jpg',
    },
  ],
})

// Force conversion even if customer already converted
client.customer.convert(data, true)
```

### Cancel Journey

```js
client.customer.cancel('test@example.com')
```

### Unsubscribe Customer

```js
client.customer.unsubscribe('test@example.com')
```

### Record Opt-In Consent

```js
client.customer.optIn('test@example.com')
```

## Customer Tags (API v2 only)

Manage customer tags for segmentation and journey triggers.

```js
// Get tags
client.customer.tags.get('test@example.com')

// Replace all tags
client.customer.tags.set('test@example.com', ['vip', 'newsletter'])

// Add tags
client.customer.tags.add('test@example.com', ['new-tag'])

// Remove tags
client.customer.tags.remove('test@example.com', ['old-tag'])
```

The `set`, `add`, and `remove` methods accept an optional third parameter `startJourney` (default: `true`). Set to `false` to prevent triggering journeys:

```js
client.customer.tags.add('test@example.com', ['tag'], false)
```

## Preference Tags

Manage customer preference tags for email preferences.

```js
// Get preference tags
client.customer.preferenceTags.get('test@example.com')

// Replace all preference tags
client.customer.preferenceTags.set('test@example.com', ['weekly-digest'])

// Add preference tags
client.customer.preferenceTags.add('test@example.com', ['promotions'])

// Remove preference tags
client.customer.preferenceTags.remove('test@example.com', ['promotions'])
```

## Email Lists

### Get All Lists

```js
client.lists.get()
```

### Create a List

```js
client.lists.add('My New List')

// Or with additional options
client.lists.add({ name: 'My New List' })
```

### List Contacts

```js
// Get contacts in a list
client.lists.contacts('listId').get()

// With pagination
client.lists.contacts('listId').get(2) // page 2

// Add contact to list
client.lists.contacts('listId').add('test@example.com')

// Remove contact from list
client.lists.contacts('listId').remove('test@example.com')
```

## Journeys

Trigger webhook event waits in journeys.

```js
client.journeys('journeyId').nodes('nodeId').webhook('test@example.com')

// With additional data
client.journeys('journeyId').nodes('nodeId').webhook({
  email: 'test@example.com',
  customer_data: { /* ... */ },
  session_data: { /* ... */ },
})
```

## Segments

### Get Customers in Segment

```js
client.segments.customers('segmentId').get()
```

## Sessions

Update session data after conversion.

```js
client.sessions.update('sessionId', {
  paymentDate: new Date(),
  fulfillmentDate: new Date(),
  deliveryDate: new Date(),
  metadata: {
    tracking_number: '1Z999AA10123456784',
  },
})
```

All date fields are optional and accept `Date` objects or date strings.

## API Versions

Some features require API v2:

| Feature | API v1 | API v2 |
|---------|--------|--------|
| `customer.getByPhone()` | - | Yes |
| `customer.tags.*` | - | Yes |

Set the API version when creating the client:

```js
const client = new Rejoiner({
  siteId: 'yourSiteId',
  apiKey: 'yourApiKey',
  apiVersion: 2,
})
```
