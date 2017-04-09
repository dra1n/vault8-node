import url, { URL } from 'url'
import crypto from 'crypto'
import { required, seconds, reverse, isEmpty, flatten, compact } from './utils'

class Vault8 {
  static create(options) {
    return new Vault8(options)
  }


  constructor({publicKey, secretKey, serviceUrl}) {
    this.publicKey = required('publicKey', publicKey)
    this.secretKey = required('secretKey', secretKey)
    this.serviceUrl = required('serviceUrl', serviceUrl)
  }


  uploadUrl({path = '/upload', currentTime = Date.now(), untilTime = Date.now() + 86400000}) {
    return this.generateUrlFor({
      path,
      currentTime: currentTime,
      untilTime: untilTime
    })
  }


  generateUrlFor({path, currentTime, untilTime}) {
    const uri = new URL(
      url.resolve(encodeURI(this.serviceUrl), encodeURI(path))
    )

    uri.searchParams.set('p', this.publicKey)
    uri.searchParams.set('s', this.encodeToken({path, currentTime, untilTime}))

    if (currentTime) {
      uri.searchParams.set('time', seconds(currentTime))
    }

    if (untilTime) {
      uri.searchParams.set('until', seconds(untilTime))
    }

    return uri.toString()
  }


  encodeToken({path, currentTime, untilTime}) {
    const tokenStr = compact([
      this.publicKey,
      this.secretKey,
      path,
      seconds(currentTime),
      seconds(untilTime)
    ]).join('|')

    const shasum = crypto.createHash('sha1').update(tokenStr)

    return reverse(shasum.digest('hex'))
  }


  imageUrl({uid, filters = [], imageName = 'image.jpg', currentTime, untilTime}) {
    return this.generateUrlFor({
      currentTime,
      untilTime,
      path: this.imagePath({uid, filters, imageName})
    })
  }


  imagePath({uid, filters = [], imageName = 'image.jpg'}) {
    return '/' + compact([uid, this.mergedFilters(filters), imageName]).join('/')
  }


  mergedFilters(filters) {
    if (isEmpty(filters)) {
      return null
    }

    return flatten(filters
      .map(filter => (
        Object.keys(filter).map(filterName => {
          const filterValue = filter[filterName]
          const filterTuple = [filterName, isEmpty(filterValue) ? null : filterValue]

          return compact(flatten(filterTuple)).join('-')
        })
      )))
      .join(',')
  }
}

export default Vault8
