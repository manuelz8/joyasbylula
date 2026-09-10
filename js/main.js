/* Joyas by Lula — shared page interactivity. Requires products.js loaded first. */
(function (global) {
  "use strict";

  var Lula = (global.Lula = global.Lula || {});

  // ── Drawer (mobile hamburger menu) ──────────────────────────────────────
  // The design chat's own bug report: the backdrop must be pointer-events:none
  // while closed, or it silently blocks every click on the page underneath.
  Lula.initDrawer = function () {
    var hamburger = document.querySelector(".hamburger-btn");
    var drawer = document.querySelector(".drawer");
    var backdrop = document.querySelector(".drawer-backdrop");
    if (!hamburger || !drawer || !backdrop) return;

    function open() {
      drawer.classList.add("open");
      backdrop.classList.add("open");
    }
    function close() {
      drawer.classList.remove("open");
      backdrop.classList.remove("open");
    }
    hamburger.addEventListener("click", function () {
      drawer.classList.contains("open") ? close() : open();
    });
    backdrop.addEventListener("click", close);
  };

  // ── Hero carousel ────────────────────────────────────────────────────────
  Lula.initHero = function () {
    var hero = document.getElementById("hero");
    if (!hero) return;
    var slides = Array.prototype.slice.call(
      hero.querySelectorAll(".hero-slide"),
    );
    var dots = Array.prototype.slice.call(
      hero.querySelectorAll(".hero-dots button"),
    );
    var prevBtn = hero.querySelector(".hero-arrow.prev");
    var nextBtn = hero.querySelector(".hero-arrow.next");
    var current = 0;

    function show(i) {
      current = (i + slides.length) % slides.length;
      slides.forEach(function (s, idx) {
        s.classList.toggle("active", idx === current);
      });
      dots.forEach(function (d, idx) {
        d.classList.toggle("active", idx === current);
      });
    }
    dots.forEach(function (d, idx) {
      d.addEventListener("click", function () {
        show(idx);
      });
    });
    if (prevBtn)
      prevBtn.addEventListener("click", function () {
        show(current - 1);
      });
    if (nextBtn)
      nextBtn.addEventListener("click", function () {
        show(current + 1);
      });
    show(0);
  };

  // ── Lookbook click-to-shop ───────────────────────────────────────────────
  Lula.initLookbook = function () {
    var items = Array.prototype.slice.call(
      document.querySelectorAll(".lookbook-item"),
    );
    items.forEach(function (item) {
      var dot = item.querySelector(".shop-dot");
      var popover = item.querySelector(".shop-popover");
      if (!dot || !popover) return;
      dot.addEventListener("click", function () {
        var wasOpen = popover.classList.contains("open");
        items.forEach(function (other) {
          var p = other.querySelector(".shop-popover");
          if (p) p.classList.remove("open");
        });
        if (!wasOpen) popover.classList.add("open");
      });
    });
  };

  // ── FAQ accordion (single open at a time) ───────────────────────────────
  Lula.initFaqAccordion = function (container) {
    var items = Array.prototype.slice.call(
      container.querySelectorAll(".faq-item"),
    );
    items.forEach(function (item) {
      var question = item.querySelector(".faq-question");
      var sign = item.querySelector(".faq-sign");
      question.addEventListener("click", function () {
        var wasOpen = item.classList.contains("open");
        items.forEach(function (other) {
          other.classList.remove("open");
          var s = other.querySelector(".faq-sign");
          if (s) s.textContent = "+";
        });
        if (!wasOpen) {
          item.classList.add("open");
          if (sign) sign.textContent = "−";
        }
      });
    });
  };

  // ── Related-products carousel (arrows + dots, desktop 4-up) ─────────────
  Lula.initRelatedCarousel = function (track, arrowsWrap, dotsWrap) {
    var page = 0;
    function pageCount() {
      var perPage = window.innerWidth >= 860 ? 4 : 1;
      return Math.max(1, Math.ceil(track.children.length / perPage));
    }
    function renderDots() {
      dotsWrap.innerHTML = "";
      var count = pageCount();
      for (var i = 0; i < count; i++) {
        var btn = document.createElement("button");
        btn.setAttribute("aria-label", "Ir a página");
        if (i === page) btn.classList.add("active");
        (function (idx) {
          btn.addEventListener("click", function () {
            track.scrollTo({
              left: idx * track.clientWidth,
              behavior: "smooth",
            });
            page = idx;
            renderDots();
          });
        })(i);
        dotsWrap.appendChild(btn);
      }
    }
    if (arrowsWrap) {
      var prevBtn = arrowsWrap.querySelector(".prev");
      var nextBtn = arrowsWrap.querySelector(".next");
      if (prevBtn)
        prevBtn.addEventListener("click", function () {
          track.scrollBy({ left: -track.clientWidth, behavior: "smooth" });
          page = Math.max(0, page - 1);
          renderDots();
        });
      if (nextBtn)
        nextBtn.addEventListener("click", function () {
          track.scrollBy({ left: track.clientWidth, behavior: "smooth" });
          page = Math.min(pageCount() - 1, page + 1);
          renderDots();
        });
    }
    renderDots();
    window.addEventListener("resize", renderDots);
  };

  // ── Universal mobile/responsive carousel with dots & arrows ──────────────
  Lula.initCarousel = function (track, controlsWrapOrArrows, dotsWrap) {
    if (!track) return;
    var prevBtn = controlsWrapOrArrows
      ? controlsWrapOrArrows.querySelector(".prev")
      : null;
    var nextBtn = controlsWrapOrArrows
      ? controlsWrapOrArrows.querySelector(".next")
      : null;
    var dotsContainer =
      dotsWrap ||
      (controlsWrapOrArrows
        ? controlsWrapOrArrows.querySelector(".carousel-dots")
        : null);

    function getItems() {
      return Array.prototype.slice.call(track.children);
    }

    function getStep() {
      var items = getItems();
      if (!items.length) return track.clientWidth * 0.8;
      // Single item per view (lookbook)
      if (items[0].offsetWidth >= track.clientWidth * 0.85) {
        return track.clientWidth;
      }
      // Multiple items per view: measure distance between item 0 and item 1
      if (items.length > 1) {
        var d = items[1].offsetLeft - items[0].offsetLeft;
        if (d > 10) return d;
      }
      return items[0].offsetWidth + 16;
    }

    function updateControls() {
      var items = getItems();
      var count = items.length;
      var maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);

      // Boundary disabled states
      var atStart = track.scrollLeft <= 8;
      var atEnd =
        maxScroll <= 2 || Math.ceil(track.scrollLeft) >= maxScroll - 8;

      if (prevBtn) {
        prevBtn.disabled = atStart;
        prevBtn.classList.toggle("disabled", atStart);
      }
      if (nextBtn) {
        nextBtn.disabled = atEnd;
        nextBtn.classList.toggle("disabled", atEnd);
      }

      if (!dotsContainer) return;
      if (window.innerWidth >= 860 || count <= 1) {
        dotsContainer.innerHTML = "";
        return;
      }

      if (dotsContainer.children.length !== count) {
        dotsContainer.innerHTML = "";
        for (var i = 0; i < count; i++) {
          var dot = document.createElement("button");
          dot.type = "button";
          dot.setAttribute("aria-label", "Ir al slide " + (i + 1));
          (function (idx) {
            dot.addEventListener("click", function () {
              var itms = getItems();
              var step = getStep();
              var mx = Math.max(0, track.scrollWidth - track.clientWidth);
              if (idx === 0) {
                track.scrollTo({ left: 0, behavior: "smooth" });
              } else if (idx === itms.length - 1) {
                track.scrollTo({ left: mx, behavior: "smooth" });
              } else {
                var targetLeft = Math.min(mx, Math.max(0, idx * step));
                track.scrollTo({ left: targetLeft, behavior: "smooth" });
              }
            });
          })(i);
          dotsContainer.appendChild(dot);
        }
      }

      var current = 0;
      if (atEnd) {
        current = count - 1;
      } else if (atStart) {
        current = 0;
      } else {
        var step = getStep();
        current = Math.min(
          count - 1,
          Math.max(0, Math.round(track.scrollLeft / step)),
        );
      }

      var dots = dotsContainer.querySelectorAll("button");
      for (var j = 0; j < dots.length; j++) {
        dots[j].classList.toggle("active", j === current);
      }
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", function (e) {
        if (track.scrollLeft <= 8) {
          e.preventDefault();
          return;
        }
        var step = getStep();
        if (track.scrollLeft - step <= 12) {
          track.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          track.scrollBy({ left: -step, behavior: "smooth" });
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function (e) {
        var maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
        if (Math.ceil(track.scrollLeft) >= maxScroll - 8) {
          e.preventDefault();
          return;
        }
        var step = getStep();
        if (track.scrollLeft + step >= maxScroll - 12) {
          track.scrollTo({ left: maxScroll, behavior: "smooth" });
        } else {
          track.scrollBy({ left: step, behavior: "smooth" });
        }
      });
    }

    var scrollTimer = null;
    track.addEventListener("scroll", function () {
      updateControls();
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(updateControls, 80);
    });

    window.addEventListener("resize", updateControls);
    updateControls();
    setTimeout(updateControls, 50);
    setTimeout(updateControls, 250);
    setTimeout(updateControls, 600);
  };

  // ── Collection page: material filter + sort ─────────────────────────────
  Lula.initCollectionFilters = function (category) {
    var grid = document.getElementById("product-grid");
    var filterBar = document.querySelector(".filter-bar");
    var sortSelect = document.querySelector(".sort-select");
    if (!grid || !filterBar) return;

    var all = Lula.byCategory(category);
    var materials = ["Todos", "Plata 925", "Tejido a mano", "Enchapado en oro"];
    var activeMaterial = "Todos";

    function renderChips() {
      Array.prototype.slice
        .call(filterBar.querySelectorAll(".filter-chip"))
        .forEach(function (chip) {
          chip.classList.toggle(
            "active",
            chip.dataset.material === activeMaterial,
          );
        });
    }
    materials.forEach(function (label) {
      var chip = document.createElement("button");
      chip.className = "filter-chip";
      chip.type = "button";
      chip.textContent = label;
      chip.dataset.material = label;
      chip.addEventListener("click", function () {
        activeMaterial = label;
        renderChips();
        renderGrid();
      });
      filterBar.insertBefore(
        chip,
        filterBar.querySelector(".sort-select-wrap"),
      );
    });
    renderChips();

    function renderGrid() {
      var list =
        activeMaterial === "Todos"
          ? all.slice()
          : all.filter(function (p) {
              return p.tag === activeMaterial;
            });
      var sortVal = sortSelect ? sortSelect.value : "Relevancia";
      if (
        sortVal === "Precio: menor a mayor" ||
        sortVal === "Precio: mayor a menor"
      ) {
        var toNumber = function (price) {
          return parseInt(price.replace(/[^0-9]/g, ""), 10);
        };
        list.sort(function (a, b) {
          var diff = toNumber(a.price) - toNumber(b.price);
          return sortVal === "Precio: menor a mayor" ? diff : -diff;
        });
      }
      grid.innerHTML = "";
      list.forEach(function (p) {
        grid.appendChild(Lula.renderProductCard(p));
      });
    }
    if (sortSelect) sortSelect.addEventListener("change", renderGrid);
    renderGrid();
  };

  // ── Product page ─────────────────────────────────────────────────────────
  var FAQS = [
    {
      question: "¿Cómo son los envíos?",
      answer:
        "Envío gratis a todo el país. Los pedidos se despachan en 2 a 4 días hábiles y llegan en 3 a 8 días hábiles según la localidad.",
    },
    {
      question: "¿Qué cuidados requiere?",
      answer:
        "Evitar el contacto con agua, perfume y cremas. Guardar la pieza en un lugar seco, separada de otras joyas, para que no se raye ni se manche.",
    },
  ];
  var FAQ_RETURNS_UNIQUE =
    "Sí, hasta 30 días desde la compra, siempre que la pieza no haya sido usada. Al ser una pieza única, la devolución no incluye reposición del mismo diseño.";
  var FAQ_RETURNS_STANDARD =
    "Sí, hasta 30 días desde la compra, siempre que la pieza no haya sido usada.";

  Lula.initProductPage = function () {
    var params = new URLSearchParams(window.location.search);
    var slug = params.get("slug");
    var product =
      (slug && Lula.bySlug(slug)) || Lula.bySlug("collar-nudo-eterno");

    var categoryLabels = {
      collares: "Collares",
      aros: "Aros",
      pulseras: "Pulseras",
      cadenas: "Cadenas",
      dijes: "Dijes",
    };

    document.title = product.title + " — Joyas by Lula";
    document.getElementById("breadcrumb-category").textContent =
      categoryLabels[product.category] || "Colección";
    document.getElementById("pdp-title-crumb").textContent = product.title;
    document.getElementById("pdp-title").textContent = product.title;
    document.getElementById("pdp-price").textContent = product.price;
    document.getElementById("pdp-desc").textContent =
      "Pieza artesanal en " +
      product.material.toLowerCase() +
      "." +
      (product.unique
        ? " Pieza única: solo queda una unidad de este diseño."
        : " Elaborada a mano, cada pieza puede presentar pequeñas variaciones naturales.");

    var badge = document.getElementById("pdp-badge");
    if (product.unique) badge.style.display = "";
    else badge.remove();

    var stockLine = document.getElementById("pdp-stock");
    stockLine.textContent = product.unique
      ? "Queda 1 unidad disponible"
      : "Disponible";

    var galleryMedia = document.getElementById("gallery-media");
    if (product.mainImage) {
      var img = document.createElement("img");
      img.src = product.mainImage;
      img.alt = product.title;
      galleryMedia.appendChild(img);
    } else {
      var ph = document.createElement("div");
      ph.className = "placeholder-fill";
      ph.textContent =
        "foto: " + product.title.toLowerCase() + " — vista principal";
      galleryMedia.appendChild(ph);
    }

    // Material variant selector — illustrative, not tied to real inventory.
    var variantRow = document.getElementById("variant-row");
    var variantLabels = ["Plata 925", "Enchapado en oro"];
    var activeVariant = variantLabels[0];
    function renderVariants() {
      variantRow.innerHTML = "";
      variantLabels.forEach(function (label) {
        var chip = document.createElement("button");
        chip.type = "button";
        chip.className =
          "variant-chip" + (label === activeVariant ? " active" : "");
        chip.textContent = label;
        chip.addEventListener("click", function () {
          activeVariant = label;
          renderVariants();
        });
        variantRow.appendChild(chip);
      });
    }
    renderVariants();

    // FAQs
    var faqList = document.getElementById("faq-list");
    var faqs = FAQS.concat([
      {
        question: "¿Puedo cambiar o devolver la pieza?",
        answer: product.unique ? FAQ_RETURNS_UNIQUE : FAQ_RETURNS_STANDARD,
      },
    ]);
    faqs.forEach(function (f, i) {
      var item = document.createElement("div");
      item.className = "faq-item" + (i === 0 ? " open" : "");
      item.innerHTML =
        '<button class="faq-question"><span>' +
        f.question +
        '</span><span class="faq-sign">' +
        (i === 0 ? "−" : "+") +
        "</span></button>" +
        '<p class="faq-answer">' +
        f.answer +
        "</p>";
      faqList.appendChild(item);
    });
    Lula.initFaqAccordion(faqList);

    // Related products
    var related = Lula.CATALOG.filter(function (p) {
      return p.slug !== product.slug;
    }).slice(0, 6);
    var track = document.getElementById("related-track");
    related.forEach(function (p) {
      var cell = document.createElement("div");
      cell.appendChild(Lula.renderProductCard(p));
      track.appendChild(cell);
    });
    Lula.initRelatedCarousel(
      track,
      document.getElementById("related-arrows"),
      document.getElementById("related-dots"),
    );
  };

  // ── Scroll reveal animations ───────────────────────────────────────────────
  Lula.initScrollReveal = function () {
    var targets = Array.prototype.slice.call(
      document.querySelectorAll(
        ".cat-section, #sobre-nosotros, .scroll-row-section, .lookbook-section, #faq-home, .ig-section, footer.site-footer, .collection-header, .collection-section, #pdp-main, .related-section",
      ),
    );

    if (!targets.length) return;

    if (
      typeof window === "undefined" ||
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      targets.forEach(function (el) {
        el.classList.add("revealed");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            obs.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "0px 0px -40px 0px",
        threshold: 0.08,
      },
    );

    targets.forEach(function (el) {
      el.classList.add("reveal-on-scroll");
      observer.observe(el);
    });
  };
})(window);
