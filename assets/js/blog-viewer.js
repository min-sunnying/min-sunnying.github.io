document.addEventListener("DOMContentLoaded", function () {
  var viewers = document.querySelectorAll("[data-issue-viewer]");

  viewers.forEach(function (viewer) {
    var pages = Array.from(viewer.querySelectorAll("[data-issue-page]"));
    var previousButton = viewer.querySelector("[data-issue-prev]");
    var nextButton = viewer.querySelector("[data-issue-next]");
    var currentDisplay = viewer.querySelector("[data-issue-current]");
    var jumpButtons = Array.from(viewer.querySelectorAll("[data-issue-jump]"));
    var stage = viewer.querySelector(".issue-viewer__stage");
    var currentIndex = 0;

    if (!pages.length) {
      return;
    }

    function render(index) {
      currentIndex = Math.max(0, Math.min(index, pages.length - 1));

      pages.forEach(function (page, pageIndex) {
        var isActive = pageIndex === currentIndex;
        page.hidden = !isActive;
        page.classList.toggle("is-active", isActive);
      });

      jumpButtons.forEach(function (button, buttonIndex) {
        var isActive = buttonIndex === currentIndex;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-current", isActive ? "page" : "false");
      });

      if (currentDisplay) {
        currentDisplay.textContent = String(currentIndex + 1);
      }

      if (previousButton) {
        previousButton.disabled = currentIndex === 0;
      }

      if (nextButton) {
        nextButton.disabled = currentIndex === pages.length - 1;
      }
    }

    if (previousButton) {
      previousButton.addEventListener("click", function () {
        render(currentIndex - 1);
      });
    }

    if (nextButton) {
      nextButton.addEventListener("click", function () {
        render(currentIndex + 1);
      });
    }

    jumpButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        render(Number(button.dataset.issueJump));
      });
    });

    if (stage) {
      stage.addEventListener("keydown", function (event) {
        if (event.key === "ArrowRight") {
          event.preventDefault();
          render(currentIndex + 1);
        }

        if (event.key === "ArrowLeft") {
          event.preventDefault();
          render(currentIndex - 1);
        }
      });
    }

    pages.forEach(function (page) {
      page.addEventListener("click", function (event) {
        if (event.target.closest("a, button")) {
          return;
        }

        var bounds = page.getBoundingClientRect();
        var clickOffset = event.clientX - bounds.left;

        if (clickOffset > bounds.width / 2) {
          render(currentIndex + 1);
        } else {
          render(currentIndex - 1);
        }
      });
    });

    viewer.dataset.enhanced = "true";
    render(0);
  });
});
