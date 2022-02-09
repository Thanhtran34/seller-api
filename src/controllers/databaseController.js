// populate database for testing purpose
import fs from 'fs'
import { connectDB } from '../config/mongoose.js'
import { Area } from '../models/area.js'
import { Publisher } from '../models/publisher.js'
import { Ad } from '../models/advertisment.js'

const populateAreas = async () => {
  try {
    await connectDB.connect()
    let data = fs.readFileSync('./data/area.json')
    data = JSON.parse(data)
    let promises = []
    for (let item of data) {
      const arr = Object.values(item)
      const _id = arr[1]
      const name = arr[0]
      const population = parseInt(arr[2].replace(/\s+/, ''))
      const area = new Area({ _id, name, population })
      promises.push(area.save())
    }
    const resolved = await Promise.all(promises)
    console.log(`Saved ${resolved.length} documents`)
  } catch (e) {
    console.error(e)
  }
}

const populatePublishers = async count => {
  try {
    await connectDB.connect()
    const areas = await Area.find()
    let saveCount = 0
    for (let i = 1; i <= count; i++) {
      const name = `Publisher #${i}`
      const email = `publisher${i}@test.com`
      const password = 'Ab@12345'
      const area = areas[Math.floor(Math.random() * areas.length)]._id
      const publisher = new Publisher({ name, email, password, area })
      await publisher.save()
      saveCount++
    }
    console.log(`Saved ${saveCount} new documents`)
  } catch (e) {
    console.error(e)
  }
}

const populateAds = async count => {
  try {
    await connectDB.connect()
    const publishers = await Publisher.find().lean()
    const promises = []
    for (let i = 1; i <= count; i++) {
      const publisher =
        publishers[Math.floor(Math.random() * publishers.length)]
      const daysValid = Math.floor(Math.random() * 30)
      const ad = new Ad({
        publisher: publisher._id,
        area: publisher.area,
        title: `Ad title #${i}`,
        description: `Ads description from ${publisher.name}`,
        body: `Hurry, come and buy low price stuff from ${publisher.name}. Low bargain prices valid only for ${daysValid} days! `,
        validTo: `2022-01-${(1 + daysValid).toLocaleString('sv', {
          minimumIntegerDigits: 2,
        })}`,
        imageUrl: 'https://picsum.photos/id/237/200/300.jpg',
      })
      promises.push(ad.save())
    }
    const saved = await Promise.all(promises)
    console.log(`Saved ${saved.length} new documents`)
  } catch (e) {
    console.error(e)
  }
}

populateAds(10000).then(() => {
  console.log('done')
  process.exit(0)
})