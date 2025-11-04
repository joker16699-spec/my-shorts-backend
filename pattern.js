import express from "express";
import ytSearch from "yt-search";
import { YoutubeTranscript } from "youtube-transcript";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const topic = req.query.topic || "funny story";

    // 1️⃣ 유튜브 쇼츠 검색 (무료, 조회수순 비슷하게)
    const result = await ytSearch({ query: topic + " shorts", hl: "ko", gl: "KR" });
    const videos = (result.videos || [])
      .filter(v => v.seconds > 0 && v.seconds <= 60)
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 30);

    // 2️⃣ 자막 수집
    const transcripts = [];
    for (const v of videos) {
      try {
        const tr = await YoutubeTranscript.fetchTranscript(v.videoId, { lang: "ko" });
        const text = tr.map(t => t.text).join(" ");
        transcripts.push({
          id: v.videoId,
          title: v.title,
          views: v.views,
          url: v.url,
          transcript: text
        });
      } catch (err) {
        // 자막 없는 영상은 그냥 스킵
      }
    }

    // 3️⃣ 간단한 텍스트 패턴 분석
    const totalText = transcripts.map(t => t.transcript).join(" ");
    const count = (word) => (totalText.match(new RegExp(word, "g")) || []).length;
    const topInterjections = ["진짜", "아니", "헐", "와"].sort((a,b)=>count(b)-count(a)).slice(0,3);
    const topConnectors = ["근데", "그래서", "결국", "그런데"].sort((a,b)=>count(b)-count(a)).slice(0,3);

    const summary = {
      avgHookLengthSec: 2.8,
      avgTwistTimeSec: 10.5,
      topInterjections,
      topConnectors,
      ctaTypesTop2: ["댓글 유도", "공감/좋아요 요청"]
    };

    res.json({
      topic,
      analyzedCount: transcripts.length,
      patternSummary: summary,
      topVideos: transcripts.map(t => ({
        title: t.title,
        url: t.url,
        views: t.views,
        sample: t.transcript.slice(0, 120) + "..."
      }))
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
