# Vault8

Node.js client for Vault8 service for easy integration


## Installation

```sh
npm install vault8
```

## Usage

```js
import Vault8 from 'vault8'

const publicKey = '<vault8.io public key>'
const secretKey = '<vault8.io secret key>'
const serviceUrl = 'http://example.com'

const vault8 = Vault8.create({publicKey, secretKey, serviceUrl})
// or const vault8 = new Vault8({publicKey, secretKey, serviceUrl})

const currentTime = Date.now()
const untilTime = Date.now() + 86400000 // tomorrow

vault8.uploadUrl({currentTime, untilTime}) // 'http://example.com/upload?p=%3Cvault8.io%20public%20key%3E&s=b6bfe0d2963e82692a5b0c5714d61246816145a6&time=1491749965&until=1491836379'

const uid = '731f70564f9145d79282f8267c4495ee'
const imageName = 'john.jpg'

vault8.imageUrl({uid, imageName, currentTime, untilTime}) // 'http://example.com/731f70564f9145d79282f8267c4495ee/john.jpg?p=%3Cvault8.io%20public%20key%3E&s=3b09cc1f3c411bbbc5a437e0879d08bcce4090f8&time=1491749965&until=1491836379'

```

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/dra1n/vault8-node. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](http://contributor-covenant.org) code of conduct.


## License

The gem is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).

