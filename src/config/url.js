// set up url
export let BASE_URL

if (process.env.NODE_ENV !== 'production') {
  BASE_URL = 'http://localhost:8080'
} else {
  BASE_URL = ''
}