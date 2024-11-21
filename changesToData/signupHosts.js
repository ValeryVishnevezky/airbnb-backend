import { authService } from '../api/auth/auth.service.js'
import { loggerService } from '../services/logger.service.js'

const hosts = [
    {
      fullname: "Olivia Davis",
      location: "Tokyo, Japan",
      about: "Enjoys hiking and outdoor adventures.",
      responseTime: "within a day",
      isSuperhost: true,
      pictureUrl: "https://img.freepik.com/free-photo/vertical-shot-pretty-female-with-pink-silk-dress-sitting-outdoor-cafe_181624-30906.jpg?uid=R108235284&ga=GA1.1.1545684031.1710792691&semt=ais_hybrid"
    },
    {
      fullname: "Amelia Thompson",
      location: "Berlin, Germany",
      about: "Passionate about exploring new places.",
      responseTime: "within an hour",
      isSuperhost: true,
      pictureUrl: "https://img.freepik.com/free-photo/cute-woman-brushing-hair_23-2147767635.jpg?t=st=1732052176~exp=1732055776~hmac=186dc74af3600d81ce09006d4f439efe21e2fadbb2dd693f04703a4a108b2e66&w=740"
    },
    {
      fullname: "Laura Allen",
      location: "Berlin, Germany",
      about: "Enjoys hiking and outdoor adventures.",
      responseTime: "within a day",
      isSuperhost: true,
      pictureUrl: "https://img.freepik.com/free-photo/portrait-young-woman_23-2148574874.jpg?t=st=1732052222~exp=1732055822~hmac=f5d030a251fa3b3b57744a3e024cae60b1c81683257f986fc90d406d69eee1ed&w=900"
    },
    {
      fullname: "James Brown",
      location: "Sydney, Australia",
      about: "Passionate about exploring new places.",
      responseTime: "within an hour",
      isSuperhost: false,
      pictureUrl: "https://img.freepik.com/free-photo/portrait-handsome-smiling-stylish-hipster-lambersexual-modelmodern-man-dressed-blue-shirt-fashion-male-posing-street-background-near-skyscrapers-sunglasses_158538-21218.jpg?uid=R108235284&ga=GA1.1.1545684031.1710792691"
    },
    {
      fullname: "Ava Martinez",
      location: "Sydney, Australia",
      about: "Loves photography and discovering hidden gems.",
      responseTime: "within an hour",
      isSuperhost: true,
      pictureUrl: "https://img.freepik.com/free-photo/smiling-attractive-woman-looking-camera-surrounded-green-leaves-successful-coffee-shop-owner-female-entrepreneur-confident-her-cafe-outdoor-area-lady-standing-outdoors-enjoying-summer-sun_197531-30525.jpg?t=st=1732052988~exp=1732056588~hmac=8c78540d329e80513914e403e75fe7a4c1fed0aec8a5fd2857de6044b0c215df&w=740"
    },
    {
      fullname: "Benjamin Lee",
      location: "New York, USA",
      about: "Passionate about history and culture.",
      responseTime: "within an hour",
      isSuperhost: false,
      pictureUrl: "https://img.freepik.com/free-photo/front-view-man-with-dog-jetty_23-2150558036.jpg?t=st=1732052604~exp=1732056204~hmac=fe3cccca9de7f75f4b16178621cc2031d800061d2c7a1e7205fcbe6ef6c85415&w=740"
    },
    {
      fullname: "Gloria Graham",
      location: "New York, USA",
      about: "Loves photography and discovering hidden gems.",
      responseTime: "within a day",
      isSuperhost: true,
      pictureUrl: "https://img.freepik.com/free-photo/young-woman-cozy-wear-outdoors_624325-539.jpg?uid=R108235284&ga=GA1.1.1545684031.1710792691"
    },
    {
      fullname: "Lily Taylor",
      location: "Berlin, Germany",
      about: "Enjoys hiking and outdoor adventures.",
      responseTime: "within a day",
      isSuperhost: false,
      pictureUrl: "https://img.freepik.com/free-photo/portrait-young-woman-white-shirt_1303-24912.jpg?uid=R108235284&ga=GA1.1.1545684031.1710792691"
    },
    {
      fullname: "Matthew King",
      location: "New York, USA",
      about: "Loves photography and discovering hidden gems.",
      responseTime: "within a day",
      isSuperhost: false,
      pictureUrl: "https://img.freepik.com/free-photo/young-sports-man-bicycle-european-city-sports-urban-environments_72229-323.jpg?uid=R108235284&ga=GA1.1.1545684031.1710792691"
    },
    {
      fullname: "William Carter",
      location: "Paris, France",
      about: "Loves photography and discovering hidden gems.",
      responseTime: "within a day",
      isSuperhost: true,
      pictureUrl: "https://img.freepik.com/free-photo/handsome-confident-stylish-hipster-lambersexual-model_158538-18017.jpg?uid=R108235284&ga=GA1.1.1545684031.1710792691"
    },
    {
      fullname: "Ruben Jones",
      location: "Paris, France",
      about: "Passionate about exploring new places.",
      responseTime: "within an hour",
      isSuperhost: false,
      pictureUrl: "https://img.freepik.com/free-photo/middle-aged-man-wearing-leaning-against-rusty-colored-background_150588-73.jpg?uid=R108235284&ga=GA1.1.1545684031.1710792691"
    },
    {
      fullname: "Ethan White",
      location: "Rome, Italy",
      about: "History lover and avid traveler.",
      responseTime: "within 2 hours",
      isSuperhost: true,
      pictureUrl: "https://img.freepik.com/free-photo/guy-white-shirt-smiles_23-2148401388.jpg?uid=R108235284&ga=GA1.1.1545684031.1710792691"
    },
    {
      fullname: "Charlotte Evans",
      location: "Sydney, Australia",
      about: "Avid traveler and nature lover.",
      responseTime: "within an hour",
      isSuperhost: true,
      pictureUrl: "https://img.freepik.com/free-photo/front-view-alluring-older-business-woman-posing_23-2148661221.jpg?uid=R108235284&ga=GA1.1.1545684031.1710792691&semt=ais_hybrid"
    },
    {
      fullname: "Lucas Williams",
      location: "Toronto, Canada",
      about: "Always on the lookout for my next adventure.",
      responseTime: "within an hour",
      isSuperhost: true,
      pictureUrl: "https://img.freepik.com/free-photo/smiling-young-businessman-holding-takeaway-coffee-cup-hand_23-2148176167.jpg?t=st=1732053396~exp=1732056996~hmac=d2bda398c8dd9a4448cf3899fc3c550cef555a803478721cf4d112db0fdf1015&w=740"
    },
    {
      fullname: "Mia Robinson",
      location: "Paris, France",
      about: "Loves food and culture.",
      responseTime: "within 2 hours",
      isSuperhost: false,
      pictureUrl: "https://img.freepik.com/free-photo/pretty-fairskinned-adult-woman-with-long-blond-hair-looks-piercingly-into-camera-while-standing-street-leisure-lifestyle-beauty-concept_197531-31192.jpg?uid=R108235284&ga=GA1.1.1545684031.1710792691"
    },
    {
      fullname: "Steven Ortiz",
      location: "Berlin, Germany",
      about: "Passionate about history and culture.",
      responseTime: "within an hour",
      isSuperhost: true,
      pictureUrl: "https://img.freepik.com/free-photo/portrait-young-man-street_641386-463.jpg?t=st=1732052841~exp=1732056441~hmac=95b74bbe44244038e20584e2ec0dd5a8c873d3d0b456433ef616aa48e4d454ec&w=740"
    },
    {
      fullname: "Sophia Brown",
      location: "Tokyo, Japan",
      about: "Love to travel and meet interesting people!",
      responseTime: "within 2 hours",
      isSuperhost: false,
      pictureUrl: "https://img.freepik.com/free-photo/portrait-young-woman-blue-denim-jacket-listening-music-earphone-through-mobile-phone_23-2148148191.jpg?t=st=1732053341~exp=1732056941~hmac=905d994e317d752feea2e5f658bda82a6a3df861cf786a476cca0a127cb2835b&w=740"
    },
    {
      fullname: "Michael Bennett",
      location: "Berlin, Germany",
      about: "Loves photography and discovering hidden gems.",
      responseTime: "within a day",
      isSuperhost: true,
      pictureUrl: "https://img.freepik.com/free-photo/close-up-young-businessman_23-2149153813.jpg?uid=R108235284&ga=GA1.1.1545684031.1710792691"
    }
  ]

  export async function signupForHosts() {
    try {
        for (const host of hosts) {
            const username = host.fullname.replace(/\s+/g, '').toLowerCase()
            const password = 'defaultPassword123'
            const account = await authService.signup(username, password, host.fullname)
            loggerService.debug(`auth.route - new account created for host: ${host.fullname}`)
            console.log('account.', account)
        }

        console.log('All hosts have been signed up successfully. No login performed.', account)
    } catch (err) {
        loggerService.error('Failed to signup hosts: ' + err)
        throw new Error('Failed to signup hosts')
    }
}

signupForHosts()
  .then(() => {
    console.log('All hosts have been signed up successfully.')
  })
  .catch((err) => {
    console.error('Error during host signup:', err)
  })