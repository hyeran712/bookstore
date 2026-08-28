// ========================================
// 서브페이지 시작
// ========================================

async function initSubPage() {
  // URL에서 title 가져오기
  const params = new URLSearchParams(window.location.search);

  // title이 없으면 기본 책
  const title = params.get("title") || "기억의 무늬";

  // 책 불러오기
  await loadDetailBook(title);

  // 수량 버튼
  setupQuantity();

  // 구매 버튼
  setupPurchaseButtons();

  // 검색
  setupSubSearch();
}

// ========================================
// 책 상세정보 불러오기
// ========================================

async function loadDetailBook(title) {
  try {
    const books = await searchBooks(title);

    if (!books || books.length === 0) {
      showBookError();
      return;
    }

    // 검색 제목 정리
    const searchTitle = title.replace(/\s/g, "").toLowerCase();

    // 최대한 정확한 제목 찾기
    const exactBook = books.find(function (book) {
      const bookTitle = book.title.replace(/\s/g, "").toLowerCase();

      return bookTitle.includes(searchTitle);
    });

    const book = exactBook || books[0];

    renderDetailBook(book);
  } catch (error) {
    console.error("상세 도서 불러오기 실패:", error);

    showBookError();
  }
}

// ========================================
// 상세정보 화면 출력
// ========================================

function renderDetailBook(book) {
  // ========================================
  // 가격
  // ========================================

  const price = book.sale_price > 0 ? book.sale_price : book.price;

  const originalPrice = book.price;

  let discountRate = 0;

  if (originalPrice > 0 && price > 0 && originalPrice > price) {
    discountRate = Math.round(((originalPrice - price) / originalPrice) * 100);
  }

  // ========================================
  // 적립금 5%
  // ========================================

  const point = Math.floor(price * 0.05);

  // ========================================
  // 날짜
  // ========================================

  let publishDate = "-";

  if (book.datetime) {
    const date = new Date(book.datetime);

    publishDate =
      `${date.getFullYear()}.` +
      `${String(date.getMonth() + 1).padStart(2, "0")}.` +
      `${String(date.getDate()).padStart(2, "0")}`;
  }

  // ========================================
  // 저자
  // ========================================

  const authors =
    book.authors && book.authors.length > 0
      ? book.authors.join(", ")
      : "저자 정보 없음";

  // ========================================
  // 책소개
  // ========================================

  const description = book.contents || "책 소개가 준비 중입니다.";

  // ========================================
  // 상단 정보 출력
  // ========================================

  setText("#detailTitle", book.title);

  setText("#breadcrumbTitle", book.title);

  setText("#detailAuthors", authors);

  setText("#detailPublisher", book.publisher || "-");

  setText("#detailDate", publishDate);

  setText("#detailContents", description);

  setText("#detailPrice", `${price.toLocaleString()}원`);

  setText("#detailPoint", `${point.toLocaleString()}P`);

  // ========================================
  // 할인율 / 정가
  // ========================================

  setText("#discountRate", `${discountRate}%`);

  setText("#originalPrice", `${originalPrice.toLocaleString()}원`);

  // ========================================
  // 표지
  // ========================================

  const image = document.querySelector("#detailThumbnail");

  if (image) {
    image.src = book.thumbnail || "";

    image.alt = book.title;
  }

  // ========================================
  // 상세내용
  // ========================================

  setText("#longDescription", description);

  setText("#infoTitle", book.title);

  setText("#infoAuthors", authors);

  setText("#infoPublisher", book.publisher || "-");

  setText("#infoDate", publishDate);

  setText("#infoIsbn", book.isbn || "-");

  setText("#authorName", authors);

  // ========================================
  // 기억의 무늬 상세 이미지
  // ========================================

  const detailImageArea = document.querySelector("#detailImageArea");

  if (detailImageArea) {
    // 먼저 이미지 영역 비우기
    detailImageArea.innerHTML = "";

    // 기억의 무늬일 때만 표시
    if (book.title.includes("기억의 무늬")) {
      detailImageArea.innerHTML = `
        <img
          src="./img/sub/memory.jpg"
          alt="기억의 무늬 상세 이미지"
        >
      `;
    }
  }

  // ========================================
  // 브라우저 제목
  // ========================================

  document.title = `${book.title} | BOOKSTORE`;
}

// ========================================
// 텍스트 넣는 공통 함수
// ========================================

function setText(selector, text) {
  const element = document.querySelector(selector);

  if (element) {
    element.textContent = text;
  }
}

// ========================================
// 책을 못 찾았을 때
// ========================================

function showBookError() {
  setText("#detailTitle", "도서 정보를 찾을 수 없습니다.");

  setText("#detailContents", "다른 책을 검색해보세요.");

  const detailImageArea = document.querySelector("#detailImageArea");

  if (detailImageArea) {
    detailImageArea.innerHTML = "";
  }
}

// ========================================
// 수량 조절
// ========================================

function setupQuantity() {
  const minusBtn = document.querySelector("#minusBtn");

  const plusBtn = document.querySelector("#plusBtn");

  const quantityText = document.querySelector("#quantity");

  if (!minusBtn || !plusBtn || !quantityText) {
    return;
  }

  let quantity = 1;

  minusBtn.addEventListener("click", function () {
    if (quantity > 1) {
      quantity--;

      quantityText.textContent = quantity;
    }
  });

  plusBtn.addEventListener("click", function () {
    quantity++;

    quantityText.textContent = quantity;
  });
}

// ========================================
// 장바구니 / 구매 버튼
// ========================================

function setupPurchaseButtons() {
  const cartButton = document.querySelector("#cartButton");

  const buyButton = document.querySelector("#buyButton");

  if (cartButton) {
    cartButton.addEventListener("click", function () {
      alert("장바구니에 담았습니다.");
    });
  }

  if (buyButton) {
    buyButton.addEventListener("click", function () {
      alert("구매 페이지로 이동합니다.");
    });
  }
}

// ========================================
// 서브페이지 검색
// ========================================

function setupSubSearch() {
  const input = document.querySelector("#searchInput");

  const button = document.querySelector("#searchBtn");

  if (!input || !button) {
    return;
  }

  function search() {
    const query = input.value.trim();

    if (!query) {
      alert("검색어를 입력해주세요.");

      return;
    }

    window.location.href = `./sub.html?title=${encodeURIComponent(query)}`;
  }

  button.addEventListener("click", search);

  input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      search();
    }
  });
}

// ========================================
// 실행
// ========================================

initSubPage();
