// ========================================
// Kakao REST API KEY
// ========================================

const KAKAO_REST_API_KEY = "c8f970f0c1d35908375188a0d3f83678";

// ========================================
// 1. 기본 책 검색
// ========================================

async function searchBooks(query) {
  const url =
    `https://dapi.kakao.com/v3/search/book?` +
    `query=${encodeURIComponent(query)}` +
    `&target=title` +
    `&size=10`;

  const response = await fetch(url, {
    method: "GET",

    headers: {
      Authorization: `KakaoAK c8f970f0c1d35908375188a0d3f83678`,
    },
  });

  if (!response.ok) {
    throw new Error("도서 데이터를 불러오지 못했습니다.");
  }

  const data = await response.json();

  return data.documents;
}

// ========================================
// 2. 오늘의 선택
// 최신순 도서
// ========================================

async function getLatestBooks(query) {
  const url =
    `https://dapi.kakao.com/v3/search/book?` +
    `query=${encodeURIComponent(query)}` +
    `&sort=latest` +
    `&size=50`;

  const response = await fetch(url, {
    method: "GET",

    headers: {
      Authorization: `KakaoAK c8f970f0c1d35908375188a0d3f83678`,
    },
  });

  if (!response.ok) {
    throw new Error("최신 도서를 불러오지 못했습니다.");
  }

  const data = await response.json();

  // 오늘 날짜
  const today = new Date();

  // 1년 전
  const oneYearAgo = new Date();

  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  // 제외할 단어
  const excludeWords = [
    "시험",
    "자격증",
    "기출",
    "수험",
    "취업",
    "문제집",
    "교재",
    "공무원",
    "수능",
    "초등",
    "중등",
    "고등",
    "모의고사",
    "월간",
    "계간",
  ];

  const filteredBooks = data.documents.filter(function (book) {
    // 출간일이 없으면 제외
    if (!book.datetime) {
      return false;
    }

    // 썸네일이 없으면 제외
    if (!book.thumbnail) {
      return false;
    }

    const publishDate = new Date(book.datetime);

    // 제외 단어 확인
    const hasExcludeWord = excludeWords.some(function (word) {
      return book.title.includes(word);
    });

    // 최근 1년
    const isRecent = publishDate >= oneYearAgo && publishDate <= today;

    return !hasExcludeWord && isRecent;
  });

  // 최신순 정렬
  filteredBooks.sort(function (a, b) {
    return new Date(b.datetime) - new Date(a.datetime);
  });

  return filteredBooks;
}

// ========================================
// 3. 베스트셀러 목록
// ========================================

const bestBookLists = {
  // 종합
  total: [
    "기억의 무늬",
    "서리꽃 세트",
    "그랬다고 적었다",
    "오뒷세이아",
    "독성 인간",
    "투명한 나선",
  ],

  // 국내도서
  korea: ["모순", "소년이 온다", "채식주의자", "불편한 편의점", "아몬드"],

  // 외국도서
  foreign: [
    "Wonder",
    "People We Meet on Vacation",
    "The Daily Stoic",
    "Number the Stars",
    "Frindle",
  ],
};

// ========================================
// 4. 베스트셀러 가져오기
// ========================================

async function getBestBooks(type = "total") {
  const titles = bestBookLists[type] || bestBookLists.total;

  const requests = titles.map(async function (title) {
    try {
      const books = await searchBooks(title);

      // 정확한 제목 우선 찾기
      const exactBook = books.find(function (book) {
        return book.title.replace(/\s/g, "").includes(title.replace(/\s/g, ""));
      });

      return exactBook || books[0] || null;
    } catch (error) {
      console.error(title, "검색 실패", error);

      return null;
    }
  });

  const books = await Promise.all(requests);

  return books.filter(Boolean);
}

// ========================================
// 5. MD 추천 도서 제목
// ========================================

const mdBookTitles = [
  "어두운 집",
  "안녕하세요, 제법 버스기사 같나요?",
  "운동 여우 1",
  "칵테일을 마시는 철학자들",
  "서열 사회",
  "오디세이 각본집",
];

// ========================================
// 6. MD 추천 도서 가져오기
// ========================================

async function getMdBooks() {
  const requests = mdBookTitles.map(async function (title) {
    try {
      const books = await searchBooks(title);

      // 검색 결과가 없을 경우
      if (!books || books.length === 0) {
        return null;
      }

      // 가능한 한 제목이 비슷한 책 선택
      const exactBook = books.find(function (book) {
        const bookTitle = book.title.replace(/\s/g, "").toLowerCase();

        const searchTitle = title.replace(/\s/g, "").toLowerCase();

        return bookTitle.includes(searchTitle);
      });

      return exactBook || books[0];
    } catch (error) {
      console.error("MD 추천 검색 실패:", title, error);

      return null;
    }
  });

  const books = await Promise.all(requests);

  // 데이터가 없는 책 제거
  return books.filter(Boolean);
}
// ========================================
// 7.출판사 추천 도서 제목
// ========================================

const publisherBookTitles = [
  "오디세이아 고대 그리스어 완역본",
  "기억의 무늬",
  "첫째 아이 마음 아프지 않게, 둘째 아이 마음 흔들리지 않게",
  "한국사 그림과 키워드로 요점 정리",
  "부자의 영수증",
  "인 더 메가처치",
];

// ========================================
// 8.출판사 추천 도서 가져오기
// ========================================

async function getPublisherBooks() {
  const requests = publisherBookTitles.map(async function (title) {
    try {
      const books = await searchBooks(title);

      if (!books || books.length === 0) {
        return null;
      }

      const exactBook = books.find(function (book) {
        const bookTitle = book.title.replace(/\s/g, "").toLowerCase();

        const searchTitle = title.replace(/\s/g, "").toLowerCase();

        return bookTitle.includes(searchTitle);
      });

      return exactBook || books[0];
    } catch (error) {
      console.error("출판사 추천 검색 실패:", title, error);

      return null;
    }
  });

  const books = await Promise.all(requests);

  return books.filter(Boolean);
}
// ========================================
// 9. 트렌드+ 추천 도서 제목
// ========================================

const trendBookTitles = [
  "기쁨에도 슬픔에도 아랑곳없이",
  "신경 끄기의 기술 한교동 에디션",
  "도그 스타",
  "오늘은 좀 돌아가 볼까",
  "존재의 세 가지 거짓말",
  "초밥이 여행을 갔어요",
];

// ========================================
// 10. 트렌드+ 추천 도서 가져오기
// ========================================

async function getTrendBooks() {
  const requests = trendBookTitles.map(async function (title) {
    try {
      const books = await searchBooks(title);

      // 검색 결과가 없으면 제외
      if (!books || books.length === 0) {
        return null;
      }

      // 최대한 정확한 제목 찾기
      const exactBook = books.find(function (book) {
        const bookTitle = book.title.replace(/\s/g, "").toLowerCase();

        const searchTitle = title.replace(/\s/g, "").toLowerCase();

        return bookTitle.includes(searchTitle);
      });

      return exactBook || books[0];
    } catch (error) {
      console.error("트렌드+ 검색 실패:", title, error);

      return null;
    }
  });

  const books = await Promise.all(requests);

  return books.filter(Boolean);
}
// ========================================
// 랭킹 베스트 도서
// ========================================

const rankingBookLists = {
  total: [
    "세네카 오늘을 빼앗기고 있는 당신에게",
    "은 욕망의 세계",
    "오디세이아",
    "싯다르타",
    "신경 끄기의 기술",
    "소년이 온다",
    "작별하지 않는다",
    "채식주의자",
    "모순",
    "아몬드",
  ],

  korea: [
    "싯다르타",
    "모순",
    "아주 작은 습관의 힘",
    "데미안",
    "돈, 뜨겁게 사랑하고 차갑게 다루어라",
    "프로젝트 헤일메리",
    "오뒷세이아",
    "브람스를 좋아하세요",
    "불안",
    "긴긴밤",
  ],

  foreign: [
    "Wonder",
    "People We Meet on Vacation",
    "The Daily Stoic",
    "Number the Stars",
    "Holes",
    "The Tiger Rising",
    "Frindle",
    "The Odyssey: The Complete Screenplay",
    "LEGO Marvel Spider-Man Explore the Spider-Verse",
    "Better Than the Movies",
  ],
};

// ========================================
// 랭킹 베스트 가져오기
// ========================================

async function getRankingBooks(type = "total") {
  const titles = rankingBookLists[type] || rankingBookLists.total;

  const requests = titles.map(async function (title) {
    try {
      const books = await searchBooks(title);

      if (!books || books.length === 0) {
        return null;
      }

      const exactBook = books.find(function (book) {
        const bookTitle = book.title.replace(/\s/g, "").toLowerCase();

        const searchTitle = title.replace(/\s/g, "").toLowerCase();

        return bookTitle.includes(searchTitle);
      });

      return exactBook || books[0];
    } catch (error) {
      console.error("랭킹 검색 실패:", title, error);

      return null;
    }
  });

  const books = await Promise.all(requests);

  return books.filter(Boolean);
}
