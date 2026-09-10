/* Joyas by Lula — shared product catalog and card rendering. */
(function (global) {
  "use strict";

  function slugify(title) {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  // Slugs that have a real uploaded photo in images/site/card-<slug>.webp.
  var HAS_IMAGE = {
    "collar-nudo-eterno": true,
    "aros-luna-chica": true,
    "pulsera-trenzada": true,
    "cadena-fina-oro": true,
    "dije-media-luna": true,
    "collar-rio": true,
    "collar-raiz": true,
  };

  // Dedicated higher-res PDP photo, where one was uploaded separately from
  // the card thumbnail.
  var MAIN_IMAGE = {
    "collar-nudo-eterno": "images/site/product-nudo-eterno-main.webp",
  };

  var CATALOG = [
    {
      title: "Collar Nudo Eterno",
      material: "Tejido a mano + plata",
      price: "$45.000",
      unique: true,
      tag: "Tejido a mano",
      category: "collares",
    },
    {
      title: "Aros Luna Chica",
      material: "Plata 925",
      price: "$22.000",
      unique: false,
      tag: "Plata 925",
      category: "aros",
    },
    {
      title: "Pulsera Trenzada",
      material: "Tejido a mano",
      price: "$18.500",
      unique: false,
      tag: "Tejido a mano",
      category: "pulseras",
    },
    {
      title: "Cadena Fina Oro",
      material: "Enchapado en oro",
      price: "$31.000",
      unique: false,
      tag: "Enchapado en oro",
      category: "cadenas",
    },
    {
      title: "Dije Media Luna",
      material: "Plata 925",
      price: "$26.000",
      unique: true,
      tag: "Plata 925",
      category: "dijes",
    },
    {
      title: "Collar Río",
      material: "Tejido a mano + plata",
      price: "$52.000",
      unique: true,
      tag: "Tejido a mano",
      category: "collares",
    },
    {
      title: "Collar Raíz",
      material: "Tejido a mano + plata",
      price: "$47.000",
      unique: true,
      tag: "Tejido a mano",
      category: "collares",
    },
    {
      title: "Aros Gota Única",
      material: "Plata 925",
      price: "$24.000",
      unique: true,
      tag: "Plata 925",
      category: "aros",
    },
    {
      title: "Collar Gota Plata",
      material: "Plata 925",
      price: "$38.500",
      unique: false,
      tag: "Plata 925",
      category: "collares",
    },
    {
      title: "Collar Fino Oro",
      material: "Enchapado en oro",
      price: "$29.000",
      unique: false,
      tag: "Enchapado en oro",
      category: "collares",
    },
    {
      title: "Collar Trenza Beige",
      material: "Tejido a mano",
      price: "$21.000",
      unique: false,
      tag: "Tejido a mano",
      category: "collares",
    },
    {
      title: "Collar Doble Vuelta",
      material: "Plata 925",
      price: "$41.000",
      unique: false,
      tag: "Plata 925",
      category: "collares",
    },
    {
      title: "Collar Sol",
      material: "Enchapado en oro",
      price: "$33.500",
      unique: false,
      tag: "Enchapado en oro",
      category: "collares",
    },
    {
      title: "Collar Cuentas Naturales",
      material: "Tejido a mano",
      price: "$24.000",
      unique: false,
      tag: "Tejido a mano",
      category: "collares",
    },
    {
      title: "Collar Media Luna",
      material: "Plata 925",
      price: "$36.000",
      unique: false,
      tag: "Plata 925",
      category: "collares",
    },
    {
      title: "Collar Hilo Dorado",
      material: "Enchapado en oro",
      price: "$27.500",
      unique: false,
      tag: "Enchapado en oro",
      category: "collares",
    },
    {
      title: "Collar Simple Plata",
      material: "Plata 925",
      price: "$19.500",
      unique: false,
      tag: "Plata 925",
      category: "collares",
    },
  ].map(function (p) {
    p.slug = slugify(p.title);
    p.image = HAS_IMAGE[p.slug] ? "images/site/card-" + p.slug + ".webp" : null;
    p.mainImage = MAIN_IMAGE[p.slug] || p.image;
    return p;
  });

  function bySlug(slug) {
    for (var i = 0; i < CATALOG.length; i++) {
      if (CATALOG[i].slug === slug) return CATALOG[i];
    }
    return null;
  }

  function byTitle(title) {
    return bySlug(slugify(title));
  }

  function byCategory(category) {
    return CATALOG.filter(function (p) {
      return p.category === category;
    });
  }

  // Renders a <div class="product-card"> node. `href` defaults to the
  // product's own page; every catalog entry currently shares one PDP
  // template (producto.html), mirroring the design prototype which also
  // linked every card to a single Producto.dc.html.
  function renderProductCard(product, opts) {
    opts = opts || {};
    var href =
      opts.href || "producto.html?slug=" + encodeURIComponent(product.slug);
    var wrap = document.createElement("div");
    wrap.className = "product-card";

    var media = document.createElement("div");
    media.className = "card-media";
    if (product.image) {
      var img = document.createElement("img");
      img.src = product.image;
      img.alt = product.title;
      img.className = "card-img primary";
      img.loading = "lazy";
      media.appendChild(img);

      var hoverImg = document.createElement("img");
      hoverImg.src = "images/site/home-lookbook-2.webp";
      hoverImg.alt = product.title + " en uso";
      hoverImg.className = "card-img hover-img";
      hoverImg.loading = "lazy";
      media.appendChild(hoverImg);
    } else {
      var ph = document.createElement("div");
      ph.className = "placeholder-fill";
      ph.textContent = "foto: " + product.title.toLowerCase();
      media.appendChild(ph);
    }
    if (product.unique) {
      var badge = document.createElement("span");
      badge.className = "card-badge";
      badge.textContent = "Pieza única";
      media.appendChild(badge);
    }
    wrap.appendChild(media);

    var info = document.createElement("a");
    info.className = "card-info";
    info.href = href;
    info.innerHTML =
      '<span class="card-title">' +
      product.title +
      "</span>" +
      '<span class="card-material">' +
      product.material +
      "</span>" +
      '<span class="card-price">' +
      product.price +
      "</span>";
    wrap.appendChild(info);

    var addBtn = document.createElement("button");
    addBtn.type = "button";
    addBtn.className = "card-add-btn";
    addBtn.textContent = "Agregar al carrito";
    addBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      var prevText = addBtn.textContent;
      addBtn.textContent = "¡Agregado!";
      addBtn.classList.add("added");
      setTimeout(function () {
        addBtn.textContent = prevText;
        addBtn.classList.remove("added");
      }, 1200);
    });
    wrap.appendChild(addBtn);

    return wrap;
  }

  global.Lula = global.Lula || {};
  global.Lula.slugify = slugify;
  global.Lula.CATALOG = CATALOG;
  global.Lula.bySlug = bySlug;
  global.Lula.byTitle = byTitle;
  global.Lula.byCategory = byCategory;
  global.Lula.renderProductCard = renderProductCard;
})(window);
