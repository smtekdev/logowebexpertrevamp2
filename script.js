const $ = (s, r = document) => r.querySelector(s),
  $$ = (s, r = document) => [...r.querySelectorAll(s)];

$$("img").forEach((i) => {
  const h = () => (i.style.display = "none");
  i.addEventListener("error", h);
  if (i.complete && !i.naturalWidth) h();
});
$("#ticker").innerHTML += $("#ticker").innerHTML;
const ah = $(".about__copy h2");
ah.innerHTML = [...ah.childNodes]
  .map((n) =>
    n.textContent
      .trim()
      .split(/\s+/)
      .map(
        (t) =>
          `<span class="w"><span${n.nodeType === 1 ? ' class="hl"' : ""}>${t}</span></span>`,
      )
      .join(" "),
  )
  .join(" ");

$$(".tile").forEach((t) =>
  t.addEventListener("pointermove", (e) => {
    const r = t.getBoundingClientRect();
    t.style.setProperty("--mx", e.clientX - r.left + "px");
    t.style.setProperty("--my", e.clientY - r.top + "px");
  }),
);

// navbar
const nav = $("#nav");
let last = 0;
addEventListener(
  "scroll",
  () => {
    const y = scrollY;
    nav.classList.toggle("is-solid", y > 30);
    nav.classList.toggle(
      "is-hidden",
      y > last && y > 500 && !document.body.classList.contains("menu-open"),
    );
    last = y;
  },
  { passive: true },
);
$("#burger").onclick = () => document.body.classList.toggle("menu-open");
$$(".menu a").forEach(
  (a) => (a.onclick = () => document.body.classList.remove("menu-open")),
);

const links = $$(".nav__links>li>a");
const spy = new IntersectionObserver(
  (es) =>
    es.forEach((e) => {
      if (e.isIntersecting)
        links.forEach((a) =>
          a.classList.toggle(
            "is-active",
            a.getAttribute("href") === "#" + e.target.id,
          ),
        );
    }),
  { rootMargin: "-45% 0px -50% 0px" },
);
$$("main section[id]").forEach((s) => spy.observe(s));

// service panels
const panels = $$(".panel");
panels.forEach((p) =>
  ["mouseenter", "focus", "click"].forEach((e) =>
    p.addEventListener(e, () =>
      panels.forEach((x) => x.classList.toggle("is-on", x === p)),
    ),
  ),
);

$(".hero").addEventListener("pointermove", (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  $("#glow").style.setProperty("--gx", e.clientX - r.left + "px");
  $("#glow").style.setProperty("--gy", e.clientY - r.top + "px");
});

/* ============ GSAP ============ */
if (
  window.gsap &&
  window.ScrollTrigger &&
  !matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  gsap.registerPlugin(ScrollTrigger);
  const desk = matchMedia("(min-width:961px)").matches;
  const st = (t, s = "top 85%") => ({ trigger: t, start: s, once: true });
  const scrub = (t, s = "top bottom", e = "bottom top") => ({
    trigger: t,
    start: s,
    end: e,
    scrub: true,
  });

  gsap
    .timeline({ defaults: { ease: "power4.out" } })
    .from(".nav__bar", { yPercent: -160, opacity: 0, duration: 1 })
    .from(
      ".hero h1 .ln>span",
      { yPercent: 120, rotate: 3, duration: 1.2, stagger: 0.12 },
      "-=.6",
    )
    .from(
      ".hero [data-in]",
      { y: 30, opacity: 0, duration: 0.9, stagger: 0.1 },
      "-=.8",
    )
    .from(
      ".orb__core",
      { scale: 0.5, opacity: 0, duration: 1.2, ease: "back.out(1.6)" },
      "-=1.2",
    )
    .from(
      ".chip",
      {
        scale: 0,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "back.out(2)",
      },
      "-=.7",
    )
    .from(
      ".tools li",
      {
        y: 20,
        scale: 0.6,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: "back.out(2)",
      },
      "-=1",
    );

  $$(".chip").forEach((c, i) =>
    gsap.to(c, {
      y: i % 2 ? 14 : -14,
      duration: 2.4 + i * 0.4,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    }),
  );
  gsap.to(".orb__core", {
    y: -10,
    duration: 3,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
  });

  if (desk) {
    const ox = gsap.quickTo(".orb", "x", { duration: 0.9 }),
      oy = gsap.quickTo(".orb", "y", { duration: 0.9 });
    $(".hero").addEventListener("pointermove", (e) => {
      ox((e.clientX / innerWidth - 0.5) * 40);
      oy((e.clientY / innerHeight - 0.5) * 30);
    });
    $$(".btn").forEach((b) => {
      const x = gsap.quickTo(b, "x", { duration: 0.4 }),
        y = gsap.quickTo(b, "y", { duration: 0.4 });
      b.addEventListener("pointermove", (e) => {
        const r = b.getBoundingClientRect();
        x((e.clientX - r.left - r.width / 2) * 0.25);
        y((e.clientY - r.top - r.height / 2) * 0.35);
      });
      b.addEventListener("pointerleave", () => {
        x(0);
        y(0);
      });
    });
  }
  gsap.to(".hero__copy", {
    y: -50,
    opacity: 0.3,
    ease: "none",
    scrollTrigger: scrub(".hero", "30% top", "bottom top"),
  });
  gsap.to(".hero__bg", {
    yPercent: 15,
    ease: "none",
    scrollTrigger: scrub(".hero", "top top"),
  });

  // about
  const am = st(".about__media");
  gsap.from(".about__frame", {
    clipPath: "inset(100% 0 0 0)",
    duration: 1.5,
    ease: "power4.inOut",
    scrollTrigger: am,
  });
  gsap.from(".about__outline", {
    scale: 0.85,
    opacity: 0,
    duration: 1.4,
    delay: 0.3,
    ease: "power3.out",
    scrollTrigger: am,
  });
  gsap.from(".about__seal", {
    scale: 0,
    rotate: -180,
    duration: 1.2,
    delay: 0.7,
    ease: "back.out(1.6)",
    scrollTrigger: am,
  });
  gsap.from(".about__badge", {
    x: -60,
    opacity: 0,
    duration: 1,
    delay: 0.9,
    ease: "power3.out",
    scrollTrigger: am,
  });
  gsap.fromTo(
    ".about__frame img",
    { yPercent: -7 },
    { yPercent: 7, ease: "none", scrollTrigger: scrub(".about__media") },
  );
  gsap.to(".about__outline", {
    y: -50,
    x: 14,
    ease: "none",
    scrollTrigger: scrub(".about__media"),
  });
  gsap.to(".about__blob", {
    y: 120,
    ease: "none",
    scrollTrigger: scrub(".about__media"),
  });
  gsap.to(".about__seal", {
    y: -40,
    ease: "none",
    scrollTrigger: scrub(".about__media"),
  });
  gsap.from(".about__copy h2 .w>span", {
    yPercent: 115,
    rotate: 4,
    duration: 1,
    stagger: 0.07,
    ease: "power4.out",
    scrollTrigger: st(".about__copy h2", "top 88%"),
  });
  gsap.from(".about__copy>:not(h2)", {
    y: 40,
    opacity: 0,
    duration: 1,
    stagger: 0.12,
    ease: "power3.out",
    scrollTrigger: st(".about__copy"),
  });
  gsap.from(".tile", {
    y: 70,
    opacity: 0,
    rotateX: -25,
    duration: 1,
    stagger: 0.14,
    ease: "power3.out",
    scrollTrigger: st(".bento", "top 90%"),
  });
  if (desk) {
    $$(".tile").forEach((t) => {
      const rx = gsap.quickTo(t, "rotationX", { duration: 0.5 }),
        ry = gsap.quickTo(t, "rotationY", { duration: 0.5 });
      t.addEventListener("pointermove", (e) => {
        const r = t.getBoundingClientRect();
        ry(((e.clientX - r.left) / r.width - 0.5) * 14);
        rx(-((e.clientY - r.top) / r.height - 0.5) * 14);
      });
      t.addEventListener("pointerleave", () => {
        rx(0);
        ry(0);
      });
    });
    const f = $(".about__frame"),
      fx = gsap.quickTo(f, "rotationY", { duration: 0.8 }),
      fy = gsap.quickTo(f, "rotationX", { duration: 0.8 });
    gsap.set(f, { transformPerspective: 1000 });
    $(".about__media").addEventListener("pointermove", (e) => {
      const r = e.currentTarget.getBoundingClientRect();
      fx(((e.clientX - r.left) / r.width - 0.5) * 10);
      fy(-((e.clientY - r.top) / r.height - 0.5) * 10);
    });
    $(".about__media").addEventListener("pointerleave", () => {
      fx(0);
      fy(0);
    });
  }

  // services
  gsap.from(".sec-head>*", {
    y: 50,
    opacity: 0,
    duration: 1,
    stagger: 0.15,
    ease: "power3.out",
    scrollTrigger: st(".sec-head"),
  });
  gsap.from(".panel", {
    y: 90,
    opacity: 0,
    duration: 1,
    stagger: 0.1,
    ease: "power3.out",
    scrollTrigger: st("#panels"),
  });
  gsap.to(".bgword", {
    xPercent: -14,
    ease: "none",
    scrollTrigger: scrub(".services"),
  });
}

const PRICING = {
  "Logo Designing": {
    unit: "/project",
    plans: [
      ["Basic", 49.99, 79, "4 to 5 concepts"],
      ["Standard", 79.99, 119, "6 to 7 concepts"],
      ["Premium", 149.99, 199, "8 to 10 concepts"],
    ],
    feats: [
      ["Unlimited revision rounds", 0],
      ["Final files: .PNG, .PSD, .AI, .JPG, .PDF", 0],
      ["Turn around time (TAT): 24hrs", 0],
      ["100% satisfaction guaranteed", 0],
      ["100% money back guaranteed", 0],
      ["Complete branding kit", 2],
    ],
  },
  "Website Development": {
    unit: "/project",
    plans: [
      ["Basic", 299, 399, "Up to 5 pages"],
      ["Standard", 599, 799, "Up to 10 pages"],
      ["Premium", 1199, 1599, "15+ pages & custom features"],
    ],
    feats: [
      ["Responsive, mobile-first design", 0],
      ["WordPress / custom build", 0],
      ["Free support after launch", 0],
      ["Basic SEO setup", 1],
      ["Speed optimization", 1],
      ["Custom animations", 2],
      ["Booking / e-commerce integration", 2],
    ],
  },
  Shopify: {
    unit: "/project",
    plans: [
      ["Basic", 349, 449, "Up to 20 products"],
      ["Standard", 699, 899, "Up to 100 products"],
      ["Premium", 1299, 1699, "Unlimited products"],
    ],
    feats: [
      ["Conversion-focused design", 0],
      ["Payment & checkout setup", 0],
      ["Mobile optimized", 0],
      ["Product import & collections", 1],
      ["App integrations", 1],
      ["Custom theme development", 2],
    ],
  },
  "Video Editing": {
    unit: "/project",
    plans: [
      ["Basic", 79, 119, "Up to 1 min video"],
      ["Standard", 149, 199, "Up to 3 min video"],
      ["Premium", 299, 399, "Up to 5 min video"],
    ],
    feats: [
      ["Color grading & sound design", 0],
      ["Delivered in HD / 4K", 0],
      ["Motion graphics & titles", 1],
      ["Subtitles & captions", 1],
      ["Multiple format exports", 2],
      ["Priority turnaround", 2],
    ],
  },
  SEO: {
    unit: "/month",
    plans: [
      ["Basic", 149, 199, "10 target keywords"],
      ["Standard", 299, 399, "25 target keywords"],
      ["Premium", 599, 799, "50+ target keywords"],
    ],
    feats: [
      ["On-page optimization", 0],
      ["Monthly ranking report", 0],
      ["Technical SEO audit", 1],
      ["Content recommendations", 1],
      ["Link building", 2],
      ["Competitor analysis", 2],
    ],
  },
  "Social Media Marketing": {
    unit: "/month",
    plans: [
      ["Basic", 129, 179, "8 posts per month"],
      ["Standard", 249, 329, "16 posts per month"],
      ["Premium", 449, 599, "30 posts per month"],
    ],
    feats: [
      ["Custom branded designs", 0],
      ["Caption & hashtag strategy", 0],
      ["Content calendar", 1],
      ["Monthly performance report", 1],
      ["Story & reel designs", 2],
      ["Community management", 2],
    ],
  },
};
const NOTES = [
  "Perfect for startups or individuals taking their first step into the digital world.",
  "Ideal for growing businesses ready to boost their online presence.",
  "Designed for brands aiming for maximum impact and advanced results.",
];

$$("h2.split").forEach((h) => {
  if (h.querySelector(".w")) return;
  h.innerHTML = [...h.childNodes]
    .map((n) =>
      n.textContent
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map(
          (t) =>
            `<span class="w"><span${n.nodeType === 1 ? ' class="hl"' : ""}>${t}</span></span>`,
        )
        .join(" "),
    )
    .join(" ");
});

// packages
const pkTabs = $("#pkTabs"),
  pkGrid = $("#pkGrid");
function renderPlans(key, animate = true) {
  const d = PRICING[key];
  pkGrid.innerHTML = d.plans
    .map(([n, p, old, first], i) => {
      const inner = `<div class="plan__in">
        <h3>${n}</h3>
        <p class="price"><s>$${old}</s><b data-v="${p}">$${p}</b><em>${d.unit}</em></p>
        <p class="plan__d">${NOTES[i]}</p>
        <a class="btn" href="#contact">${i === 1 ? "Scale my business" : "Get Started"} →</a>
        <ul><li>${first}</li>${d.feats.map(([t, m]) => `<li class="${i >= m ? "" : "no"}">${t}</li>`).join("")}</ul>
      </div>`;
      return i === 1
        ? `<article class="plan plan--hot"><div class="plan__flag">⚡ Most Recommended</div>${inner}</article>`
        : `<article class="plan">${inner}</article>`;
    })
    .join("");
  if (animate && window.gsap) {
    gsap.from(".plan", {
      y: 60,
      opacity: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: "power3.out",
      clearProps: "transform,opacity",
    });
    $$(".price b").forEach((b) => {
      const o = { v: 0 },
        t = +b.dataset.v;
      gsap.to(o, {
        v: t,
        duration: 1,
        ease: "power2.out",
        onUpdate: () =>
          (b.textContent = "$" + (t % 1 ? o.v.toFixed(2) : Math.round(o.v))),
      });
    });
  }
}
Object.keys(PRICING).forEach((k, i) => {
  const b = document.createElement("button");
  b.textContent = k;
  if (!i) b.className = "is-on";
  b.onclick = () => {
    $$("#pkTabs button").forEach((x) => x.classList.toggle("is-on", x === b));
    renderPlans(k);
  };
  pkTabs.appendChild(b);
});
renderPlans("Logo Designing", false);

// forms
$("#cForm").addEventListener("submit", (e) => {
  e.preventDefault(); // TODO: connect Formspree / EmailJS here
  window.gsap
    ? gsap.to("#cOk", { opacity: 1, duration: 0.6, pointerEvents: "auto" })
    : ($("#cOk").style.opacity = 1);
  e.target.reset();
});
$("#news").addEventListener("submit", (e) => {
  e.preventDefault();
  e.target.reset();
});

if (
  window.gsap &&
  window.ScrollTrigger &&
  !matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  const on = (t, s = "top 85%") => ({ trigger: t, start: s, once: true });

  $$("h2.split").forEach((h) =>
    gsap.from(h.querySelectorAll(".w>span"), {
      yPercent: 115,
      rotate: 4,
      duration: 1,
      stagger: 0.06,
      ease: "power4.out",
      scrollTrigger: on(h, "top 88%"),
    }),
  );

  $$(".rail").forEach((r) => {
    const t = r.querySelector(".rail__track"),
      dir = +r.dataset.dir;
    t.innerHTML += t.innerHTML;
    const tw = gsap.fromTo(
      t,
      { xPercent: dir < 0 ? 0 : -50 },
      {
        xPercent: dir < 0 ? -50 : 0,
        duration: r.classList.contains("rail--ts") ? 50 : 40,
        ease: "none",
        repeat: -1,
      },
    );
    r.addEventListener("pointerenter", () =>
      gsap.to(tw, { timeScale: 0.15, duration: 0.6 }),
    );
    r.addEventListener("pointerleave", () =>
      gsap.to(tw, { timeScale: 1, duration: 0.6 }),
    );
    ScrollTrigger.create({
      trigger: r,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (s) =>
        gsap.to(tw, {
          timeScale: 1 + Math.abs(s.getVelocity()) / 350,
          duration: 0.2,
          overwrite: true,
          onComplete: () => gsap.to(tw, { timeScale: 1, duration: 1 }),
        }),
    });
    gsap.from(r, {
      y: 70,
      opacity: 0,
      duration: 1.1,
      ease: "power3.out",
      scrollTrigger: on(r, "top 92%"),
    });
  });

  (() => {
    const view = $(".pfs__view"),
      track = $(".pfs__track"),
      cards = $$(".pj");
    const bar = $(".pfc__bar i"),
      num = $(".pfc__n b"),
      N = cards.length;
    let i = 0,
      step = 0,
      max = 0,
      timer = null,
      moved = false;
    const measure = () => {
      step =
        cards[0].offsetWidth +
        (parseFloat(getComputedStyle(track).columnGap) || 22);
      max = Math.max(0, N - Math.floor(view.clientWidth / step));
    };
    const go = (n, d = 0.9) => {
      i = Math.min(Math.max(n, 0), max);
      gsap.to(track, { x: -i * step, duration: d, ease: "power3.out" });
      cards.forEach((c, k) => c.classList.toggle("is-active", k === i));
      num.textContent = String(i + 1).padStart(2, "0");
      gsap.to(bar, {
        scaleX: (i + 1) / (max + 1),
        duration: d,
        ease: "power3.out",
      });
    };
    const next = () => go(i >= max ? 0 : i + 1);
    const play = () => {
      stop();
      timer = setInterval(next, 4500);
    };
    const stop = () => clearInterval(timer);
    measure();
    go(0, 0);
    $("#pfNext").onclick = () => {
      next();
      play();
    };
    $("#pfPrev").onclick = () => {
      go(i <= 0 ? max : i - 1);
      play();
    };
    addEventListener("resize", () => {
      measure();
      go(i, 0);
    });

    let sx = 0,
      x0 = 0,
      down = false;
    view.addEventListener("pointerdown", (e) => {
      down = true;
      moved = false;
      sx = e.clientX;
      x0 = gsap.getProperty(track, "x");
      stop();
    });
    addEventListener("pointermove", (e) => {
      if (!down) return;
      const dx = e.clientX - sx;
      if (Math.abs(dx) > 6) moved = true;
      gsap.set(track, { x: x0 + dx });
    });
    addEventListener("pointerup", (e) => {
      if (!down) return;
      down = false;
      const dx = e.clientX - sx;
      Math.abs(dx) > 60 ? go(i + (dx < 0 ? 1 : -1)) : go(i, 0.5);
      play();
    });
    view.addEventListener(
      "click",
      (e) => {
        if (moved) e.preventDefault();
      },
      true,
    );
    view.addEventListener("dragstart", (e) => e.preventDefault());
    ScrollTrigger.create({
      trigger: ".pf",
      start: "top 70%",
      end: "bottom 20%",
      onToggle: (s) => (s.isActive ? play() : stop()),
    });
    gsap.from(".pfs__copy>*:not(h2)", {
      y: 40,
      opacity: 0,
      duration: 1,
      stagger: 0.12,
      ease: "power3.out",
      scrollTrigger: on(".pfs__copy"),
    });
    gsap.from(cards, {
      x: 160,
      opacity: 0,
      duration: 1.1,
      stagger: 0.08,
      ease: "power3.out",
      scrollTrigger: on(".pfs__view", "top 90%"),
      clearProps: "transform,opacity",
    });
    gsap.from(".pfc", {
      y: 30,
      opacity: 0,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: on(".pfc", "top 98%"),
    });
  })();

  // CTA
  gsap.to(".cta__bg span", {
    xPercent: -30,
    ease: "none",
    scrollTrigger: {
      trigger: ".cta",
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  });
  gsap.from(".cta p,.cta .btn", {
    y: 40,
    opacity: 0,
    duration: 1,
    stagger: 0.15,
    ease: "power3.out",
    scrollTrigger: on(".cta", "top 70%"),
  });

  // packages
  gsap.from(".pk__head>:not(h2)", {
    y: 40,
    opacity: 0,
    duration: 0.9,
    stagger: 0.1,
    ease: "power3.out",
    scrollTrigger: on(".pk__head"),
  });
  gsap.fromTo(
    ".pk__tabs button",
    { y: 30, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.07,
      ease: "power3.out",
      scrollTrigger: on(".pk__tabs", "top 98%"),
    },
  );
  gsap.from(".plan", {
    y: 110,
    opacity: 0,
    duration: 1.1,
    stagger: 0.15,
    ease: "power3.out",
    scrollTrigger: on(".pk__grid", "top 88%"),
    clearProps: "transform,opacity",
  });
  gsap.to(".pk .bgword", {
    xPercent: -14,
    ease: "none",
    scrollTrigger: { trigger: ".pk", scrub: true },
  });

  // contact
  gsap.from(".ct__head>:not(h2)", {
    y: 40,
    opacity: 0,
    duration: 1,
    stagger: 0.12,
    ease: "power3.out",
    scrollTrigger: on(".ct__head"),
  });
  gsap.from(".cx", {
    y: 90,
    opacity: 0,
    duration: 1.2,
    ease: "power4.out",
    scrollTrigger: on(".cx", "top 88%"),
  });
  gsap.from(".cx__form>*:not(.cx__ok)", {
    y: 24,
    opacity: 0,
    duration: 0.7,
    stagger: 0.08,
    delay: 0.3,
    ease: "power3.out",
    scrollTrigger: on(".cx", "top 88%"),
  });
  gsap.from(".cx__side li", {
    x: 40,
    opacity: 0,
    duration: 0.9,
    stagger: 0.12,
    delay: 0.5,
    ease: "power3.out",
    scrollTrigger: on(".cx", "top 88%"),
  });

  (() => {
    const view = $(".tsv"),
      track = $(".tst"),
      cards = $$(".tcard"),
      N = cards.length;
    let i = 0,
      step = 0,
      max = 0,
      timer = null,
      moved = false;
    const measure = () => {
      const gap = parseFloat(getComputedStyle(track).columnGap) || 18;
      step = cards[0].offsetWidth + gap;
      max = Math.max(0, N - Math.round((view.clientWidth + gap) / step));
    };
    const go = (n, d = 0.9) => {
      i = Math.min(Math.max(n, 0), max);
      gsap.to(track, { x: -i * step, duration: d, ease: "power3.out" });
    };
    const next = () => go(i >= max ? 0 : i + 1);
    const stop = () => clearInterval(timer);
    const play = () => {
      stop();
      timer = setInterval(next, 4000);
    };
    measure();
    go(0, 0);
    $("#tsNext").onclick = () => {
      next();
      play();
    };
    $("#tsPrev").onclick = () => {
      go(i <= 0 ? max : i - 1);
      play();
    };
    addEventListener("resize", () => {
      measure();
      go(i, 0);
    });
    let sx = 0,
      x0 = 0,
      down = false;
    view.addEventListener("pointerdown", (e) => {
      down = true;
      moved = false;
      sx = e.clientX;
      x0 = gsap.getProperty(track, "x");
      stop();
    });
    addEventListener("pointermove", (e) => {
      if (!down) return;
      const dx = e.clientX - sx;
      if (Math.abs(dx) > 6) moved = true;
      gsap.set(track, { x: x0 + dx });
    });
    addEventListener("pointerup", (e) => {
      if (!down) return;
      down = false;
      const dx = e.clientX - sx;
      Math.abs(dx) > 60 ? go(i + (dx < 0 ? 1 : -1)) : go(i, 0.5);
      play();
    });
    view.addEventListener("dragstart", (e) => e.preventDefault());
    ScrollTrigger.create({
      trigger: ".ts",
      start: "top 70%",
      end: "bottom 20%",
      onToggle: (s) => (s.isActive ? play() : stop()),
    });
    gsap.from(".ts__top .tag,.ts__side>*", {
      y: 40,
      opacity: 0,
      duration: 1,
      stagger: 0.12,
      ease: "power3.out",
      scrollTrigger: on(".ts"),
    });
    gsap.from(cards, {
      x: 160,
      opacity: 0,
      duration: 1.1,
      stagger: 0.08,
      ease: "power3.out",
      scrollTrigger: on(".tsv", "top 90%"),
      clearProps: "transform,opacity",
    });
    $$(".tcard__stars").forEach((s) => {
      s.innerHTML = [...s.textContent].map((c) => `<i>${c}</i>`).join("");
    });
    gsap.from(".tcard__stars i", {
      scale: 0,
      rotate: -90,
      opacity: 0,
      duration: 0.6,
      stagger: 0.05,
      delay: 0.5,
      ease: "back.out(2.5)",
      scrollTrigger: on(".tsv", "top 85%"),
    });
    gsap.from(".tcard__q", {
      scale: 0.4,
      rotate: -20,
      opacity: 0,
      duration: 1,
      stagger: 0.08,
      delay: 0.4,
      ease: "back.out(1.7)",
      scrollTrigger: on(".tsv", "top 85%"),
    });
    gsap.to(".tcard__q", {
      y: -8,
      duration: 2.6,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      stagger: 0.3,
    });
    if (matchMedia("(min-width:961px)").matches) {
      cards.forEach((c) => {
        const rx = gsap.quickTo(c, "rotationX", { duration: 0.5 }),
          ry = gsap.quickTo(c, "rotationY", { duration: 0.5 }),
          ly = gsap.quickTo(c, "y", { duration: 0.5 });
        c.addEventListener("pointerenter", () =>
          gsap.set(c, { transformPerspective: 900 }),
        );
        c.addEventListener("pointermove", (e) => {
          const r = c.getBoundingClientRect();
          c.style.setProperty("--mx", e.clientX - r.left + "px");
          c.style.setProperty("--my", e.clientY - r.top + "px");
          ry(((e.clientX - r.left) / r.width - 0.5) * 10);
          rx(-((e.clientY - r.top) / r.height - 0.5) * 10);
          ly(-8);
        });
        c.addEventListener("pointerleave", () => {
          rx(0);
          ry(0);
          ly(0);
        });
      });
    }
  })();
  gsap.from(".ft__grid>div,.ft__copy", {
    y: 50,
    opacity: 0,
    duration: 1,
    stagger: 0.12,
    ease: "power3.out",
    scrollTrigger: on(".ft", "top 88%"),
  });
}
