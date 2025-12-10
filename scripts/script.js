// 1. ДАНІ (Масив об'єктів)
const articles = [
  {
    id: 1,
    title: "Основи JavaScript (ES6+)",
    author: "Ольга Шутилєва",
    date: "2025-10-10",
    category: "JavaScript",
    tags: ["JS", "Basics", "ES6"],
    content: "Коротко про let/const, стрілкові функції та шаблони рядків. З чого почати роботу з JS у 2025 році.",
  },
  {
    id: 2,
    title: "Гнучкі макети з Flexbox",
    author: "Дмитро Коваленко",
    date: "2025-10-08",
    category: "CSS",
    tags: ["CSS", "Flexbox", "WebDesign"],
    content: "Flexbox допомагає будувати адаптивні макети з мінімумом коду. Розглядаємо justify-content та align-items.",
  },
  {
    id: 3,
    title: "Семантика HTML5",
    author: "Ірина Чорна",
    date: "2025-10-05",
    category: "HTML",
    tags: ["HTML", "SEO", "Semantic"],
    content: "Навіщо використовувати header, main, article та інші семантичні теги для покращення SEO.",
  },
  {
    id: 4,
    title: "Методи масивів: map, filter, reduce",
    author: "Роман Гриценко",
    date: "2025-10-13",
    category: "JavaScript",
    tags: ["Arrays", "FunctionalProgramming"],
    content: "Практика з методами масивів. Як писати чистий код без циклів for.",
  },
];

// 2. ОТРИМАННЯ ЕЛЕМЕНТІВ DOM
const postsContainer = document.querySelector("#blog-posts");
const counterEl = document.querySelector("#counter");
const toolbar = document.querySelector("#toolbar");
const btnAll = document.querySelector("#btnAll");
const searchInput = document.querySelector("#searchTitle");
const searchBtn = document.querySelector("#searchBtn");

// 3. ФУНКЦІЇ

// Завдання: Створити функцію countArticles(list), яка повертає кількість
const countArticles = (list) => list.length;

// Завдання: renderArticle з стрілковими функціями та шаблонними рядками
const renderArticle = ({ title, author, date, category, tags = [], content }) => `
  <article class="post" data-category="${category}">
    <h2>${title}</h2>
    <p class="meta">
      Автор: <b>${author}</b> | Категорія: <i>${category}</i> | 
      Дата: ${new Date(date).toLocaleDateString("uk-UA")}
    </p>
    <p>${content}</p>
    <div class="tags">
      ${tags.map(t => `<span class="tag">#${t}</span>`).join("")}
    </div>
  </article>
`;

// Завдання: renderAll з використанням map()
const renderAll = (list = articles) => {
  postsContainer.innerHTML = list.map(renderArticle).join("");
  const count = countArticles(list);
  counterEl.textContent = `Кількість публікацій: ${count}`;
};

// Завдання: filterByCategory з використанням filter()
const filterByCategory = (category) => 
  articles.filter(item => item.category.toLowerCase() === category.toLowerCase());

// Додатково: Пошук findByTitle
const findByTitle = (query) => 
  articles.find(item => item.title.toLowerCase().includes(query.toLowerCase()));

// 4. Унікальні категорії і кнопки
const renderCategoryButtons = () => {
  const categories = Array.from(new Set(articles.map(a => a.category))).sort();
  
  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "btn";
    btn.textContent = cat;
    btn.dataset.filter = cat;
    btn.setAttribute("aria-pressed", "false");
    
    // Вставляємо кнопку після кнопки "Усі"
    toolbar.appendChild(btn);
  });
};

// 5. ОБРОБНИКИ ПОДІЙ

// Делегування подій для кнопок фільтрації
toolbar.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn");
  if (!btn || btn.id === "searchBtn") return;

  // скидаємо активні стани
  toolbar.querySelectorAll(".btn[data-filter], #btnAll").forEach(b => b.setAttribute("aria-pressed", "false")
  );
  
  // Робимо активною натиснуту кнопку
  btn.setAttribute("aria-pressed", "true");

  // Логіка фільтрації
  if (btn.id === "btnAll") {
    renderAll(articles);
  } else {
    const category = btn.dataset.filter;
    const filteredList = filterByCategory(category);
    renderAll(filteredList);
    // Для перевірки у консолі
    console.log(`Відфільтровано по категорії "${category}":`, filteredList);
  }
});

// Пошук
const handleSearch = () => {
  const query = searchInput.value.trim();
  if (!query) {
    renderAll(articles);
    return;
  }

  // Використовуємо find() (знаходить лише один елемент)
  const foundArticle = findByTitle(query);

  if (foundArticle) {
    // Якщо знайшли - відображаємо тільки його
    renderAll([foundArticle]);
    console.log("Знайдена стаття:", foundArticle);
  } else {
    postsContainer.innerHTML = `<p>На жаль, за запитом "${query}" нічого не знайдено.</p>`;
    counterEl.textContent = "Кількість публікацій: 0";
  }
};

searchBtn.addEventListener("click", handleSearch);
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleSearch();
});

// 6. Ініціалізація
renderCategoryButtons();
renderAll(articles);