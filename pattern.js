import express from "express";
import axios from "axios";

const router = express.Router();
// TODO: 실제 키 넣기 (env 권장)
const API_KEY = "YOUR_YOUTUBE_API_KEY";

router.get("/", async (req, res) => {
  try {
    const topic = req.query.topic || "funny story";
    const searchUrl =
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=30&q=${encodeURIComponent(topic)}&videoDuration=short&key=${API_KEY}`;
    const { data } = await axios.get(searchUrl);

    // 샘플: 제목/설명만 회수 (실사용 시 자막 수집 로직 연결)
    const items = (data.items || []).map(v => ({
      id: v.id?.videoId,
      title: v.snippet?.title,
      description: v.snippet?.description,
    }));

    // 패턴 요약(초기 가정치; 자막 분석 붙으면 실제값으로 대체)
    const summary = {
      avgHookLengthSec: 2.8,
      avgTwistTimeSec: 10.4,
      topInterjections: ["아니", "진짜", "와"],
      topConnectors: ["근데", "그래서", "결국"],
      // ✅ “다음편 예고” 제거
      ctaTypesTop2: ["댓글 유도", "공감/좋아요 요청"]
    };

    res.json({
      topic,
      analyzedCount: items.length,
      patternSummary: summary,
      sample: items.slice(0, 5)
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
