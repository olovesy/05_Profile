document.addEventListener("DOMContentLoaded", function () {
  /* 섹션 제목이 위에서 아래로 나타나는 효과 */
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    const commonTextSelector = [
      ".maintitle",
      ".maintitle2",
      ".maintitle_small",
      ".title_small",
      ".subtitle",
      ".normalfont"
    ].join(", ");

    gsap.utils.toArray(commonTextSelector).forEach(function (textBlock) {
      const paragraphs = textBlock.querySelectorAll(":scope > p");
      const targets = paragraphs.length ? paragraphs : textBlock;

      gsap.from(targets, {
        y: -38,
        autoAlpha: 0,
        duration: 1.25,
        stagger: 0.12,
        ease: "power4.out",
        scrollTrigger: {
          trigger: textBlock,
          start: "top 82%",
          toggleActions: "play none none reverse"
        }
      });
    });
  }

  /* 로고를 누르면 페이지 맨 위로 이동 */
  const logoLink = document.querySelector(".logo a");

  if (logoLink) {
    logoLink.addEventListener("click", function (event) {
      event.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  /* 언어 번역 */
  const langButtons = document.querySelectorAll(".lang");
  const translateTexts = document.querySelectorAll("[data-en][data-ko]");

  langButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const lang = this.dataset.lang;

      translateTexts.forEach(function (text) {
        text.textContent = text.dataset[lang];
      });

      langButtons.forEach(function (btn) {
        btn.classList.remove("active");
      });

      langButtons.forEach(function (btn) {
        if (btn.dataset.lang === lang) {
          btn.classList.add("active");
        }
      });

      document.documentElement.lang = lang;
    });
  });

  /* 모바일 메뉴 버튼 */
  const mobileHeader = document.querySelector("#header .mobile");
  const menuButton = document.querySelector(".menu_btn");
  const mobileLinks = document.querySelectorAll("#header .mobile .m_nav a");

  if (mobileHeader && menuButton) {
    menuButton.addEventListener("click", function () {
      const isOpen = mobileHeader.classList.toggle("menu_open");
      menuButton.setAttribute("aria-expanded", isOpen);
    });

    mobileLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        mobileHeader.classList.remove("menu_open");
        menuButton.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* 커스텀 커서 */
  const cursorDot = document.querySelector(".cursor-dot");
  const cursorCircle = document.querySelector(".cursor-circle");

  if (cursorDot && cursorCircle) {
    let mouseX = 0;
    let mouseY = 0;
    let circleX = 0;
    let circleY = 0;

    document.addEventListener("mousemove", function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;

      cursorDot.style.left = mouseX + "px";
      cursorDot.style.top = mouseY + "px";
    });

    function moveCursor() {
      circleX += (mouseX - circleX) * 0.15;
      circleY += (mouseY - circleY) * 0.15;

      cursorCircle.style.left = circleX + "px";
      cursorCircle.style.top = circleY + "px";

      requestAnimationFrame(moveCursor);
    }

    moveCursor();

    document.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("mouseenter", function () {
        cursorCircle.classList.add("hover");
      });

      link.addEventListener("mouseleave", function () {
        cursorCircle.classList.remove("hover");
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
  const workSlider = document.querySelector(".work_slider");
  const workList = document.querySelector(".work_list");

  if (!workSlider || !workList || !window.gsap) return;

  const position = {
    x: 0
  };

  let minX = 0;
  let dragging = false;
  let previousX = 0;

  /* 이동할 수 있는 마지막 위치 계산 */
  function updateSlider() {
    minX = Math.min(
      0,
      workSlider.clientWidth - workList.scrollWidth
    );

    position.x = gsap.utils.clamp(minX, 0, position.x);

    gsap.set(workList, {
      x: position.x
    });
  }

// .work
window.addEventListener("load", () => {
  const slider = document.querySelector(".work_slider");
  const list = document.querySelector(".work_list");

  // .work 요소가 없으면 실행하지 않습니다.
  if (!slider || !list) return;

  // 원본 카드들을 복사해서 무한 슬라이드처럼 보이게 합니다.
  list.innerHTML += list.innerHTML;

  // 자동 가로 이동
  const autoSlide = gsap.to(list, {
    xPercent: -50,
    duration: 20,
    ease: "none",
    repeat: -1,
    paused: false
  });

  // 마우스를 올리면 멈추고, 벗어나면 다시 움직입니다.
  slider.addEventListener("mouseenter", () => {
    autoSlide.pause();
  });

  slider.addEventListener("mouseleave", () => {
    if (!isDragging) autoSlide.resume();
  });

  // 드래그에 필요한 변수
  let isDragging = false;
  let startX = 0;
  let startProgress = 0;

  // 마우스 또는 손가락을 누른 순간
  slider.addEventListener("pointerdown", (event) => {
    isDragging = true;
    startX = event.clientX;
    startProgress = autoSlide.progress();

    slider.classList.add("dragging");
    slider.setPointerCapture(event.pointerId);
    autoSlide.pause();
  });

  // 드래그하는 동안 카드 이동
  slider.addEventListener("pointermove", (event) => {
    if (!isDragging) return;

    const distance = event.clientX - startX;
    const moveAmount = distance / slider.clientWidth;

    autoSlide.progress(startProgress - moveAmount);
  });

  // 마우스 또는 손가락을 뗀 순간
  slider.addEventListener("pointerup", (event) => {
    isDragging = false;
    slider.classList.remove("dragging");
    slider.releasePointerCapture(event.pointerId);
    autoSlide.resume();
  });

  // 드래그가 취소된 경우
  slider.addEventListener("pointercancel", () => {
    isDragging = false;
    slider.classList.remove("dragging");
    autoSlide.resume();
  });
});


});
