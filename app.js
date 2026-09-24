const grid = document.querySelector("#archive-grid");
const count = document.querySelector("#archive-count");
const filterButtons = [...document.querySelectorAll(".filter-button")];
const sortSelect = document.querySelector("#sort-select");

let activeFilter = "all";
let activeSort = "recent";

function formatDate(value) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(`${value}T00:00:00`));
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function createCard(item) {
  const article = document.createElement("article");
  article.className = `card card--${item.type}`;

  if (item.type === "channel") {
    article.innerHTML = `
      <div class="channel-mark channel-mark--${item.accent}"></div>
      <p class="card-kind">Channel</p>
      <h2>${item.title}</h2>
      <p class="channel-description">${item.description}</p>
      <p class="card-meta">${item.count} blocks · ${formatDate(item.date)}</p>`;
  }

  if (item.type === "image") {
    article.innerHTML = `
      <img src="${item.image}" alt="${item.alt}" />
      <div class="card-footer"><h2>${item.title}</h2><time datetime="${item.date}">${formatDate(item.date)}</time></div>`;
  }

  if (item.type === "text") {
    article.innerHTML = `
      <p class="card-kind">Text</p>
      <blockquote>${item.text}</blockquote>
      <p class="card-meta">${item.source} · ${formatDate(item.date)}</p>`;
  }

  if (item.type === "link") {
    const link = document.createElement("a");
    link.href = item.url;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.className = "link-card-content";
    link.innerHTML = `<span class="link-arrow" aria-hidden="true">↗</span><p class="card-kind">Link</p><h2>${item.title}</h2><p class="link-domain">${item.domain}</p><time datetime="${item.date}">${formatDate(item.date)}</time>`;
    article.append(link);
  }
  return article;
}

function render() {
  let visible = activeFilter === "all"
    ? [...archiveBlocks]
    : archiveBlocks.filter((item) => activeFilter === "channel" ? item.type === "channel" : item.type !== "channel");

  visible = activeSort === "random"
    ? shuffle(visible)
    : visible.sort((a, b) => new Date(b.date) - new Date(a.date));

  grid.replaceChildren();
  count.textContent = `${visible.length} ${visible.length === 1 ? "item" : "items"}`;

  if (!visible.length) {
    grid.append(document.querySelector("#empty-state-template").content.cloneNode(true));
    return;
  }
  visible.forEach((item) => grid.append(createCard(item)));
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((item) => {
      const selected = item === button;
      item.classList.toggle("is-active", selected);
      item.setAttribute("aria-pressed", selected);
    });
    render();
  });
});

sortSelect.addEventListener("change", (event) => {
  activeSort = event.target.value;
  render();
});

render();
