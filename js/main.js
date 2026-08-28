// ================================
// 1. 페이지 처음 실행
// ================================
async function init() {
  // 메인 배너 슬라이드
  setupMainBanner();

  // 메인 배너 책 표지
  await loadBannerBooks();

  // 오늘의 선택
  await loadTodayBooks("경제 교양");

  // 오늘의 선택 탭
  setupTodayTabs();

  // 베스트셀러
  await loadBestBooks("total");

  // 베스트셀러 탭
  setupBestTabs();

  // MD 추천
  await loadMdBooks();

  // 출판사 추천
  await loadPublisherBooks();

  // 트렌드+ 추천
  await loadTrendBooks();

  // 랭킹
  await loadRankingBooks("total");

  // 랭킹 탭
  setupRankingTabs();
}

// ================================
// 2. 메인 배너 책 제목
// ================================

const bannerBookTitles = [
  "기억의 무늬",
  "투명한 나선",
  "오뒷세이아",
  "독성 인간",
];

// ================================
// 3. 메인 배너 책 표지 불러오기
// ================================
async function loadBannerBooks() {
  const bookImages = document.querySelectorAll(".banner-book-image");

  const bannerSlides = document.querySelectorAll(".banner-slide");

  for (let i = 0; i < bannerBookTitles.length; i++) {
    try {
      const books = await searchBooks(bannerBookTitles[i]);

      if (!books || books.length === 0) {
        continue;
      }

      const targetTitle = bannerBookTitles[i].replace(/\s/g, "").toLowerCase();

      const exactBook = books.find(function (book) {
        const bookTitle = book.title.replace(/\s/g, "").toLowerCase();

        return bookTitle.includes(targetTitle);
      });

      const book = exactBook || books[0];

      // 배너 책 이미지
      if (bookImages[i]) {
        bookImages[i].src = book.thumbnail;

        bookImages[i].alt = book.title;
      }

      // =============================
      // 배너 전체 클릭
      // =============================

      if (bannerSlides[i]) {
        bannerSlides[i].style.cursor = "pointer";

        bannerSlides[i].addEventListener("click", function (event) {
          // 이전/다음 버튼을 눌렀을 때는
          // 상세페이지로 가지 않게
          if (event.target.closest(".banner-controls")) {
            return;
          }

          window.location.href = `./sub.html?title=${encodeURIComponent(
            book.title,
          )}`;
        });
      }
    } catch (error) {
      console.error("배너 도서 불러오기 실패:", bannerBookTitles[i], error);
    }
  }
}

// ================================
// 4. 메인 배너 슬라이드
// ================================

function setupMainBanner() {
  const slides = document.querySelectorAll(".banner-slide");

  const prevButton = document.querySelector("#prevBanner");

  const nextButton = document.querySelector("#nextBanner");

  const currentText = document.querySelector("#bannerCurrent");

  const totalText = document.querySelector("#bannerTotal");

  // 배너가 없으면 함수 종료
  if (slides.length === 0) {
    return;
  }

  let currentIndex = 0;

  // 전체 배너 개수 표시
  if (totalText) {
    totalText.textContent = String(slides.length).padStart(2, "0");
  }

  // ================================
  // 배너 보여주는 함수
  // ================================

  function showBanner(index) {
    slides.forEach(function (slide) {
      slide.classList.remove("active");
    });

    slides[index].classList.add("active");

    if (currentText) {
      currentText.textContent = String(index + 1).padStart(2, "0");
    }
  }

  // ================================
  // 다음 배너
  // ================================

  function nextBanner() {
    currentIndex++;

    if (currentIndex >= slides.length) {
      currentIndex = 0;
    }

    showBanner(currentIndex);
  }

  // ================================
  // 이전 배너
  // ================================

  function prevBanner() {
    currentIndex--;

    if (currentIndex < 0) {
      currentIndex = slides.length - 1;
    }

    showBanner(currentIndex);
  }

  // ================================
  // 이전 버튼 클릭
  // ================================

  if (prevButton) {
    prevButton.addEventListener("click", prevBanner);
  }

  // ================================
  // 다음 버튼 클릭
  // ================================

  if (nextButton) {
    nextButton.addEventListener("click", nextBanner);
  }

  // 첫 번째 배너 표시
  showBanner(currentIndex);

  // ================================
  // 자동 슬라이드
  // 4초마다 다음 배너
  // ================================

  setInterval(function () {
    nextBanner();
  }, 4000);
}

// ================================
// 5. 오늘의 선택 최신 도서 불러오기
// ================================

async function loadTodayBooks(query) {
  try {
    const books = await getLatestBooks(query);

    renderTodayBooks(books);
  } catch (error) {
    console.error("최신 도서 불러오기 실패:", error);
  }
}

// ================================
// 6. 오늘의 선택 탭 클릭
// ================================

function setupTodayTabs() {
  const tabButtons = document.querySelectorAll(".today-tabs button");

  tabButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      // 클릭한 버튼의 검색어
      const query = button.dataset.query;

      // 최신순 책 불러오기
      loadTodayBooks(query);

      // 모든 active 제거
      tabButtons.forEach(function (btn) {
        btn.parentElement.classList.remove("active");
      });

      // 클릭한 버튼 active
      button.parentElement.classList.add("active");
    });
  });
}

// ================================
// 7. 베스트셀러 불러오기
// ================================

async function loadBestBooks(type) {
  try {
    const books = await getBestBooks(type);

    renderBestBooks(books);
  } catch (error) {
    console.error("베스트셀러 불러오기 실패:", error);
  }
}

// ================================
// 8. 베스트셀러 탭 클릭
// ================================

function setupBestTabs() {
  const tabButtons = document.querySelectorAll(".best-tabs button");

  tabButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      // total / korea / foreign
      const type = button.dataset.query;

      // 해당 베스트셀러 목록 불러오기
      loadBestBooks(type);

      // 모든 active 제거
      tabButtons.forEach(function (btn) {
        btn.parentElement.classList.remove("active");
      });

      // 클릭한 탭 active
      button.parentElement.classList.add("active");
    });
  });
}

// ================================
// 9. MD 추천
// ================================

async function loadMdBooks() {
  try {
    const books = await getMdBooks();

    renderMdBooks(books);
  } catch (error) {
    console.error("MD 추천 불러오기 실패:", error);
  }
}

// ================================
// 10. 출판사 추천
// ================================

async function loadPublisherBooks() {
  try {
    const books = await getPublisherBooks();

    renderPublisherBooks(books);
  } catch (error) {
    console.error("출판사 추천 불러오기 실패:", error);
  }
}

// ================================
// 11. 트렌드+ 추천 불러오기
// ================================

async function loadTrendBooks() {
  try {
    const books = await getTrendBooks();

    renderTrendBooks(books);
  } catch (error) {
    console.error("트렌드+ 추천 불러오기 실패:", error);
  }
}

// ================================
// 12. 랭킹 베스트 불러오기
// ================================

async function loadRankingBooks(type) {
  try {
    const books = await getRankingBooks(type);

    renderRankingBooks(books);
  } catch (error) {
    console.error("랭킹 도서 불러오기 실패:", error);
  }
}

// ================================
// 13. 랭킹 탭
// ================================

function setupRankingTabs() {
  const buttons = document.querySelectorAll(
    ".ranking-tabs button[data-ranking]",
  );

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      const type = button.dataset.ranking;

      loadRankingBooks(type);

      buttons.forEach(function (btn) {
        btn.parentElement.classList.remove("active");
      });

      button.parentElement.classList.add("active");
    });
  });
}

// ================================
// 실행
// ================================

init();
