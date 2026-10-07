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
  var lightIds = ["s01", "s04", "s07"];

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
    },
    {
      img: "assets/img/char5.webp",
      faction: "霓虹商会 · NEON GUILD",
      name: "白苇 BAIWEI",
      desc: "商会会长的独女与指定继承人，正在下一盘无人能看懂的棋。她开出的每份合同里，都藏着一枚写给未来的楔子。"
    },
    {
      img: "assets/img/char6.webp",
      faction: "裂隙研究所 · RIFT INSTITUTE",
      name: "墨博士 DR. MO",
      desc: "裂隙创伤学唯一的研究者，也是研究所里唯一敢在报告上写真话的人。他的白大褂口袋里装着三份没交上去的辞职信。"
    },
    {
      img: "assets/img/char7.webp",
      faction: "面馆特快 · NOODLE EXPRESS",
      name: "阿炭 TAN",
      desc: "最年轻的注册信使，里城的墙面上全是他的涂鸦标记——看不懂的人以为是艺术，看得懂的人当它是路标。"
    },
    {
      img: "assets/img/char8.webp",
      faction: "深夜电台 · FM23:47",
      name: "夜莺 NIGHTINGALE",
      desc: "只闻其声的黑台 DJ，每晚 23:47 用老歌给迷路的信使指路。商会的追查队搜过三十七次电台大楼，一无所获。"
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

  /* ---------- 剧情章节切换 ---------- */
  var STORY = [
    {
      img: "assets/img/ep0.webp",
      ep: "序章 PROLOGUE",
      title: "坠落的第一晚",
      desc: "2031 年，裂隙初现之夜。高架区在十九分钟内断电失联，巡查队只来得及拉下最后一道路障。当夜之后，环礁市人学会的第一件事是：不要仰头看天空太久。"
    },
    {
      img: "assets/img/ep1.webp",
      ep: "第一章 CHAPTER 1",
      title: "面馆不收现金",
      desc: "深夜面馆的老板娘小町给琪拉派了个奇怪的委托：把一碗还热着的拉面送进里城。报酬不是钱，而是「一个你还没问过的问题的答案」。"
    },
    {
      img: "assets/img/ep2.webp",
      ep: "第二章 CHAPTER 2",
      title: "白名单之夜",
      desc: "霓虹商会宣布全城宵禁，信使一夜之间上了通缉名单。隼人在封锁线前放了琪拉过去——代价是他保管了三年的那枚徽章。"
    },
    {
      img: "assets/img/ep3.webp",
      ep: "第三章 CHAPTER 3",
      title: "收音机里的女声",
      desc: "每晚 23:47，里城的收音机都会收到同一个频率。夜莺用点播的老歌拼出一串坐标，指向旧地铁深处——在那里，裂隙之心第一次跳动。"
    }
  ];

  var storyImg = document.getElementById("storyImg");
  var storyEp = document.getElementById("storyEp");
  var storyTitle = document.getElementById("storyTitle");
  var storyDesc = document.getElementById("storyDesc");
  var storyList = document.getElementById("storyList");
  enableKeyboardActivation(storyList);

  storyList.addEventListener("click", function (e) {
    var li = e.target.closest("li");
    if (!li) return;
    var s = STORY[Number(li.dataset.ep)];
    storyList.querySelectorAll("li").forEach(function (x) {
      x.classList.toggle("is-active", x === li);
      x.setAttribute("aria-pressed", x === li ? "true" : "false");
    });
    storyImg.src = s.img;
    storyEp.textContent = s.ep;
    storyTitle.textContent = s.title;
    storyDesc.textContent = s.desc;
  });

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
