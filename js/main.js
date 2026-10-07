/* 霓虹裂谷 NEON RIFT — 交互脚本 */

(function () {
  "use strict";

  var sections = Array.prototype.slice.call(document.querySelectorAll(".panel"));
  var pagerItems = Array.prototype.slice.call(document.querySelectorAll("#pagerList li"));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));
  var pager = document.querySelector(".pager");

  /* ---------- 入场动画：低阈值观察，分节再高也能触发 ---------- */
  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-inview");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0 }
  );
  sections.forEach(function (s) { revealObserver.observe(s); });
  sections[0].classList.add("is-inview");

  /* ---------- 页码/导航高亮 + 页码器反色：滚动位置驱动 ---------- */
  var lightIds = ["s01", "s04", "s06"];

  function currentIndex() {
    var idx = 0;
    var mid = window.scrollY + window.innerHeight / 2;
    sections.forEach(function (s, i) {
      if (s.offsetTop <= mid) idx = i;
    });
    return idx;
  }

  function syncActive() {
    var idx = currentIndex();
    var el = sections[idx];
    pagerItems.forEach(function (li, i) {
      li.classList.toggle("is-active", i === idx);
    });
    navLinks.forEach(function (a, i) {
      a.classList.toggle("is-active", i === idx);
    });
    pager.classList.toggle("on-light", lightIds.indexOf(el.id) !== -1);
  }

  var ticking = false;
  window.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      syncActive();
      ticking = false;
    });
  }, { passive: true });
  syncActive();

  /* ---------- 页码器上下箭头 ---------- */
  function go(delta) {
    var next = Math.min(Math.max(currentIndex() + delta, 0), sections.length - 1);
    sections[next].scrollIntoView({ behavior: "smooth" });
  }
  document.getElementById("pagerUp").addEventListener("click", function () { go(-1); });
  document.getElementById("pagerDown").addEventListener("click", function () { go(1); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "PageDown" || (e.key === "ArrowDown" && e.altKey)) { e.preventDefault(); go(1); }
    if (e.key === "PageUp" || (e.key === "ArrowUp" && e.altKey)) { e.preventDefault(); go(-1); }
  });

  /* ---------- 列表项键盘激活（Enter/Space） ---------- */
  function enableKeyboardActivation(container) {
    container.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" && e.key !== " ") return;
      var li = e.target.closest("li");
      if (!li) return;
      e.preventDefault();
      li.click();
    });
  }

  /* ---------- 角色切换 ---------- */
  var CHARS = [
    {
      img: "assets/img/char1.webp",
      faction: "机修同盟 · GEAR UNION",
      name: "琪拉 KIRA",
      desc: "街区机械师，能用一把扳手修好任何东西——包括坏掉的心情。白天修车，夜里修「裂隙」。"
    },
    {
      img: "assets/img/char2.webp",
      faction: "高架巡查队 · OVERPASS WATCH",
      name: "隼人 HAYATO",
      desc: "沉默寡言的巡逻员，负责在黎明前封锁被裂隙侵蚀的路段。据说他的夹克口袋里永远有一枚没送出去的徽章。"
    },
    {
      img: "assets/img/char3.webp",
      faction: "面馆特快 · NOODLE EXPRESS",
      name: "小町 KOMACHI",
      desc: "深夜面馆的外卖员兼情报贩子，狐面之下藏着重金难求的消息网络。送餐必达，风雨无阻。"
    },
    {
      img: "assets/img/char4.webp",
      faction: "旧世残骸 · RELIC SERIES",
      name: "铁卫 T-9",
      desc: "从废铁场里自己爬出来的老式战斗机器人，如今在面馆后厨打工还债。围巾是它唯一的私人物品。"
    }
  ];

  var charImg = document.getElementById("charImg");
  var charName = document.getElementById("charName");
  var charFaction = document.getElementById("charFaction");
  var charDesc = document.getElementById("charDesc");
  var charStrip = document.getElementById("charStrip");
  enableKeyboardActivation(charStrip);

  charStrip.addEventListener("click", function (e) {
    var li = e.target.closest("li");
    if (!li) return;
    var i = Number(li.dataset.idx);
    var c = CHARS[i];
    charStrip.querySelectorAll("li").forEach(function (x) {
      x.classList.toggle("is-active", x === li);
      x.setAttribute("aria-pressed", x === li ? "true" : "false");
    });
    charImg.style.opacity = 0;
    setTimeout(function () {
      charImg.src = c.img;
      charImg.alt = c.name;
      charName.textContent = c.name;
      charFaction.textContent = c.faction;
      charDesc.textContent = c.desc;
      charImg.style.opacity = 1;
    }, 160);
  });
  charImg.style.transition = "opacity .16s ease";

  /* ---------- 影像切换 ---------- */
  var VIDS = [
    { img: "assets/img/thumb-battle.webp", tag: "角色PV", title: "「机修同盟」出击预告 · 10/01/2026" },
    { img: "assets/img/thumb-city.webp", tag: "世界PV", title: "环礁市城市巡礼 · 霓虹不眠 · 09/24/2026" },
    { img: "assets/img/thumb-cafe.webp", tag: "EP", title: "小町的深夜面馆 · 氛围影像 · 09/15/2026" },
    { img: "assets/img/hero.webp", tag: "概念PV", title: "首曝概念影像 · 裂隙之前 · 08/30/2026" }
  ];

  var videoImg = document.getElementById("videoImg");
  var videoTag = document.getElementById("videoTag");
  var videoTitle = document.getElementById("videoTitle");
  var thumbGrid = document.getElementById("thumbGrid");
  enableKeyboardActivation(thumbGrid);

  thumbGrid.addEventListener("click", function (e) {
    var li = e.target.closest("li");
    if (!li) return;
    var v = VIDS[Number(li.dataset.vid)];
    thumbGrid.querySelectorAll("li").forEach(function (x) {
      x.classList.toggle("is-active", x === li);
      x.setAttribute("aria-pressed", x === li ? "true" : "false");
    });
    videoImg.src = v.img;
    videoTag.textContent = v.tag;
    videoTitle.textContent = v.title;
  });

  /* ---------- 新闻切换 ---------- */
  var NEWS = [
    {
      img: "assets/img/thumb-city.webp",
      line: "亲爱的信使，《霓虹裂谷》0.9.2 版本「高架之下」前瞻节目将于 10/12 20:00 开播！",
      head: "10/05/2026　《霓虹裂谷》0.9.2 版本「高架之下」前瞻特别节目预告"
    },
    {
      img: "assets/img/thumb-battle.webp",
      line: "「裂隙巡查」限时委托今日开启，完成巡查即可获得限定涂装与纪念徽章。",
      head: "10/02/2026　「裂隙巡查」限时委托开启公告"
    },
    {
      img: "assets/img/thumb-cafe.webp",
      line: "黄金周登录活动进行中：累计登录 7 天，领取面馆主题涂装「深夜食堂」。",
      head: "09/30/2026　黄金周签到活动开启"
    }
  ];

  var newsImg = document.getElementById("newsImg");
  var newsLine = document.getElementById("newsLine");
  var newsHeadline = document.getElementById("newsHeadline");
  var newsDots = document.getElementById("newsDots");

  newsDots.addEventListener("click", function (e) {
    var btn = e.target.closest("button");
    if (!btn) return;
    var n = NEWS[Number(btn.dataset.news)];
    newsDots.querySelectorAll("button").forEach(function (b) {
      b.classList.toggle("is-active", b === btn);
      b.setAttribute("aria-pressed", b === btn ? "true" : "false");
    });
    newsImg.src = n.img;
    newsLine.textContent = n.line;
    newsHeadline.textContent = n.head;
  });
})();
