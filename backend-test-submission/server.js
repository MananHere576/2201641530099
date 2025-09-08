require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { nanoid } = require('nanoid')

const app = express()
const port = process.env.PORT || 9001
const baseUrl = process.env.BASE_URL || `http://localhost:${port}`

app.use(cors())
app.use(bodyParser.json())

const store = new Map()

function makeExpiry(minutes){
  return Date.now() + (minutes || 30) * 60 * 1000
}

app.post('/shorturls', (req, res)=>{
  const { url, validity, shortcode } = req.body || {}
  if(!url) return res.status(400).json({ error: 'missing url' })
  const code = shortcode && typeof shortcode === 'string' ? shortcode : nanoid(7)
  const life = Number(validity) || 30
  const expiry = makeExpiry(life)
  store.set(code, { url, expiry })
  res.status(201).json({ shortLink: `${baseUrl}/${code}`, expiry: new Date(expiry).toISOString() })
})


app.get('/shorturls/:code', (req, res) => {
  const code = req.params.code
  const entry = store.get(code)
  if (!entry) return res.status(404).json({ error: 'Shortcode not found' })
  if (Date.now() > entry.expiry) {
    store.delete(code)
    return res.status(410).json({ error: 'Link expired' })
  }
  res.json({ url: entry.url, expiry: new Date(entry.expiry).toISOString() })
})


app.get('/:code', (req, res)=>{
  const code = req.params.code
  const entry = store.get(code)
  if(!entry) return res.status(404).send('<h2>Not found</h2>')
  if(Date.now() > entry.expiry){
    store.delete(code)
    return res.status(410).send('<h2>Link expired</h2>')
  }
  let dest = entry.url
  if(!dest.startsWith('http://') && !dest.startsWith('https://')) dest = 'http://' + dest
  res.redirect(dest)
})

app.listen(port, ()=> console.log(`server running at ${baseUrl}`))
