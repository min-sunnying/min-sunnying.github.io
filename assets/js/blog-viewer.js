document.addEventListener("DOMContentLoaded", function () {
  var pdfWorkerSource = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  var viewers = document.querySelectorAll("[data-issue-viewer]");

  viewers.forEach(function (viewer) {
    if (viewer.dataset.pdfSrc) {
      setupPdfViewer(viewer);
      return;
    }

    setupStaticViewer(viewer);
  });

  function setupStaticViewer(viewer) {
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
  }

  function setupPdfViewer(viewer) {
    var pdfSource = viewer.dataset.pdfSrc;
    var previousButton = viewer.querySelector("[data-issue-prev]");
    var nextButton = viewer.querySelector("[data-issue-next]");
    var currentDisplay = viewer.querySelector("[data-issue-current]");
    var totalDisplay = viewer.querySelector("[data-issue-total]");
    var pagination = viewer.querySelector("[data-issue-pagination]");
    var stage = viewer.querySelector(".issue-viewer__stage");
    var pdfPage = viewer.querySelector("[data-issue-pdf-page]");
    var canvas = viewer.querySelector("[data-issue-canvas]");
    var loading = viewer.querySelector("[data-issue-loading]");
    var folio = viewer.querySelector("[data-issue-folio]");
    var jumpButtons = [];
    var currentPage = 1;
    var pdfDocument = null;
    var renderTask = null;
    var resizeTimer = null;

    if (!canvas || typeof window.pdfjsLib === "undefined") {
      setStatus("PDF viewer failed to load.", true);
      return;
    }

    window.pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerSource;

    function setStatus(message, isError) {
      if (!loading) {
        return;
      }

      loading.hidden = false;
      loading.textContent = message;
      loading.classList.toggle("is-error", Boolean(isError));
    }

    function clearStatus() {
      if (!loading) {
        return;
      }

      loading.hidden = true;
      loading.textContent = "";
      loading.classList.remove("is-error");
    }

    function updateControls() {
      var pageTotal = pdfDocument ? pdfDocument.numPages : 0;

      if (currentDisplay) {
        currentDisplay.textContent = String(currentPage);
      }

      if (totalDisplay) {
        totalDisplay.textContent = pageTotal ? String(pageTotal) : "--";
      }

      if (folio) {
        folio.textContent = String(currentPage);
      }

      if (previousButton) {
        previousButton.disabled = !pageTotal || currentPage === 1;
      }

      if (nextButton) {
        nextButton.disabled = !pageTotal || currentPage === pageTotal;
      }

      jumpButtons.forEach(function (button, buttonIndex) {
        var isActive = buttonIndex === currentPage - 1;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-current", isActive ? "page" : "false");
      });
    }

    function buildPagination(pageTotal) {
      if (!pagination) {
        return;
      }

      pagination.innerHTML = "";
      jumpButtons = [];

      for (var index = 0; index < pageTotal; index += 1) {
        var button = document.createElement("button");
        button.type = "button";
        button.className = "issue-viewer__dot";
        button.dataset.issueJump = String(index);
        button.setAttribute("aria-label", "Go to page " + String(index + 1));
        button.textContent = String(index + 1);
        button.addEventListener("click", function (event) {
          renderPage(Number(event.currentTarget.dataset.issueJump) + 1);
        });
        pagination.appendChild(button);
        jumpButtons.push(button);
      }
    }

    function renderPage(pageNumber) {
      if (!pdfDocument) {
        return;
      }

      currentPage = Math.max(1, Math.min(pageNumber, pdfDocument.numPages));
      updateControls();
      setStatus("Rendering page " + String(currentPage) + "...");

      if (renderTask) {
        renderTask.cancel();
        renderTask = null;
      }

      pdfDocument
        .getPage(currentPage)
        .then(function (page) {
          var context = canvas.getContext("2d");
          var frame = viewer.querySelector(".issue-sheet__pdf-frame");
          var baseViewport = page.getViewport({ scale: 1 });
          var frameWidth = frame ? frame.clientWidth : baseViewport.width;
          var scale = Math.min(2, frameWidth / baseViewport.width);
          var viewport;
          var deviceScale = window.devicePixelRatio || 1;
          var transform = null;

          if (!Number.isFinite(scale) || scale <= 0) {
            scale = 1;
          }

          viewport = page.getViewport({ scale: scale });
          canvas.width = Math.floor(viewport.width * deviceScale);
          canvas.height = Math.floor(viewport.height * deviceScale);
          canvas.style.width = viewport.width + "px";
          canvas.style.height = viewport.height + "px";

          if (deviceScale !== 1) {
            transform = [deviceScale, 0, 0, deviceScale, 0, 0];
          }

          renderTask = page.render({
            canvasContext: context,
            viewport: viewport,
            transform: transform,
          });

          return renderTask.promise;
        })
        .then(function () {
          renderTask = null;
          clearStatus();
          updateControls();
        })
        .catch(function (error) {
          if (error && error.name === "RenderingCancelledException") {
            return;
          }

          renderTask = null;
          setStatus("Unable to render this PDF page.", true);
        });
    }

    if (previousButton) {
      previousButton.addEventListener("click", function () {
        renderPage(currentPage - 1);
      });
    }

    if (nextButton) {
      nextButton.addEventListener("click", function () {
        renderPage(currentPage + 1);
      });
    }

    if (stage) {
      stage.addEventListener("keydown", function (event) {
        if (event.key === "ArrowRight") {
          event.preventDefault();
          renderPage(currentPage + 1);
        }

        if (event.key === "ArrowLeft") {
          event.preventDefault();
          renderPage(currentPage - 1);
        }
      });
    }

    if (pdfPage) {
      pdfPage.addEventListener("click", function (event) {
        if (event.target.closest("a, button")) {
          return;
        }

        var bounds = pdfPage.getBoundingClientRect();
        var clickOffset = event.clientX - bounds.left;

        if (clickOffset > bounds.width / 2) {
          renderPage(currentPage + 1);
        } else {
          renderPage(currentPage - 1);
        }
      });
    }

    window.addEventListener("resize", function () {
      if (!pdfDocument) {
        return;
      }

      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(function () {
        renderPage(currentPage);
      }, 160);
    });

    setStatus("Loading PDF...");

    window.pdfjsLib
      .getDocument(pdfSource)
      .promise.then(function (documentProxy) {
        pdfDocument = documentProxy;
        buildPagination(documentProxy.numPages);
        viewer.dataset.enhanced = "true";
        renderPage(1);
      })
      .catch(function () {
        setStatus("Unable to load this PDF.", true);

        if (previousButton) {
          previousButton.disabled = true;
        }

        if (nextButton) {
          nextButton.disabled = true;
        }
      });
  }
});
