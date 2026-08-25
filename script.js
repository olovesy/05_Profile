document.addEventListener("DOMContentLoaded", function () {
  /* work 이미지 수동 슬라이더: 자동 재생 없음 */
  const workList = document.querySelector(".work_list");

  if (workList && window.gsap) {
    const originalItems = Array.from(workList.children);
    const prevButton = document.querySelector(".work_prev");
    const nextButton = document.querySelector(".work_next");
    const dotsArea = document.querySelector(".work_dots");
    let currentIndex = 0;
    let isDragging = false;
    let didDrag = false;
    let startX = 0;
    let startTranslate = 0;
    let currentTranslate = 0;

    function getStep() {
      return originalItems[1]
        ? originalItems[1].offsetLeft - originalItems[0].offsetLeft
        : originalItems[0].offsetWidth;
    }

    function getVisibleCount() {
      if (window.innerWidth <= 760) return 1;
      if (window.innerWidth <= 1180) return 2;
      return 3;
    }

    function getMaxStartIndex() {
      return Math.max(0, originalItems.length - getVisibleCount());
    }

    function updateDots() {
      dotsArea.querySelectorAll("button").forEach(function (dot, index) {
        const isActive = index === currentIndex;
        dot.classList.toggle("active", isActive);
        dot.setAttribute("aria-current", isActive ? "true" : "false");
      });

      originalItems.forEach(function (item, index) {
        item.classList.toggle("is-selected", index === currentIndex);
        item.setAttribute("aria-selected", index === currentIndex ? "true" : "false");
      });

      prevButton.disabled = currentIndex === 0;
      nextButton.disabled = currentIndex === originalItems.length - 1;
    }

    function goToSlide(index, animate) {
      currentIndex = Math.max(0, Math.min(originalItems.length - 1, index));
      const trackIndex = Math.min(currentIndex, getMaxStartIndex());
      const target = -getStep() * trackIndex;
      updateDots();

      gsap.to(workList, {
        x: target,
        duration: animate === false ? 0 : 0.55,
        ease: "power2.inOut",
        onUpdate: function () {
          currentTranslate = Number(gsap.getProperty(workList, "x"));
        }
      });
    }

    originalItems.forEach(function (_, index) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", "Go to project " + (index + 1));
      dot.addEventListener("click", function () {
        goToSlide(index, true);
      });
      dotsArea.appendChild(dot);
    });

    originalItems.forEach(function (item, index) {
      item.setAttribute("role", "option");
      item.setAttribute("tabindex", "0");
      item.addEventListener("click", function () {
        goToSlide(index, true);
      });
      item.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          goToSlide(index, true);
        }
      });
    });

    prevButton.addEventListener("click", function () {
      goToSlide(currentIndex - 1, true);
    });

    nextButton.addEventListener("click", function () {
      goToSlide(currentIndex + 1, true);
    });

    workList.addEventListener("pointerdown", function (event) {
      isDragging = true;
      didDrag = false;
      startX = event.clientX;
      startTranslate = currentTranslate;
      workList.setPointerCapture(event.pointerId);
      workList.classList.add("is-dragging");
      gsap.killTweensOf(workList);
    });

    workList.addEventListener("pointermove", function (event) {
      if (!isDragging) return;

      if (Math.abs(event.clientX - startX) > 8) didDrag = true;
      const nextX = startTranslate + event.clientX - startX;
      currentTranslate = nextX;
      gsap.set(workList, { x: nextX });
    });

    function finishDrag(event) {
      if (!isDragging) return;

      isDragging = false;
      workList.classList.remove("is-dragging");

      if (workList.hasPointerCapture(event.pointerId)) {
        workList.releasePointerCapture(event.pointerId);
      }

      const moved = event.clientX - startX;
      if (Math.abs(moved) > 45) {
        goToSlide(currentIndex + (moved < 0 ? 1 : -1), true);
      } else {
        goToSlide(currentIndex, true);
      }
    }

    workList.addEventListener("pointerup", finishDrag);
    workList.addEventListener("pointercancel", finishDrag);
    workList.addEventListener("click", function (event) {
      if (!didDrag) return;
      event.preventDefault();
      event.stopPropagation();
      didDrag = false;
    }, true);

    window.addEventListener("resize", function () {
      goToSlide(currentIndex, false);
    });

    updateDots();
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
});
