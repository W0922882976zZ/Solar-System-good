// 行星資料：距離、週期與簡介使用適合一般觀眾閱讀的近似值。
const planets = {
  mercury: { name: "水星", english: "MERCURY", symbol: "☿", kicker: "最近的行星", distance: "5,790 萬", period: "88", type: "類地行星", description: "離太陽最近、體積最小的行星。白天酷熱、夜晚嚴寒，表面布滿撞擊坑。" },
  venus: { name: "金星", english: "VENUS", symbol: "♀", kicker: "最明亮的行星", distance: "1 億 820 萬", period: "225", type: "類地行星", description: "夜空中格外明亮的行星。濃厚的大氣造成強烈溫室效應，表面是太陽系最熱的行星。" },
  earth: { name: "地球", english: "EARTH", symbol: "⊕", kicker: "我們的家園", distance: "1 億 4,960 萬", period: "365", type: "類地行星", description: "目前已知唯一擁有生命的行星。海洋覆蓋大部分表面，大氣為生命提供保護。" },
  mars: { name: "火星", english: "MARS", symbol: "♂", kicker: "紅色星球", distance: "2 億 2,790 萬", period: "687", type: "類地行星", description: "因表面的氧化鐵而呈現紅色。這裡有太陽系最高的火山，也是人類探索的重要目標。" },
  jupiter: { name: "木星", english: "JUPITER", symbol: "♃", kicker: "行星之王", distance: "7 億 7,850 萬", period: "11.9 年", type: "氣體巨行星", description: "太陽系最大的行星，以壯觀的條紋與持續數百年的巨大紅斑聞名。" },
  saturn: { name: "土星", english: "SATURN", symbol: "♄", kicker: "夢幻光環", distance: "14 億 3,000 萬", period: "29.4 年", type: "氣體巨行星", description: "由冰與岩石碎片組成的光環環繞著土星。它的平均密度比水還低。" },
  uranus: { name: "天王星", english: "URANUS", symbol: "♅", kicker: "側躺的行星", distance: "28 億 7,000 萬", period: "84 年", type: "冰巨行星", description: "自轉軸幾乎橫躺在軌道平面上，因此看起來像是側躺著繞太陽前進。" },
  neptune: { name: "海王星", english: "NEPTUNE", symbol: "♆", kicker: "遙遠的藍色世界", distance: "45 億 0,000 萬", period: "165 年", type: "冰巨行星", description: "太陽系中最遙遠的行星。深藍色大氣中有著極強的風暴與高速強風。" }
};

const solarSystem = document.querySelector("#solarSystem");
const orbitBaseDurations = new Map([...document.querySelectorAll(".orbit")].map((orbit) => [orbit, Number.parseFloat(getComputedStyle(orbit).getPropertyValue("--duration"))]));
const playButton = document.querySelector("#playButton");
const speedRange = document.querySelector("#speedRange");
const info = {
  symbol: document.querySelector("#infoSymbol"), kicker: document.querySelector("#infoKicker"),
  name: document.querySelector("#infoName"), description: document.querySelector("#infoDescription"),
  distance: document.querySelector("#infoDistance"), period: document.querySelector("#infoPeriod"),
  type: document.querySelector("#infoType")
};
let isPaused = false;
let speed = Number(speedRange.value);

// 點選行星或圖例時同步更新介紹卡片與目前選取狀態。
function selectPlanet(key) {
  const planet = planets[key];
  if (!planet) return;
  info.symbol.textContent = planet.symbol;
  info.kicker.innerHTML = `${planet.kicker} <span>${String(Object.keys(planets).indexOf(key) + 1).padStart(2, "0")} / 08</span>`;
  info.name.innerHTML = `${planet.name} <span>${planet.english}</span>`;
  info.description.textContent = planet.description;
  info.distance.innerHTML = `${planet.distance} <small>公里</small>`;
  info.period.innerHTML = `${planet.period} <small>${planet.period.includes("年") ? "" : "地球日"}</small>`;
  info.type.textContent = planet.type;
  document.querySelectorAll(".planet").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.planet === key)));
  document.querySelectorAll(".legend-item").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.select === key)));
}

// 讓所有行星共用速度滑桿，同時保留彼此不同的公轉週期。
function updateSpeed(value) {
  speed = Number(value);
  document.querySelector("#speedValue").textContent = `${speed.toFixed(1)}×`;
  document.querySelectorAll(".orbit").forEach((orbit) => {
    const baseDuration = orbitBaseDurations.get(orbit);
    orbit.style.animationDuration = `${baseDuration / speed}s`;
  });
}

solarSystem.addEventListener("click", (event) => {
  const planetButton = event.target.closest("[data-planet]");
  if (planetButton) selectPlanet(planetButton.dataset.planet);
  if (event.target.closest(".sun")) selectPlanet("earth");
});
document.querySelector(".planet-legend").addEventListener("click", (event) => {
  const legendButton = event.target.closest("[data-select]");
  if (legendButton) selectPlanet(legendButton.dataset.select);
});
playButton.addEventListener("click", () => {
  isPaused = !isPaused;
  document.querySelectorAll(".orbit").forEach((orbit) => { orbit.style.animationPlayState = isPaused ? "paused" : "running"; });
  playButton.setAttribute("aria-label", isPaused ? "繼續公轉動畫" : "暫停公轉動畫");
  document.querySelector(".play-icon").textContent = isPaused ? "▶" : "Ⅱ";
  document.querySelector("#playLabel").textContent = isPaused ? "播放" : "暫停";
});
speedRange.addEventListener("input", (event) => updateSpeed(event.target.value));
document.querySelector("#resetButton").addEventListener("click", () => {
  selectPlanet("mercury");
  speedRange.value = "1";
  updateSpeed(1);
  isPaused = false;
  document.querySelectorAll(".orbit").forEach((orbit) => { orbit.style.animationPlayState = "running"; });
  playButton.setAttribute("aria-label", "暫停公轉動畫");
  document.querySelector(".play-icon").textContent = "Ⅱ";
  document.querySelector("#playLabel").textContent = "暫停";
});
// 頁面載入後以水星作為預設介紹，並初始化軌道速度。
selectPlanet("mercury");
updateSpeed(speed);
