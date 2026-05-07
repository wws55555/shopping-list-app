const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.title = "AI 기술 트렌드 2025";

const slide = pres.addSlide();

// Dark navy background
slide.background = { color: "0F1B35" };

// Top header bar
slide.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 0, w: 10, h: 1.0,
  fill: { color: "1A2D5A" },
  line: { color: "1A2D5A" }
});

// Cyan accent line under header
slide.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 1.0, w: 10, h: 0.04,
  fill: { color: "00D4FF" },
  line: { color: "00D4FF" }
});

// Title
slide.addText("AI 기술 트렌드 2025", {
  x: 0.4, y: 0.07, w: 7.0, h: 0.58,
  fontSize: 30, fontFace: "Arial Black",
  color: "FFFFFF", bold: true,
  margin: 0
});

// Subtitle
slide.addText("인공지능 핵심 동향 요약 | 2025년 5월", {
  x: 0.4, y: 0.66, w: 7.0, h: 0.28,
  fontSize: 11, fontFace: "Calibri",
  color: "93C5FD",
  margin: 0
});

// Date badge
slide.addShape(pres.shapes.RECTANGLE, {
  x: 8.25, y: 0.27, w: 1.55, h: 0.38,
  fill: { color: "00D4FF" },
  line: { color: "00D4FF" }
});
slide.addText("2025 AI Report", {
  x: 8.25, y: 0.27, w: 1.55, h: 0.38,
  fontSize: 10, fontFace: "Calibri",
  color: "0F1B35", bold: true, align: "center", valign: "middle",
  margin: 0
});

// Trend cards data
const cards = [
  {
    num: "01",
    title: "대규모 언어 모델 (LLM)",
    desc: "멀티모달 기능 확장, 긴 컨텍스트 처리, 추론 강화.\nGPT-5, Gemini 2, Claude 4 등 차세대 모델 경쟁 가속화.",
    accent: "00D4FF"
  },
  {
    num: "02",
    title: "AI 에이전트 & 자율화",
    desc: "다단계 작업 자동화, 도구 사용, 웹 탐색 능력 향상.\n자율 소프트웨어 개발 및 업무 자동화 본격화.",
    accent: "A855F7"
  },
  {
    num: "03",
    title: "생성형 AI (멀티미디어)",
    desc: "텍스트→이미지·영상·음악 생성 품질 급등.\nSora, Stable Diffusion 등 창작 도구 대중화 진행 중.",
    accent: "F472B6"
  },
  {
    num: "04",
    title: "엣지 AI & 온디바이스",
    desc: "스마트폰·PC에서 직접 구동되는 소형 고효율 모델 확산.\n프라이버시 보호 및 실시간 처리 가능.",
    accent: "22C55E"
  },
  {
    num: "05",
    title: "AI 안전성 & 거버넌스",
    desc: "EU AI Act 시행, 글로벌 규제 강화.\n안전 정렬 기술 투자 확대 및 책임 있는 AI 표준 형성.",
    accent: "FB923C"
  },
  {
    num: "06",
    title: "RAG & 지식 기반 AI",
    desc: "기업 데이터와 LLM 결합으로 환각 현상 감소.\n실시간 정보 검색 통합 — 엔터프라이즈 AI 핵심 기술.",
    accent: "14B8A6"
  }
];

const cardW = 3.0;
const cardH = 1.88;
const gapX = 0.2;
const gapY = 0.14;
const startX = 0.3;
const startY = 1.12;

const makeShadow = () => ({
  type: "outer", color: "000000", blur: 10, offset: 3, angle: 135, opacity: 0.35
});

cards.forEach((card, i) => {
  const col = i % 3;
  const row = Math.floor(i / 3);
  const x = startX + col * (cardW + gapX);
  const y = startY + row * (cardH + gapY);

  // Card background
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w: cardW, h: cardH,
    fill: { color: "1A2D5A" },
    line: { color: "243B6E", width: 1 },
    shadow: makeShadow()
  });

  // Accent left border
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w: 0.07, h: cardH,
    fill: { color: card.accent },
    line: { color: card.accent }
  });

  // Number badge
  slide.addShape(pres.shapes.RECTANGLE, {
    x: x + 0.12, y: y + 0.1, w: 0.34, h: 0.28,
    fill: { color: card.accent },
    line: { color: card.accent }
  });
  slide.addText(card.num, {
    x: x + 0.12, y: y + 0.1, w: 0.34, h: 0.28,
    fontSize: 9, fontFace: "Arial Black",
    color: "0F1B35", bold: true, align: "center", valign: "middle",
    margin: 0
  });

  // Card title
  slide.addText(card.title, {
    x: x + 0.52, y: y + 0.1, w: cardW - 0.6, h: 0.32,
    fontSize: 11.5, fontFace: "Arial",
    color: card.accent, bold: true,
    margin: 0, valign: "middle"
  });

  // Thin divider
  slide.addShape(pres.shapes.RECTANGLE, {
    x: x + 0.12, y: y + 0.46, w: cardW - 0.22, h: 0.02,
    fill: { color: "243B6E" },
    line: { color: "243B6E" }
  });

  // Description text
  slide.addText(card.desc, {
    x: x + 0.12, y: y + 0.52, w: cardW - 0.22, h: cardH - 0.64,
    fontSize: 9.5, fontFace: "Calibri",
    color: "CBD5E1",
    margin: 0, valign: "top", wrap: true,
    paraSpaceAfter: 3
  });
});

// Footer bar
slide.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 5.45, w: 10, h: 0.175,
  fill: { color: "0A1428" },
  line: { color: "0A1428" }
});
slide.addText("© 2025 AI 트렌드 리포트  |  출처: 업계 공개 보고서 종합  |  Claude AI 분석", {
  x: 0.3, y: 5.45, w: 9.4, h: 0.175,
  fontSize: 8, fontFace: "Calibri",
  color: "4B5563", align: "center", valign: "middle",
  margin: 0
});

pres.writeFile({ fileName: "AI_기술_트렌드_2025.pptx" });
console.log("생성 완료: AI_기술_트렌드_2025.pptx");
