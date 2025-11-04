<<<<<<< HEAD
import express from "express";
import cors from "cors";
import patternRouter from "./pattern.js";
import generateRouter from "./generate.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from my-shorts-backend!");
});

app.use("/pattern", patternRouter);
app.use("/generate", generateRouter);

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
=======
import express from 'express'
import cors from 'cors'
import yts from 'yt-search'
import { YoutubeTranscript } from 'youtube-transcript'

const app = express()
app.use(cors())

// 검색: ?q=키워드&max=50 (<=60초 영상만, 조회수 내림차순 Top30)
app.get('/search', async (req, res) => {
  try {
    const q = req.query.q || ''
    const max = Math.min(parseInt(req.query.max || '50', 10), 50)
    const r = await yts.search(q)
    const vids = r.videos
      .filter(v => (v.seconds || 0) <= 60)
      .sort((a,b) => (b.views||0)-(a.views||0))
      .slice(0, 30)
      .map(v => ({ id: v.videoId, title: v.title, views: v.views, seconds: v.seconds, url: v.url }))
    res.json({ ok: true, items: vids })
  } catch (e) {
    res.status(200).json({ ok:false, error: String(e) })
  }
})

// 자막: ?id=VIDEO_ID (ko 우선, 없으면 en 폴백)
app.get('/transcript', async (req, res) => {
  try {
    const id = req.query.id
    if (!id) return res.status(400).json({ ok:false, error: 'id required' })
    let items = await YoutubeTranscript.fetchTranscript(id, { lang: 'ko' })
    if (!items || !items.length) items = await YoutubeTranscript.fetchTranscript(id, { lang: 'en' })
    const transcript = (items||[]).map(x=>x.text).join(' ').replace(/\s+/g,' ').trim()
    res.json({ ok:true, id, transcript })
  } catch (e) {
    res.status(200).json({ ok:false, id: req.query.id, transcript: "", error: String(e) })
  }
})

// OpenAPI 문서 제공(선택적)
app.get('/openapi-search.json', (req, res) => {
  res.json({
    openapi: "3.0.0",
    info: { title: "Free Shorts Search API", version: "1.0.0" },
    paths: {
      "/search": {
        get: {
          summary: "Search YouTube Shorts (<=60s) and return top 30 by views",
          parameters: [
            { name: "q", in: "query", required: true, schema: { type: "string" } },
            { name: "max", in: "query", required: false, schema: { type: "integer", default: 50 } }
          ],
          responses: { "200": { description: "OK" } }
        }
      }
    }
  })
})

app.get('/openapi-transcript.json', (req, res) => {
  res.json({
    openapi: "3.0.0",
    info: { title: "Free Transcript API", version: "1.0.0" },
    paths: {
      "/transcript": {
        get: {
          summary: "Return transcript text for a video id (ko->en fallback)",
          parameters: [{ name: "id", in: "query", required: true, schema: { type: "string" } }],
          responses: { "200": { description: "OK" } }
        }
      }
    }
  })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, ()=> console.log('Server on http://localhost:'+PORT))
>>>>>>> f236d36 (fix: package.json and axios install)
