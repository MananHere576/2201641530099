require('dotenv').config()
const fetch = require('node-fetch')

async function main() {
  const body = {
    email: process.env.EMAIL,
    name: process.env.NAME,
    rollNo: process.env.ROLLNO,
    accessCode: process.env.ACCESS_CODE,
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  }
  try {
    const res = await fetch('http://20.244.56.144/eva1uation-service/auth', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body)
    })
    const data = await res.json()
    console.log(data)
    if (data['access_token']) {
      console.log('\nPaste this into your .env as LOG_TOKEN=...')
    }
  } catch (e) {
    console.error('Error fetching token:', e.message)
  }
}
main()
