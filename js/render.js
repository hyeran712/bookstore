// ========================================
// 공통 책 카드
// ========================================

function createBookCard(book) {
  return `
    <div class="book-card">

      <img
        src="${book.thumbnail}"
        alt="${book.title}"
      >

      <h3>${book.title}</h3>

      <p class="author">
        ${book.authors.join(", ")}
      </p>

    </div>
  `;
}

// ========================================
// 오늘의 선택 렌더링
// ========================================

function renderTodayBooks(books) {
  const container = document.querySelector("#todayBookList");

  if (!books || books.length === 0) {
    container.innerHTML = "";
    return;
  }

  // 첫 번째 책 = 대표 책
  const mainBook = books[0];

  // 오른쪽 작은 책 3권
  const sideBooks = books.slice(1, 4);

  container.innerHTML = `

    <div class="today-main-book">

      <div class="main-book-image">

        <img
          src="${mainBook.thumbnail}"
          alt="${mainBook.title}"
        >

      </div>


      <div class="main-book-info">

        <h3>
          ${mainBook.title}
        </h3>

        <p class="author">
          ${mainBook.authors.join(", ")}
        </p>

        <p class="description">
          ${mainBook.contents || "책 소개가 준비 중입니다."}
        </p>

      </div>

    </div>


    <div class="today-side-books">

      ${sideBooks
        .map(function (book) {
          return `

            <div class="side-book">

              <img
                src="${book.thumbnail}"
                alt="${book.title}"
              >

              <h4>
                ${book.title}
              </h4>

            </div>

          `;
        })
        .join("")}

    </div>

  `;
}

// ========================================
// 베스트셀러 렌더링
// ========================================

function renderBestBooks(books) {
  const container = document.querySelector("#bestBookList");

  if (!books || books.length === 0) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = books
    .slice(0, 5)
    .map(function (book) {
      return createBookCard(book);
    })
    .join("");
}

// ========================================
// MD 추천 렌더링
// ========================================

function renderMdBooks(books) {
  const container = document.querySelector("#mdBookList");

  if (!books || books.length === 0) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = "";

  books.slice(0, 6).forEach(function (book) {
    const card = document.createElement("div");

    card.className = "md-card";

    card.innerHTML = `

        <img
          src="${book.thumbnail}"
          alt="${book.title}"
        >

        <h3>
          ${book.title}
        </h3>

      `;

    container.appendChild(card);
  });
}

// ========================================
// 출판사 추천 렌더링
// ========================================

function renderPublisherBooks(books) {
  const container = document.querySelector("#publisherBookList");

  if (!books || books.length === 0) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = "";

  books.slice(0, 6).forEach(function (book) {
    const card = document.createElement("div");

    card.className = "publisher-card";

    card.innerHTML = `

        <img
          src="${book.thumbnail}"
          alt="${book.title}"
        >

        <h3>
          ${book.title}
        </h3>

      `;

    container.appendChild(card);
  });
}

// ========================================
// 트렌드+ 추천 렌더링
// ========================================

function renderTrendBooks(books) {
  const container = document.querySelector("#trendBookList");

  if (!books || books.length === 0) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = "";

  books.slice(0, 6).forEach(function (book) {
    const card = document.createElement("div");

    card.className = "trend-card";

    card.innerHTML = `

        <img
          src="${book.thumbnail}"
          alt="${book.title}"
        >

        <h3>
          ${book.title}
        </h3>

      `;

    container.appendChild(card);
  });
}
// ========================================
// 랭킹 도서 렌더링
// ========================================

function renderRankingBooks(books) {
  const container = document.querySelector("#rankingBookList");

  if (!books || books.length === 0) {
    container.innerHTML = "";

    return;
  }

  container.innerHTML = "";

  books.slice(0, 10).forEach(function (book, index) {
    const card = document.createElement("div");

    card.className = "ranking-card";

    card.innerHTML = `

        <div class="ranking-image">

          <img
            src="${book.thumbnail}"
            alt="${book.title}"
          >

          <span class="ranking-number">
            ${index + 1}
          </span>

        </div>


        <h3>
          ${book.title}
        </h3>

      `;

    container.appendChild(card);
  });
}
