import express from "express";
const router = express.Router();

/** 간단 포맷터: 20~30초 분량 가이드라인에 맞춘 문장 수 */
function clampScriptLines(txt) {
  return txt
    .split("\n")
    .map(s => s.trim())
    .filter(Boolean)
    .join("\n");
}

router.post("/", async (req, res) => {
  const topic = (req.body?.topic || "웃긴 썰").trim();
  const pattern = req.body?.pattern || {
    avgHookLengthSec: 3,
    avgTwistTimeSec: 10
  };

  // A안: 질문형 후킹, 감탄사 절제 / 자유 반전(7~10초 권장)
  const scriptA = clampScriptLines(`
🎬 후킹(0–3초): ${topic} 있잖아, 너라면 어떻게 했을 것 같아?
🕒 본론-1(3–8초): 처음엔 별거 아닌 줄 알고 그냥 넘겼거든.
🕒 본론-2(8–13초): 근데 분위기가 미묘하게 이상해지기 시작한 거야.
(선택) 🕒 본론-3(13–18초): 나만 그런가 싶어서 계속 눈치만 봤지.
⚡ 반전/한줄결론(18–23초): 알고 보니 내가 완전 반대로 이해하고 있었더라… 그날 다들 웃음 터짐.
🏁 CTA(마무리 2–3초): 너도 비슷한 경험 있어? 댓글로 살짝만 알려줘.
[${topic}, 눈치게임, 민망, 반전, 현웃]
  `);

  // B안: 감탄사형 후킹, 반전 시점 10–12초 고정
  const scriptB = clampScriptLines(`
🎬 후킹(0–3초): 와… ${topic} 이건 진짜 레전드였다ㅋㅋ
🕒 본론-1(3–8초): 시작은 평범했는데, 내 한 마디가 불쏘시개였음.
🕒 본론-2(8–10초): 갑자기 다들 조용해지고, 나만 신나 있던 거야.
(선택) 🕒 본론-3(10–12초): 그때 깨달음. 타이밍이 완전 반대로 맞았던 거지.
⚡ 반전/한줄결론(12–23초): 결국 내가 잘난 척한 포인트가 실제로는 내 흑역사 포인트… 모두 빵 터짐.
🏁 CTA(마무리 2–3초): 공감되면 좋아요 한 번만! 너 썰도 댓글로 풀어줘.
[${topic}, 타이밍, 흑역사, 빵터짐, 공감]
  `);

  res.json({
    topic,
    patternUsed: pattern,
    scripts: [
      { version: "A안", content: scriptA },
      { version: "B안", content: scriptB }
    ]
  });
});

export default router;

