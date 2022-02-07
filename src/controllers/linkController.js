// create links 
import { BASE_URL } from '../config/url.js'

export class LinkController {
  createLinkForPublisher(publisher) {
    const self = BASE_URL + '/publishers/' + publisher._id
    const ads = self + '/ads'
    const area = BASE_URL + '/areas/' + (publisher.area._id || publisher.area)
    return {
      self,
      ads,
      area,
    }
  }

  createLinkForAd(ad) {
    const self = BASE_URL + '/ads/' + ad._id
    const publisher =
      BASE_URL + '/publishers/' + (ad.publisher._id || ad.publisher)
    const area = BASE_URL + '/areas/' + (ad.area._id || ad.area)
    return {
      self,
      publisher,
      area,
    }
  }

  createLinkForArea(area) {
    const self = BASE_URL + '/areas/' + area._id
    const publishers = self + '/publishers'
    const ads = self + '/ads'
    return {
      self,
      publishers,
      ads,
    }
  }

  createLinkForHook(hook) {
    const self = BASE_URL + '/hooks/' + hook._id
    const publisher = BASE_URL + '/publishers/' + hook.publisher
    return {
      self,
      publisher,
    }
  }
}