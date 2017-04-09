/* eslint max-nested-callbacks: 0 */
/* eslint no-shadow: 0 */
/* eslint no-inline-comments: 0 */
/* eslint max-len: 0 */
/* eslint camelcase: 0 */

import Vault8 from '../src/vault8'
import url from 'url'

const secondsToStr = time => (
  Math.floor(time / 1000).toString()
)

describe('Vault8', () => {
  let options = { publicKey: 'public', secretKey: 'private', serviceUrl: 'http://lvh.me:3000' }
  let vault8 = new Vault8(options)

  describe('#create', () => {
    it('returns Vault8 instance', () => {
      expect(Vault8.create(options)).toBeInstanceOf(Vault8)
    })

    describe('invalid options', () => {
      describe('publicKey absent', () => {
        let options = { secretKey: 'private', serviceUrl: 'http://lvh.me:3000' }

        it('throws an error', () => {
          expect(() => {
            Vault8.create(options)
          }).toThrow()
        })
      })

      describe('secretKey is absent', () => {
        let options = { publicKey: 'public', serviceUrl: 'http://lvh.me:3000' }

        it('throws an error', () => {
          expect(() => {
            Vault8.create(options)
          }).toThrow()
        })
      })

      describe('serviceUrl absent', () => {
        let options = { publicKey: 'public', secretKey: 'private' }

        it('throws an error', () => {
          expect(() => {
            Vault8.create(options)
          }).toThrow()
        })
      })
    })
  })

  describe('uploadUrl', () => {
    let path = '/upload'
    let currentTime = 1799955192000 // new Date(2027, 0, 14, 21, 33, 12)
    let untilTime = 1799958792000 // new Date(2027, 0, 14, 22, 33, 12)

    it('returns upload url', () => {
      expect(vault8.uploadUrl({path, currentTime, untilTime}))
        .toEqual('http://lvh.me:3000/upload?p=public&s=b92268754db8d4b962f83bb31b22e2a435ca1e94&time=1799955192&until=1799958792')
    })

    describe('default options', () => {
      it('sets /upload as a default path', () => {
        const uploadUri = url.parse(vault8.uploadUrl({currentTime, untilTime}))
        expect(uploadUri.pathname).toEqual('/upload')
      })

      it('sets current time as a default currentTime', () => {
        const uploadUri = url.parse(vault8.uploadUrl({path, untilTime}), true)
        expect(uploadUri.query.time).toEqual(secondsToStr(Date.now()))
      })

      it('sets next day as a default untilTime', () => {
        const uploadUri = url.parse(vault8.uploadUrl({path, currentTime}), true)
        expect(uploadUri.query.until).toEqual(secondsToStr(Date.now() + 86400000))
      })
    })
  })

  describe('generateUrlFor', () => {
    describe('for image uploading', () => {
      let path = '/upload'
      let currentTime = 1799955192000 // new Date(2027, 0, 14, 21, 33, 12)
      let untilTime = 1799958792000 // new Date(2027, 0, 14, 22, 33, 12)

      it('generates url', () => {
        expect(vault8.generateUrlFor({path, currentTime, untilTime}))
          .toEqual('http://lvh.me:3000/upload?p=public&s=b92268754db8d4b962f83bb31b22e2a435ca1e94&time=1799955192&until=1799958792')
      })

      it('allows currentTime to be empty', () => {
        expect(vault8.generateUrlFor({path, untilTime}))
          .toEqual('http://lvh.me:3000/upload?p=public&s=051817cdbdabf24c38f62c02d3d25e08efac7d31&until=1799958792')
      })

      it('allows untilTime to be empty', () => {
        expect(vault8.generateUrlFor({path, currentTime}))
          .toEqual('http://lvh.me:3000/upload?p=public&s=0d9ec06617dbc938409edcf59aec77f73d8070e0&time=1799955192')
      })
    })

    describe('for image getting', () => {
      let path = '/afnanfl12331/image.jpg'

      it('generates url for an arbibrary path', () => {
        expect(vault8.generateUrlFor({path})).toEqual('http://lvh.me:3000/afnanfl12331/image.jpg?p=public&s=8f6dc24cb5d5125be035a9276e49887b32f72955')
      })
    })
  })

  describe('encodeToken', () => {
    let path = '/image_uid/grayscale/name.jpeg'
    let currentTime = 1799955192000 // new Date(2027, 0, 14, 21, 33, 12)
    let untilTime = 1799958792000 // new Date(2027, 0, 14, 22, 33, 12)

    describe('with all args', () => {
      it('returns sha1 hash string', () => {
        expect(vault8.encodeToken({path, currentTime, untilTime}))
          .toEqual('cadcb87ef4d88708f5de366b010b58d5b01574ad')
      })
    })

    describe('without untilTime', () => {
      it('returns sha1 hash string', () => {
        expect(vault8.encodeToken({path, currentTime}))
          .toEqual('36dbd3b870e661fd72e0e18e612e6eb4b51efae2')
      })
    })

    describe('without currentTime', () => {
      it('returns sha1 hash string', () => {
        expect(vault8.encodeToken({path, untilTime}))
          .toEqual('ce72e88293f35d2f4b3ec7b5c357e59d8db8f173')
      })
    })
  })

  describe('imageUrl', () => {
    let uid = '731f70564f9145d79282f8267c4495ee'
    let imageName = 'john.jpg'

    describe('with time values as date objects', () => {
      let filters = []

      it('returns image url', () => {
        let currentTime = new Date(2027, 0, 14, 21, 33, 12)
        let untilTime = new Date(2027, 0, 14, 22, 33, 12)

        expect(vault8.imageUrl({uid, filters, imageName, currentTime, untilTime}))
          .toEqual('http://lvh.me:3000/731f70564f9145d79282f8267c4495ee/john.jpg?p=public&s=3d87dbc06452c086ce554ccec3452af69748cd8f&time=1799955192&until=1799958792')
      })
    })

    describe('with time values as Numeric', () => {
      let filters = []

      it('returns image url', () => {
        let currentTime = 1799955192000 // new Date(2027, 0, 14, 21, 33, 12)
        let untilTime = 1799958792000 // new Date(2027, 0, 14, 22, 33, 12)

        expect(vault8.imageUrl({uid, filters, imageName, currentTime, untilTime}))
          .toEqual('http://lvh.me:3000/731f70564f9145d79282f8267c4495ee/john.jpg?p=public&s=3d87dbc06452c086ce554ccec3452af69748cd8f&time=1799955192&until=1799958792')
      })
    })

    describe('without filters', () => {
      let filters = []

      it('returns image url', () => {
        expect(vault8.imageUrl({uid, filters, imageName}))
          .toEqual('http://lvh.me:3000/731f70564f9145d79282f8267c4495ee/john.jpg?p=public&s=a2d2a0be15bbecde654566e9283f6bc7b8a4890c')
      })
    })

    describe('with grayscale filter', () => {
      let filters = [{grayscale: ''}]

      it('returns image url', () => {
        expect(vault8.imageUrl({uid, filters, imageName}))
          .toEqual('http://lvh.me:3000/731f70564f9145d79282f8267c4495ee/grayscale/john.jpg?p=public&s=57ea985eb5d2bc4c14d6e7b1e533c806ac7841cb')
      })
    })

    describe('with grayscale filter and blur', () => {
      let filters = [{grayscale: '', blur: 1}]

      it('returns image url', () => {
        expect(vault8.imageUrl({uid, filters, imageName}))
          .toEqual('http://lvh.me:3000/731f70564f9145d79282f8267c4495ee/grayscale,blur-1/john.jpg?p=public&s=211f94a1fa78307143ac40a1ac23f442f36f55b8')
      })
    })
  })

  describe('imagePath', () => {
    let uid = '731f70564f9145d79282f8267c4495ee'
    let imageName = 'john.jpg'

    describe('without filters', () => {
      let filters = []

      it('returns image path', () => {
        expect(vault8.imagePath({uid, filters, imageName}))
          .toEqual('/731f70564f9145d79282f8267c4495ee/john.jpg')
      })
    })

    describe('with grayscale filter', () => {
      let filters = [{grayscale: ''}]

      it('returns image path', () => {
        expect(vault8.imagePath({uid, filters, imageName}))
          .toEqual('/731f70564f9145d79282f8267c4495ee/grayscale/john.jpg')
      })
    })

    describe('with grayscale filter and blur', () => {
      let filters = [{grayscale: '', blur: 1}]

      it('returns image path', () => {
        expect(vault8.imagePath({uid, filters, imageName}))
          .toEqual('/731f70564f9145d79282f8267c4495ee/grayscale,blur-1/john.jpg')
      })
    })
  })

  describe('mergedFilters', () => {
    describe('no filters', () => {
      let filters = []
      expect(vault8.mergedFilters(filters)).toBeNull()
    })

    describe('resize_fill', () => {
      let filters = [{resize_fill: [150, 140]}]
      expect(vault8.mergedFilters(filters)).toEqual('resize_fill-150-140')
    })

    describe('grayscale', () => {
      let filters = [{grayscale: ''}]
      expect(vault8.mergedFilters(filters)).toEqual('grayscale')
    })

    describe('grayscale with null', () => {
      let filters = [{grayscale: null}]
      expect(vault8.mergedFilters(filters)).toEqual('grayscale')
    })

    describe('watermark', () => {
      let filters = [{watermark: ['logo20', 'center', 'l']}]
      expect(vault8.mergedFilters(filters)).toEqual('watermark-logo20-center-l')
    })

    describe('grayscale and watermark', () => {
      let filters = [{grayscale: ''}, {watermark: ['logo20', 'center', 'l']}]
      expect(vault8.mergedFilters(filters)).toEqual('grayscale,watermark-logo20-center-l')
    })

    describe('resize_fill and watermark', () => {
      let filters = [{resize_fill: [150, 140]}, {watermark: ['logo20', 'center', 'l']}]
      expect(vault8.mergedFilters(filters)).toEqual('resize_fill-150-140,watermark-logo20-center-l')
    })

    describe('resize_fill and grayscale', () => {
      let filters = [{resize_fill: [150, 140]}, {grayscale: ''}]
      expect(vault8.mergedFilters(filters)).toEqual('resize_fill-150-140,grayscale')
    })

    describe('resize_fill and grayscale and watermark', () => {
      let filters = [
        {resize_fill: [150, 140]},
        {grayscale: ''},
        {watermark: ['logo20', 'center', 'l']}
      ]
      expect(vault8.mergedFilters(filters)).toEqual('resize_fill-150-140,grayscale,watermark-logo20-center-l')
    })

    describe('filters without order', () => {
      let filters = [{
        resize_fill: [150, 140],
        grayscale: '',
        watermark: ['logo20', 'center', 'l']
      }]
      expect(vault8.mergedFilters(filters)).toEqual('resize_fill-150-140,grayscale,watermark-logo20-center-l')
    })

    describe('some filters with and some without order', () => {
      let filters = [{
        resize_fill: [150, 140],
        watermark: ['logo20', 'center', 'l']
      },
      {
        grayscale: ''
      }]

      expect(vault8.mergedFilters(filters)).toEqual('resize_fill-150-140,watermark-logo20-center-l,grayscale')
    })
  })
})
