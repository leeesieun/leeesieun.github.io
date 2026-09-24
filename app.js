const grid = document.querySelector("#archive-grid");
const filterButtons = [...document.querySelectorAll(".filter-button")];
const sortButtons = [...document.querySelectorAll(".sort-button")];
let activeFilter = "all";
let activeSort = "recent";

function shuffle(items) { return [...items].sort(() => Math.random() - 0.5); }

function createBlock(item) {
  const article = document.createElement("article");
  article.className = "archive-item";
  const content = item.image
    ? `<img src="${item.image}" alt="${item.title}" />`
    : "";
  article.innerHTML = `<div class="placeholder placeholder--${item.ratio}" aria-label="${item.image ? item.title : "Empty image block"}">${content}</div><p class="block-caption">${item.title}</p>`;
  return article;
}

function render() {
  let items = activeFilter === "channel" ? [] : [...archiveBlocks];
  if (activeSort === "random") items = shuffle(items);
  grid.replaceChildren(...items.map(createBlock));
  if (!items.length) grid.innerHTML = '<p class="empty-state">No channels yet.</p>';
}

function activate(buttons, selected) {
  buttons.forEach((button) => {
    const isSelected = button === selected;
    button.classList.toggle("is-active", isSelected);
    button.setAttribute("aria-pressed", isSelected);
  });
}

filterButtons.forEach((button) => button.addEventListener("click", () => {
  activeFilter = button.dataset.filter;
  activate(filterButtons, button);
  render();
}));
sortButtons.forEach((button) => button.addEventListener("click", () => {
  activeSort = button.dataset.sort;
  activate(sortButtons, button);
  render();
}));
render();
