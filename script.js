/* =========================================================
   TAREL — script.js  (premium interactions)
   ========================================================= */
(function () {
  "use strict";

  var WHATSAPP_NUMBER = "447553132674";   // +44 7553 132674
  var SALES_EMAIL = "sales@tarel.co.uk";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---- year ---- */
  var yr = $("#year"); if (yr) yr.textContent = new Date().getFullYear();

  /* ---- sticky nav shadow ---- */
  var nav = $("#nav");
  function navScroll() { if (nav) nav.classList.toggle("scrolled", window.scrollY > 10); }
  window.addEventListener("scroll", navScroll, { passive: true }); navScroll();

  /* ---- mobile menu ---- */
  var burger = $("#burger"), navLinks = $("#navLinks");
  function closeMenu() {
    navLinks.classList.remove("open"); burger.classList.remove("open");
    burger.setAttribute("aria-expanded", "false"); document.body.style.overflow = "";
  }
  if (burger) {
    burger.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      burger.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });
    $$("a", navLinks).forEach(function (a) { a.addEventListener("click", closeMenu); });
  }

  /* ---- active nav + bottom nav spy ---- */
  var spyIds = ["home","about","journey","products","business","vendor","contact"];
  var navMap = {}, botMap = {};
  $$("#navLinks a").forEach(function (a) { var h = a.getAttribute("href"); if (h && h[0] === "#") navMap[h.slice(1)] = a; });
  $$(".botnav a").forEach(function (a) { var h = a.getAttribute("href"); if (h && h[0] === "#") botMap[h.slice(1)] = a; });
  spyIds.forEach(function (id) {
    var s = document.getElementById(id); if (!s) return;
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          $$("#navLinks a").forEach(function (a) { a.classList.remove("active"); });
          if (navMap[id]) navMap[id].classList.add("active");
          $$(".botnav a").forEach(function (a) { a.classList.remove("active"); });
          if (botMap[id]) botMap[id].classList.add("active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" }).observe(s);
  });

  /* ---- reveal on scroll ---- */
  var revealer = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); revealer.unobserve(e.target); } });
  }, { threshold: 0.12 });
  function observeReveals(root) { $$(".reveal", root).forEach(function (el) { revealer.observe(el); }); }
  observeReveals(document);

  /* ---- count-up ---- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-target")) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduce) { el.textContent = target + suffix; return; }
    var start = null, dur = 1400;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
      if (p < 1) requestAnimationFrame(step); else el.textContent = target + suffix;
    }
    requestAnimationFrame(step);
  }
  var countObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { animateCount(e.target); countObs.unobserve(e.target); } });
  }, { threshold: 0.6 });
  $$(".count").forEach(function (el) { countObs.observe(el); });

  /* ---- parallax (subtle) ---- */
  var parallaxEls = $$("[data-parallax]");
  if (parallaxEls.length && !reduce) {
    var ticking = false;
    function onScrollP() {
      if (ticking) return; ticking = true;
      requestAnimationFrame(function () {
        var vh = window.innerHeight;
        parallaxEls.forEach(function (el) {
          var r = el.getBoundingClientRect();
          if (r.bottom < 0 || r.top > vh) return;
          var progress = (r.top + r.height / 2 - vh / 2) / vh; // -0.5..0.5
          el.style.transform = "translate3d(0," + (progress * -26).toFixed(1) + "px,0)";
        });
        ticking = false;
      });
    }
    window.addEventListener("scroll", onScrollP, { passive: true }); onScrollP();
  }

  /* ---- helpers ---- */
  function val(id) { var el = document.getElementById(id); return el ? el.value.trim() : ""; }
  function line(label, v) { return label + ": " + (v || "-") + "\n"; }
  function waLink(msg) { return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(msg); }
  function openWa(msg) { window.open(waLink(msg), "_blank", "noopener"); }

  /* ---- fresh catch products (with order buttons) ---- */
  var catchItems = [
    { name: "Blue Swimmer Crab", img: "crab",   opts: ["Whole", "Cleaned"],          fresh: true,  limited: false, avail: "In stock" },
    { name: "Tiger Prawns",      img: "prawn",  opts: ["Whole", "Deveined"],         fresh: true,  limited: true,  avail: "Limited" },
    { name: "Squid",             img: "squid",  opts: ["Whole", "Rings", "Cleaned"], fresh: true,  limited: false, avail: "In stock" },
    { name: "King Fish",         img: "mackerel", opts: ["Whole", "Steak", "Fillet"],fresh: true,  limited: false, avail: "In stock" },
    { name: "Bonito / Tuna",     img: "bonito", opts: ["Whole", "Steak"],            fresh: true,  limited: true,  avail: "Limited" },
    { name: "Sardine",           img: "sardine",opts: ["Whole", "Cleaned"],          fresh: true,  limited: false, avail: "In stock" }
  ];
  var meatItems = [
    { name: "Goat Curry Cut",  img: "goat",       opts: ["Bone-in", "Boneless"] },
    { name: "Goat Head",       img: "goat-head",  opts: ["Cleaned"] },
    { name: "Fresh Liver",     img: "liver",      opts: ["Sliced", "Whole"] },
    { name: "Mixed Meat Cuts", img: "mixed-meat", opts: ["Chicken", "Lamb", "Mixed"] }
  ];

  function catchCard(p) {
    var badges = "";
    if (p.fresh) badges += '<span class="pcard__badge pcard__badge--fresh"><i class="ic ic-check"></i> Fresh</span>';
    if (badges) {
      badges = '<div class="pcard__badges">' + badges + '</div>';
    }
    var opts = p.opts.map(function (o) { return '<span class="pcard__opt">' + o + "</span>"; }).join("");
    var msg = "Hello Tarel,\nI'd like to order:\n\n" + p.name + "\n\n(Please advise price & availability.)\nDelivery: next Wednesday\nThank you.";
    var el = document.createElement("article");
    el.className = "pcard";
    el.innerHTML =
      '<div class="pcard__imgwrap">' + badges +
        '<img src="assets/products/' + p.img + '.jpg" alt="' + p.name + '" loading="lazy" />' +
        '<span class="pcard__shadow"></span>' +
      '</div>' +
      '<div class="pcard__body">' +
        '<div class="pcard__name">' + p.name + "</div>" +
        '<div class="pcard__opts">' + opts + "</div>" +
        '<div class="pcard__foot">' +
          '<span class="pcard__avail">' + (p.avail || "In stock") + "</span>" +
          '<button class="pcard__order" type="button"><i class="ic ic-whatsapp"></i> Order</button>' +
        "</div>" +
      "</div>";
    el.querySelector(".pcard__order").addEventListener("click", function () { openWa(msg); });
    return el;
  }
  function meatCard(p) {
    var opts = p.opts.map(function (o) { return '<span class="pcard__opt">' + o + "</span>"; }).join("");
    var msg = "Hello Tarel,\nI'd like to order:\n\n" + p.name + "\n\n(Please advise price & availability.)\nDelivery: next Wednesday\nThank you.";
    var el = document.createElement("article");
    el.className = "pcard";
    el.innerHTML =
      '<div class="pcard__imgwrap">' +
        '<img src="assets/products/' + p.img + '.jpg" alt="' + p.name + '" loading="lazy" />' +
        '<span class="pcard__shadow"></span>' +
      '</div>' +
      '<div class="pcard__body">' +
        '<div class="pcard__name">' + p.name + "</div>" +
        '<div class="pcard__opts">' + opts + "</div>" +
        '<div class="pcard__foot">' +
          '<span class="pcard__avail">In stock</span>' +
          '<button class="pcard__order" type="button"><i class="ic ic-whatsapp"></i> Order</button>' +
        "</div>" +
      "</div>";
    el.querySelector(".pcard__order").addEventListener("click", function () { openWa(msg); });
    return el;
  }
  var catchTrack = $("#catchTrack");
  if (catchTrack) catchItems.forEach(function (p) { catchTrack.appendChild(catchCard(p)); });
  var meatGrid = $("#meatGrid");
  if (meatGrid) meatItems.forEach(function (p) { meatGrid.appendChild(meatCard(p)); });

  /* ---- carousels (dots + nav + swipe already native) ---- */
  $$("[data-carousel]").forEach(function (car) {
    var track = $(".carousel__track", car);
    var prev = $("[data-carousel-prev]", car);
    var next = $("[data-carousel-next]", car);
    if (!track) return;
    function step() { var first = track.children[0]; if (!first) return 260; return first.getBoundingClientRect().width + 16; }
    if (prev) prev.addEventListener("click", function () { track.scrollBy({ left: -step(), behavior: "smooth" }); });
    if (next) next.addEventListener("click", function () { track.scrollBy({ left: step(), behavior: "smooth" }); });

    // dots (only for tracks with an associated dots container)
    var dotsId = car.parentNode.querySelector ? null : null;
    var dotsWrap = car.nextElementSibling && car.nextElementSibling.classList.contains("carousel__dots") ? car.nextElementSibling : null;
    if (dotsWrap) {
      var n = track.children.length;
      for (var i = 0; i < n; i++) {
        (function (idx) {
          var b = document.createElement("button");
          b.setAttribute("aria-label", "Go to item " + (idx + 1));
          if (idx === 0) b.classList.add("active");
          b.addEventListener("click", function () { track.scrollTo({ left: idx * step(), behavior: "smooth" }); });
          dotsWrap.appendChild(b);
        })(i);
      }
      var dots = $$("button", dotsWrap);
      track.addEventListener("scroll", function () {
        var idx = Math.round(track.scrollLeft / step());
        dots.forEach(function (d, di) { d.classList.toggle("active", di === idx); });
      }, { passive: true });
    }
  });

  /* ---- postcode checker + interactive map ---- */
  var regions = {
    "Central Belt (Glasgow & Edinburgh)": { day: "Wednesday", cities: "Glasgow, Edinburgh, Livingston", min: "£25", fee: "Free over £40", prefixes: ["EH","G","FK","ML","KA","PA","KY"] },
    "Aberdeen & North East":              { day: "Wednesday", cities: "Aberdeen, Peterhead, Elgin",     min: "£35", fee: "£4.99",         prefixes: ["AB","IV30","IV31","IV32"] },
    "Fife & Tayside":                     { day: "Wednesday", cities: "Dundee, St Andrews, Perth",       min: "£30", fee: "£3.99",         prefixes: ["DD","PH","KY1","KY2"] },
    "Highlands & Islands":                { day: "Wednesday", cities: "Inverness, Fort William",         min: "£45", fee: "From £6.99",    prefixes: ["IV","PH1","PH2","PH3"] },
    "Scottish Borders & South":           { day: "Wednesday", cities: "Galashiels, Dumfries, Ayr",       min: "£30", fee: "£4.99",         prefixes: ["TD","DG","KA6","KA7"] }
  };
  function matchRegion(pcRaw) {
    var pc = (pcRaw || "").toUpperCase().replace(/\s+/g, "");
    if (!pc) return null;
    var best = null, bestLen = 0;
    Object.keys(regions).forEach(function (name) {
      regions[name].prefixes.forEach(function (pfx) {
        if (pc.indexOf(pfx) === 0 && pfx.length > bestLen) { best = name; bestLen = pfx.length; }
      });
    });
    return best;
  }
  var pcResult = $("#pcResult");
  function showResult(name, pcRaw) {
    if (!pcResult) return;
    if (name) {
      var r = regions[name];
      pcResult.className = "coverage__result ok";
      pcResult.innerHTML = '<span class="rtitle"><i class="ic ic-check"></i> Yes — we deliver to you!</span>' +
        '<span class="rsub">' + name + ' · Next delivery <strong>' + r.day + '</strong> · Min order ' + r.min + ' · Delivery ' + r.fee + "</span>";
      highlightMapByRegion(name);
    } else {
      pcResult.className = "coverage__result no";
      pcResult.innerHTML = '<span class="rtitle">Enter a Scottish postcode area</span>' +
        '<span class="rsub">Try EH, G, AB, DD, IV, PH, TD or DG. Not sure? Message us on WhatsApp and we\'ll confirm.</span>';
    }
  }
  var pcCheck = $("#pcCheck"), pcInput = $("#postcode");
  function runCheck() { showResult(matchRegion(pcInput.value), pcInput.value); }
  if (pcCheck) pcCheck.addEventListener("click", runCheck);
  if (pcInput) pcInput.addEventListener("keydown", function (e) { if (e.key === "Enter") runCheck(); });

  // region list
  var regionList = $("#regionList");
  if (regionList) {
    Object.keys(regions).forEach(function (name) {
      var r = regions[name];
      var li = document.createElement("li");
      li.innerHTML = "<strong>" + name + "</strong><span>" + r.day + "</span>";
      regionList.appendChild(li);
    });
  }
  // interactive map
  var mapPaths = $$(".scotmap__regions path");
  function highlightMapByRegion(name) {
    mapPaths.forEach(function (p) { p.classList.toggle("active", p.getAttribute("data-region") === name); });
  }
  mapPaths.forEach(function (p) {
    p.addEventListener("click", function () {
      var name = p.getAttribute("data-region");
      // normalise &amp; entity
      Object.keys(regions).forEach(function (rn) { if (rn.replace(/&/g, "&amp;") === name || rn === name) name = rn; });
      mapPaths.forEach(function (x) { x.classList.remove("active"); });
      p.classList.add("active");
      var r = regions[name];
      if (r && pcResult) {
        pcResult.className = "coverage__result ok";
        pcResult.innerHTML = '<span class="rtitle"><i class="ic ic-pin"></i> ' + name + "</span>" +
          '<span class="rsub">Delivery <strong>' + r.day + "</strong> · " + r.cities + " · Min " + r.min + " · " + r.fee + "</span>";
      }
    });
  });

  /* ---- countdown timers ---- */
  function nextDow(target, hour) { // target: 0=Sun..6=Sat
    var now = new Date();
    var d = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, 0, 0, 0);
    var add = (target - d.getDay() + 7) % 7;
    d.setDate(d.getDate() + add);
    if (d.getTime() <= now.getTime()) d.setDate(d.getDate() + 7);
    return d;
  }
  function paint(el, ms) {
    if (!el) return;
    if (ms < 0) ms = 0;
    var s = Math.floor(ms / 1000);
    var d = Math.floor(s / 86400); s -= d * 86400;
    var h = Math.floor(s / 3600); s -= h * 3600;
    var m = Math.floor(s / 60); s -= m * 60;
    var q = function (sel, v) { var t = el.querySelector(sel); if (t) t.textContent = v < 10 ? "0" + v : "" + v; };
    q("[data-d]", d); q("[data-h]", h); q("[data-m]", m); q("[data-s]", s);
  }
  var cdOrder = $("#cdOrder"), cdDeliver = $("#cdDeliver");
  if (cdOrder || cdDeliver) {
    var tick = function () {
      var now = Date.now();
      paint(cdOrder, nextDow(5, 17).getTime() - now);    // Friday 17:00 cut-off
      paint(cdDeliver, nextDow(3, 8).getTime() - now);   // Wednesday 08:00 delivery
    };
    tick(); setInterval(tick, 1000);
  }

  /* ---- gallery + lightbox ---- */
  var galleryImgs = [
    { src: "assets/seafood-platter.jpg", alt: "Fresh seafood platter" },
    { src: "assets/products/prawn.jpg", alt: "Tiger prawns" },
    { src: "assets/harbour.jpg", alt: "Fishing harbour" },
    { src: "assets/products/crab.jpg", alt: "Blue swimmer crab" },
    { src: "assets/facility-inspect.jpg", alt: "Quality inspection" },
    { src: "assets/products/mackerel.jpg", alt: "King fish" },
    { src: "assets/van.jpg", alt: "Delivery van" },
    { src: "assets/products/squid.jpg", alt: "Fresh squid" },
    { src: "assets/about.jpg", alt: "Seafood on ice" },
    { src: "assets/products/goat.jpg", alt: "Goat curry cut" }
  ];
  // some assets may not exist as separate files (seafood-platter); fall back gracefully
  var galleryGrid = $("#galleryGrid");
  if (galleryGrid) {
    galleryImgs.forEach(function (g) {
      var img = new Image();
      img.src = g.src; img.alt = g.alt; img.loading = "lazy";
      img.addEventListener("error", function () { img.remove(); });
      img.addEventListener("click", function () { openLightbox(g.src, g.alt); });
      galleryGrid.appendChild(img);
    });
  }
  var lb = $("#lightbox"), lbImg = $("#lbImg"), lbClose = $("#lbClose");
  function openLightbox(src, alt) { if (!lb) return; lbImg.src = src; lbImg.alt = alt || ""; lb.hidden = false; document.body.style.overflow = "hidden"; }
  function closeLightbox() { if (!lb) return; lb.hidden = true; lbImg.src = ""; document.body.style.overflow = ""; }
  if (lbClose) lbClose.addEventListener("click", closeLightbox);
  if (lb) lb.addEventListener("click", function (e) { if (e.target === lb) closeLightbox(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeLightbox(); });

  /* ---- premium recipe modal logic ---- */
  var recipes = {
    "Squid Fry": {
      img: "assets/products/squid.jpg",
      title: "Squid Fry",
      difficulty: "Easy",
      prep: "15 mins",
      cook: "10 mins",
      serves: "4",
      spice: "Medium Spice",
      about: "Crispy and flavourful South Indian squid fry made with fresh squid, aromatic spices, curry leaves and a light masala coating. Perfect as a starter or a side dish with rice.",
      ingredients: {
        "Main Ingredients": [
          "500g Fresh Squid (cleaned and sliced into rings)",
          "2 tbsp Ginger Garlic Paste",
          "1 tbsp Lemon Juice",
          "1 tsp Turmeric Powder",
          "1½ tsp Kashmiri Chilli Powder",
          "1 tsp Red Chilli Powder",
          "1 tsp Coriander Powder",
          "½ tsp Black Pepper Powder",
          "½ tsp Garam Masala",
          "Salt to taste"
        ],
        "Tempering & Aromatics": [
          "2 tbsp Coconut Oil",
          "1 tsp Mustard Seeds",
          "2 Sprigs Curry Leaves",
          "2 Green Chillies (slit)",
          "1 Medium Onion (thinly sliced)"
        ]
      },
      garnish: ["Fresh Curry Leaves", "Lemon Wedges", "Coriander Leaves", "Sliced Red Onion"],
      instructions: [
        "Wash the squid thoroughly and pat dry using kitchen paper.",
        "Cut into medium-sized rings.",
        "Marinate with Ginger Garlic Paste, Turmeric, Chilli Powder, Coriander Powder, Pepper, Garam Masala, Lemon Juice, and Salt. Mix well. Rest for 20–30 minutes.",
        "Heat coconut oil in a frying pan. Add Mustard Seeds, Curry Leaves, and Green Chillies. Allow them to splutter.",
        "Add sliced onions. Cook until lightly golden.",
        "Add the marinated squid. Cook over medium-high heat for about 8–10 minutes. Do not overcook, otherwise the squid becomes rubbery.",
        "Increase the flame for the last 2–3 minutes. Allow the masala to coat the squid and become slightly crispy.",
        "Serve hot with lemon wedges."
      ],
      tips: [
        "Fresh squid cooks quickly. Do not cook for more than 10–12 minutes.",
        "Coconut oil gives authentic South Indian flavour.",
        "Curry leaves make a huge difference.",
        "For extra crispiness, sprinkle 1 tbsp rice flour before frying."
      ],
      servedWith: ["Steamed Rice", "Lemon Rice", "Coconut Rice", "Rasam", "Fish Curry", "Mint Chutney"],
      nutrition: {
        Calories: "265 kcal",
        Protein: "28 g",
        Carbs: "6 g",
        Fat: "14 g"
      },
      buyItems: ["Fresh Squid", "Onion", "Curry Leaves", "Green Chillies", "Lemon", "Ginger Garlic Paste", "Coconut Oil"],
      targetProduct: "Squid"
    },
    "King Fish Curry": {
      img: "assets/products/mackerel.jpg",
      title: "King Fish Curry",
      difficulty: "Medium",
      prep: "15 mins",
      cook: "30 mins",
      serves: "4",
      spice: "Medium Spice",
      about: "A traditional South Indian king fish curry simmered in a rich coconut and tamarind gravy with aromatic spices. Perfect with steamed rice or appam.",
      ingredients: {
        "Main Ingredients": [
          "700g Fresh King Fish Steaks",
          "2 tbsp Coconut Oil",
          "1 Onion (finely chopped)",
          "2 Tomatoes (chopped)",
          "1 tbsp Ginger Garlic Paste",
          "2 Green Chillies",
          "Curry Leaves",
          "1 tsp Mustard Seeds"
        ],
        "Spices & Sauces": [
          "1 tsp Turmeric Powder",
          "2 tsp Chilli Powder",
          "1 tbsp Coriander Powder",
          "½ tsp Fenugreek Powder",
          "½ cup Coconut Milk",
          "Tamarind Extract",
          "Salt",
          "Fresh Coriander"
        ]
      },
      garnish: ["Fresh Coriander", "Curry Leaves"],
      instructions: [
        "Heat coconut oil in a pan.",
        "Add mustard seeds and curry leaves. Let them splutter.",
        "Add onions and fry until golden brown.",
        "Add ginger garlic paste and sauté until raw smell disappears.",
        "Add tomatoes and cook until soft and mushy.",
        "Add all spice powders and sauté for a minute.",
        "Pour in the tamarind extract and bring to a simmer.",
        "Carefully slide in the King Fish pieces. Simmer for 12 minutes on low-medium heat.",
        "Pour in the coconut milk and cook for another 3 minutes.",
        "Garnish with fresh coriander and serve."
      ],
      tips: [
        "Never overcook King Fish, or it will turn dry.",
        "Rest the curry for 15 minutes before serving so flavors settle.",
        "Fish curry tastes even better the next day!"
      ],
      servedWith: ["Steamed Rice", "Appam", "Idiyappam", "Dosa"],
      nutrition: {
        Calories: "360 kcal",
        Protein: "36 g",
        Carbs: "12 g",
        Fat: "18 g"
      },
      buyItems: ["Fresh King Fish", "Coconut Oil", "Onion", "Tomatoes", "Ginger Garlic Paste", "Green Chillies", "Curry Leaves"],
      targetProduct: "King Fish"
    },
    "Goat Biryani": {
      img: "assets/products/goat.jpg",
      title: "Goat Biryani",
      difficulty: "Advanced",
      prep: "30 mins",
      cook: "90 mins",
      serves: "5",
      spice: "Very Spicy",
      about: "Classic South Indian dum-style goat biryani layered with fragrant basmati rice and slow-cooked tender goat meat.",
      ingredients: {
        "Meat & Marinade": [
          "750g Curry Cut Goat Meat",
          "Yogurt (for marinade)",
          "Lemon Juice",
          "Ginger Garlic Paste",
          "Turmeric, Chilli Powder, Salt"
        ],
        "Biryani & Rice": [
          "500g Basmati Rice",
          "3 Onions (thinly sliced)",
          "3 Tomatoes (chopped)",
          "Mint & Coriander Leaves",
          "Green Chillies",
          "Ghee & Coconut Oil",
          "Whole Biryani Spices"
        ]
      },
      garnish: ["Fried Onions", "Fresh Mint", "Fresh Coriander"],
      instructions: [
        "Marinate the goat meat with yogurt, ginger garlic paste, lemon juice, turmeric, chilli powder, and salt for at least 2 hours.",
        "Fry sliced onions in ghee and oil until deep brown. Remove half for garnish.",
        "Add whole spices, green chillies, and ginger garlic paste. Cook for 2 minutes.",
        "Add tomatoes and cook until oil separates. Add marinated goat meat.",
        "Sauté meat, add water, and pressure cook until tender (approx. 30-40 mins).",
        "Wash and soak basmati rice. Boil in salted water with whole spices until 70% cooked.",
        "Layer the tender goat masala and the parboiled rice in a heavy-bottomed pot.",
        "Sprinkle mint, coriander, and fried onions between layers.",
        "Seal the lid and cook on low heat (dum) for 25 minutes. Rest for 10 minutes before opening.",
        "Mix gently and serve hot."
      ],
      tips: [
        "Always use premium aged basmati rice for best length and aroma.",
        "Dum cooking over a heavy pan (tawa) prevents burning at the bottom."
      ],
      servedWith: ["Onion Raita", "Brinjal Curry", "Boiled Egg", "Pickle"],
      nutrition: {
        Calories: "620 kcal",
        Protein: "38 g",
        Carbs: "54 g",
        Fat: "28 g"
      },
      buyItems: ["Goat Curry Cut", "Basmati Rice", "Onions", "Tomatoes", "Ginger Garlic Paste", "Yogurt", "Ghee"],
      targetProduct: "Goat Curry Cut"
    },
    "Tiger Prawn Masala": {
      img: "assets/products/prawn.jpg",
      title: "Tiger Prawn Masala",
      difficulty: "Easy",
      prep: "15 mins",
      cook: "20 mins",
      serves: "4",
      spice: "Medium Spice",
      about: "Juicy tiger prawns cooked in a rich onion-tomato masala infused with curry leaves and coastal South Indian spices.",
      ingredients: {
        "Main Ingredients": [
          "500g Tiger Prawns (cleaned and deveined)",
          "½ tsp Turmeric Powder",
          "Salt to taste",
          "1 tbsp Lemon Juice"
        ],
        "Masala Gravy": [
          "2 tbsp Coconut Oil",
          "2 Onions (finely chopped)",
          "2 Tomatoes (pureed)",
          "1 tbsp Ginger Garlic Paste",
          "Curry Leaves & Green Chillies",
          "Chilli Powder, Coriander Powder, Garam Masala"
        ]
      },
      garnish: ["Fresh Coriander", "Lemon Slices"],
      instructions: [
        "Clean prawns and marinate with turmeric, salt, and lemon juice for 15 minutes.",
        "Heat coconut oil in a pan. Sauté onions and curry leaves until golden brown.",
        "Add ginger garlic paste and green chillies. Sauté for a minute.",
        "Add pureed tomatoes and cook until oil separates.",
        "Add chilli powder, coriander powder, and garam masala. Cook for 2 minutes.",
        "Add marinated tiger prawns. Cook on medium-high heat for about 5 minutes.",
        "Do not overcook the prawns, otherwise they turn rubbery.",
        "Garnish with coriander leaves and serve warm."
      ],
      tips: [
        "Clean and devein the prawns properly to ensure optimal flavor.",
        "Fresh curry leaves are a must-have for the signature coastal taste."
      ],
      servedWith: ["Ghee Rice", "Steamed Rice", "Chapati", "Naan"],
      nutrition: {
        Calories: "290 kcal",
        Protein: "31 g",
        Carbs: "8 g",
        Fat: "13 g"
      },
      buyItems: ["Tiger Prawns", "Onions", "Tomatoes", "Ginger Garlic Paste", "Curry Leaves", "Coconut Oil"],
      targetProduct: "Tiger Prawns"
    },
    "Crab Curry": {
      img: "assets/products/crab.jpg",
      title: "Crab Curry",
      difficulty: "Medium",
      prep: "20 mins",
      cook: "30 mins",
      serves: "4",
      spice: "Very Spicy",
      about: "Fresh crab cooked in a rich, traditional coastal-style coconut masala packed with authentic South Indian flavours.",
      ingredients: {
        "Main Ingredients": [
          "2 Fresh Crabs (cleaned and cut into halves)",
          "2 tbsp Coconut Oil",
          "1 Large Onion (finely chopped)",
          "2 Tomatoes (chopped)",
          "1 tbsp Ginger Garlic Paste",
          "Curry Leaves & Green Chillies"
        ],
        "Coconut Masala & Gravy": [
          "1 tsp Turmeric Powder",
          "2 tsp Chilli Powder",
          "1 tbsp Coriander Powder",
          "1 tsp Black Pepper Powder",
          "½ cup Thick Coconut Milk",
          "Small lemon-sized Tamarind (juiced)",
          "Salt to taste"
        ]
      },
      garnish: ["Fresh Coriander", "Slit Green Chillies"],
      instructions: [
        "Clean the crabs thoroughly under running water, cracking the claws slightly.",
        "Heat coconut oil in a deep pan. Sauté mustard seeds, curry leaves, and green chillies.",
        "Add chopped onions and fry until golden brown.",
        "Add ginger garlic paste and sauté for 1-2 minutes.",
        "Add tomatoes and cook until mushy.",
        "Stir in all the spice powders, tamarind juice, and salt. Sauté well.",
        "Add the crabs and toss in the masala. Add 1 cup of water, cover, and simmer for 20 minutes.",
        "Pour in the thick coconut milk, stir gently, and cook on low heat for 5 minutes.",
        "Garnish with coriander leaves and serve."
      ],
      tips: [
        "Slightly crack the crab claws before cooking so the masala penetrates inside.",
        "Fresh live crab gives the sweetest, most premium flavor.",
        "Allow the curry to rest for 30 minutes before eating to absorb all the spices."
      ],
      servedWith: ["Steamed Rice", "Appam", "Idiyappam", "Dosa"],
      nutrition: {
        Calories: "340 kcal",
        Protein: "33 g",
        Carbs: "11 g",
        Fat: "16 g"
      },
      buyItems: ["Blue Swimmer Crab", "Coconut Oil", "Onion", "Tomatoes", "Ginger Garlic Paste", "Curry Leaves", "Coconut Milk"],
      targetProduct: "Blue Swimmer Crab"
    }
  };

  var recipeModal = $("#recipeModal");
  var recipeModalContent = $("#recipeModalContent");
  var recipeModalClose = $("#recipeModalClose");
  var recipeModalOverlay = $("#recipeModalOverlay");

  function openRecipeModal(recipeName) {
    var data = recipes[recipeName];
    if (!data || !recipeModal || !recipeModalContent) return;

    var ingHTML = "";
    Object.keys(data.ingredients).forEach(function (sec) {
      ingHTML += '<div class="recipe-modal__ingcol"><h6>' + sec + '</h6><ul>';
      data.ingredients[sec].forEach(function (ing) {
        ingHTML += '<li>' + ing + '</li>';
      });
      ingHTML += '</ul></div>';
    });

    var stepsHTML = '<ul class="recipe-modal__steps">';
    data.instructions.forEach(function (step, i) {
      stepsHTML += '<li class="recipe-modal__step">' +
        '<span class="recipe-modal__step-num">' + (i + 1) + '</span>' +
        '<p>' + step + '</p>' +
        '</li>';
    });
    stepsHTML += '</ul>';

    var tipsHTML = '<ul class="recipe-modal__tips">';
    data.tips.forEach(function (tip) {
      tipsHTML += '<li>' + tip + '</li>';
    });
    tipsHTML += '</ul>';

    var servedHTML = '<ul class="recipe-modal__list-inline">';
    data.servedWith.forEach(function (sw) {
      servedHTML += '<li>' + sw + '</li>';
    });
    servedHTML += '</ul>';

    var buyHTML = '<div class="recipe-modal__buy-items">';
    data.buyItems.forEach(function (item) {
      buyHTML += '<span class="recipe-modal__buy-item">' + item + '</span>';
    });
    buyHTML += '</div>';

    recipeModalContent.innerHTML =
      '<div class="recipe-modal__imgwrap">' +
        '<img src="' + data.img + '" alt="' + data.title + '" />' +
      '</div>' +
      '<div class="recipe-modal__body">' +
        '<h3 class="recipe-modal__title">' + data.title + '</h3>' +
        '<div class="recipe-modal__meta">' +
          '<span class="recipe-modal__pill"><i class="ic ic-star"></i> 4.9</span>' +
          '<span class="recipe-modal__pill">' + data.difficulty + '</span>' +
          '<span class="recipe-modal__pill"><i class="ic ic-clock"></i> ' + (data.prep || data.cook) + '</span>' +
          '<span class="recipe-modal__pill"><i class="ic ic-plate"></i> Serves ' + data.serves + '</span>' +
          '<span class="recipe-modal__pill">' + data.spice + '</span>' +
        '</div>' +
        '<h4 class="recipe-modal__sectitle">About this Recipe</h4>' +
        '<p class="recipe-modal__about">' + data.about + '</p>' +
        '<h4 class="recipe-modal__sectitle">Ingredients</h4>' +
        '<div class="recipe-modal__ingredients">' + ingHTML + '</div>' +
        (data.garnish ? 
          '<h4 class="recipe-modal__sectitle">Optional Garnish</h4>' +
          '<ul class="recipe-modal__list-inline">' + data.garnish.map(function(g){ return '<li>'+g+'</li>'; }).join("") + '</ul>'
          : '') +
        '<h4 class="recipe-modal__sectitle">Preparation</h4>' +
        stepsHTML +
        '<h4 class="recipe-modal__sectitle">Chef\'s Tips</h4>' +
        tipsHTML +
        '<h4 class="recipe-modal__sectitle">Best Served With</h4>' +
        servedHTML +
        '<h4 class="recipe-modal__sectitle">Nutrition (Approx.)</h4>' +
        '<div class="recipe-modal__nutrition">' +
          '<div class="recipe-modal__nutri-cell"><span class="recipe-modal__nutri-val">' + data.nutrition.Calories + '</span><span class="recipe-modal__nutri-lbl">Calories</span></div>' +
          '<div class="recipe-modal__nutri-cell"><span class="recipe-modal__nutri-val">' + data.nutrition.Protein + '</span><span class="recipe-modal__nutri-lbl">Protein</span></div>' +
          '<div class="recipe-modal__nutri-cell"><span class="recipe-modal__nutri-val">' + data.nutrition.Carbs + '</span><span class="recipe-modal__nutri-lbl">Carbs</span></div>' +
          '<div class="recipe-modal__nutri-cell"><span class="recipe-modal__nutri-val">' + data.nutrition.Fat + '</span><span class="recipe-modal__nutri-lbl">Fat</span></div>' +
        '</div>' +
        '<div class="recipe-modal__buy">' +
          '<div class="recipe-modal__buy-title"><i class="ic ic-basket"></i> Buy Fresh Ingredients from TAREL</div>' +
          buyHTML +
        '</div>' +
        '<div class="recipe-modal__footer">' +
          '<button class="btn btn--primary" id="btnAddToBasket">Add Ingredients to Order Form</button>' +
          '<button class="btn btn--ghost" id="btnRecipeClose">Close</button>' +
        '</div>' +
      '</div>';

    recipeModal.hidden = false;
    document.body.style.overflow = "hidden";

    var btnClose = $("#btnRecipeClose");
    if (btnClose) btnClose.addEventListener("click", closeRecipeModal);
    var btnAdd = $("#btnAddToBasket");
    if (btnAdd) {
      btnAdd.addEventListener("click", function () {
        var orderItemsInput = $("#c_items");
        if (orderItemsInput) {
          orderItemsInput.value = data.targetProduct;
          var evt = document.createEvent("HTMLEvents");
          evt.initEvent("change", true, true);
          orderItemsInput.dispatchEvent(evt);
        }
        closeRecipeModal();
        var orderSect = document.getElementById("order");
        if (orderSect) {
          orderSect.scrollIntoView({ behavior: "smooth" });
          var cName = document.getElementById("c_name");
          if (cName) setTimeout(function() { cName.focus(); }, 800);
        }
        showToast("Added " + data.targetProduct + " to your order form!");
      });
    }
  }

  function closeRecipeModal() {
    if (!recipeModal) return;
    recipeModal.hidden = true;
    document.body.style.overflow = "";
    if (recipeModalContent) recipeModalContent.innerHTML = "";
  }

  if (recipeModalClose) recipeModalClose.addEventListener("click", closeRecipeModal);
  if (recipeModalOverlay) recipeModalOverlay.addEventListener("click", closeRecipeModal);

  function showToast(msg) {
    var toast = document.createElement("div");
    toast.style.position = "fixed";
    toast.style.bottom = "24px";
    toast.style.left = "50%";
    toast.style.transform = "translateX(-50%)";
    toast.style.background = "var(--forest)";
    toast.style.color = "#fff";
    toast.style.padding = "12px 24px";
    toast.style.borderRadius = "50px";
    toast.style.boxShadow = "var(--shadow-lg)";
    toast.style.zIndex = "200";
    toast.style.fontSize = "0.9rem";
    toast.style.fontWeight = "700";
    toast.style.border = "1px solid rgba(255,255,255,0.2)";
    toast.style.display = "flex";
    toast.style.alignItems = "center";
    toast.style.gap = "8px";
    toast.innerHTML = '<i class="ic ic-check" style="color:#fff;"></i> ' + msg;
    document.body.appendChild(toast);
    
    toast.style.opacity = "0";
    toast.style.transform = "translateX(-50%) translateY(20px)";
    toast.style.transition = "opacity 0.3s, transform 0.3s";
    
    setTimeout(function() {
      toast.style.opacity = "1";
      toast.style.transform = "translateX(-50%) translateY(0)";
    }, 50);

    setTimeout(function () {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(-50%) translateY(20px)";
      setTimeout(function () { toast.remove(); }, 300);
    }, 3000);
  }

  /* ---- recipe links -> open premium recipe modal ---- */
  $$("[data-recipe]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      openRecipeModal(a.getAttribute("data-recipe"));
    });
  });

  /* ---- footer accordion (mobile) ---- */
  $$("[data-acc]").forEach(function (col) {
    var btn = $("[data-acc-btn]", col);
    if (!btn) return;
    btn.addEventListener("click", function () {
      if (window.innerWidth >= 960) return;
      col.classList.toggle("open");
    });
  });

  /* ---- newsletter ---- */
  var newsBtn = $("#newsBtn"), newsEmail = $("#newsEmail");
  if (newsBtn) newsBtn.addEventListener("click", function () {
    var v = (newsEmail.value || "").trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) { newsEmail.focus(); newsEmail.style.borderColor = "#e0a06a"; return; }
    window.location.href = "mailto:" + SALES_EMAIL + "?subject=" + encodeURIComponent("Newsletter signup") +
      "&body=" + encodeURIComponent("Please add me to the Tarel newsletter: " + v);
  });

  /* ---- order / vendor forms -> WhatsApp / email ---- */
  function buildCustomerMsg() {
    return "Hello Tarel,\nI'd like to place an order.\n\n" +
      line("Name", val("c_name")) + line("Address", val("c_addr")) + line("Postcode", val("c_post")) +
      line("Delivery Date", val("c_date")) + line("Fish/Meat Required", val("c_items")) +
      line("Quantity", val("c_qty")) + line("Special Instructions", val("c_note")) + "\nThank you.";
  }
  function buildVendorMsg() {
    return "Hello Tarel,\nI'd like to become a supplier.\n\n" +
      line("Business Name", val("v_biz")) + line("Supplier Type", val("v_type")) + line("Location", val("v_loc")) +
      line("Products Supplied", val("v_prod")) + line("Weekly Quantity", val("v_qty")) + line("Contact Number", val("v_phone")) + "\nThank you.";
  }
  $$("[data-order]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var kind = btn.getAttribute("data-order");
      if (kind === "customer") openWa(buildCustomerMsg());
      else if (kind === "vendor") openWa(buildVendorMsg());
      else if (kind === "vendor-email") {
        window.location.href = "mailto:" + SALES_EMAIL + "?subject=" + encodeURIComponent("New Vendor Enquiry – Tarel") +
          "&body=" + encodeURIComponent(buildVendorMsg());
      }
    });
  });

  /* ---- sticky CTA: show after 500px, hide near footer ---- */
  var sticky = $("#stickyCta"), footer = $("#footer");
  if (sticky) {
    sticky.hidden = false; // enable; visibility handled by class
    var footerVisible = false;
    if (footer) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { footerVisible = e.isIntersecting; updateSticky(); });
      }, { threshold: 0.02 }).observe(footer);
    }
    function updateSticky() {
      var show = window.scrollY > 500 && !footerVisible;
      sticky.classList.toggle("show", show);
    }
    window.addEventListener("scroll", updateSticky, { passive: true }); updateSticky();
  }

  /* ---- button ripple origin ---- */
  document.addEventListener("pointerdown", function (e) {
    var b = e.target.closest ? e.target.closest(".btn") : null;
    if (!b) return;
    var r = b.getBoundingClientRect();
    b.style.setProperty("--rx", (e.clientX - r.left) + "px");
    b.style.setProperty("--ry", (e.clientY - r.top) + "px");
  });
})();
