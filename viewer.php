<?php
/*
Template Name: Optii-Savr Viewer
*/

$nonce = base64_encode(random_bytes(16));

header(
    "Content-Security-Policy: " .
    "default-src 'none'; " .
    "script-src 'self' https://code.jquery.com https://cdnjs.cloudflare.com 'nonce-$nonce'; " .
    "style-src 'self' https://fonts.googleapis.com 'nonce-$nonce'; " .
    "img-src 'self' data: https://secure.gravatar.com https://optitaxs.com; " .
    "font-src 'self' https://fonts.gstatic.com; " .
    "connect-src 'self' https://optitaxs.com https://*.optitaxs.com; " .
    "frame-src 'self'; " .
    "frame-ancestors 'none'; " .
    "base-uri 'self'; " .
    "object-src 'none'; " .
    "form-action 'self' https://formsubmit.co; " .
    "manifest-src 'self'; " .
    "media-src 'self'; " .
    "worker-src 'self' blob:;"
);
?>


<!DOCTYPE html>
<html>
  <head>
    <title>Optitx's Report</title>
    <!-- Link to external CSS file -->
    <link
      rel="stylesheet"
      href="https://optitaxs.com/wp-content/themes/optitaxtheme/tools/optii-savr/css/style.css"
    />
    <link
      rel="shortcut icon"
      href="https://optitaxs.com/wp-content/uploads/2022/06/cropped-favicon-192x192.png"
      type="image/x-icon"
    />
    <style nonce="<?= $nonce ?>">
      body{
            font-family: "Roboto", sans-serif
      }
      /* In-line styles if needed to override or add specific styles for the new tab's content */
      iframe {
        width: 75%;
        height: 600px;
        box-sizing: border-box;
        padding: 20px;
        margin: auto;
      }
      #viewer-status {
        width: 75%;
        margin: 60px auto;
        padding: 30px;
        box-sizing: border-box;
        text-align: center;
        font-size: 16px;
        color: #333;
      }
      #viewer-status.hidden {
        display: none;
      }
      #viewer-status .spinner {
        width: 36px;
        height: 36px;
        margin: 0 auto 16px;
        border: 4px solid #e0e0e0;
        border-top-color: var(--ink, #191536);
        border-radius: 50%;
        animation: viewer-spin 0.8s linear infinite;
      }
      @keyframes viewer-spin {
        to {
          transform: rotate(360deg);
        }
      }
      #viewer-status.error .spinner {
        display: none;
      }
      #viewer-status .error-message {
        color: var(--stamp, #9a2b2b);
        margin-bottom: 16px;
      }
      #viewer-retry {
        background-color: var(--ink, #191536);
        color: white;
        display: none;
      }
      #viewer-retry:hover {
        background-color: var(--stamp, #9a2b2b);
      }
      #viewer-status.error #viewer-retry {
        display: inline-block;
      }
      #toolbar {
        height: 60px;
        background: var(--ink, #191536);
        border-bottom: 3px solid var(--stamp, #9a2b2b);
        display: flex;
        justify-content: center;
        gap: 50px;
        align-items: center;
      }
      button {
        padding: 10px 20px;
        width: max-content;
        border: 0;
        border-radius: 2px;
        cursor: pointer;
        font-size: 13px;
        font-family: var(--font-body, "IBM Plex Sans", sans-serif);
        letter-spacing: 0.5px;
        text-transform: uppercase;
        font-weight: 500;
        transition: background 0.15s ease;
      }
      #submit-download{
        background-color: var(--ink, #191536);
        color: white;
      }
      #submit-download:hover {
        background-color: var(--stamp, #9a2b2b);
      }
      main {
        display: flex;
        font-family: "Open Sans";
      }

      aside {
        width: 40%;
        height: 100dvh;
      }
      .form-group {
        display: flex;
      }

      aside.upcoming-tools {
        background: linear-gradient(135deg, #f0f4f8, #ffffff);
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        padding: 20px;
        max-width: 300px;
        font-family: "Segoe UI", sans-serif;
      }

      aside.upcoming-tools h2 {
        font-size: 1.4em;
        margin-bottom: 15px;
        color: #333;
        border-bottom: 2px solid #ddd;
        padding-bottom: 5px;
      }

      .tool {
        margin-bottom: 15px;
        padding: 10px;
        border-left: 4px solid #4a90e2;
        background-color: #f9fbfd;
        border-radius: 6px;
        transition: background-color 0.3s ease;
      }

      .tool:hover {
        background-color: #eef5fc;
      }

      .tool-title {
        font-weight: bold;
        color: #2c3e50;
      }

      .tool-date {
        font-size: 0.85em;
        color: #7f8c8d;
      }
      #custom-feedback-modal input{
        width: fit-content;
      }
      .feedback-form{
        gap: 16px;
      }
      .input-q {
        display: flex;
        flex-direction: column;
        align-items: start;
        margin: 12px 0;
        gap : 8px;
      }
      .input-q label{
        cursor: pointer;
      }
      #custom-feedback-modal input[type="checkbox"]{
        height: 18px;
      }
      @media (max-width: 600px) {
        main {
          display: flex;
          font-family: "Open Sans";
          flex-direction: column;
          width: 100%;
        }
        aside {
          width: 100%;
          height: 400px;
        }

        iframe {
          width: 100%;
          height: 400px;
          box-sizing: border-box;
          padding: 20px;
        }
      }
    </style>
  </head>
  <body>
    <div id="toolbar" style="display:none;">
      <button onclick="downloadPDF()">Download</button>
    </div>
    <main>
      <div id="viewer-status">
        <div class="spinner"></div>
        <p class="status-message">Generating your report&hellip;</p>
        <p class="error-message" style="display:none;"></p>
        <button id="viewer-retry" onclick="retryViewer()">Retry</button>
      </div>
      <iframe id="pdfFrame" style="display:none;"></iframe>
    </main>
    <div id="custom-feedback-modal" class="modal-container">
      <div class="modal-box">
 <form action="https://formsubmit.co/office@optitaxs.com" method="POST" id="feedback-form" class="feedback-form">
          <h2>We'd Love Your Feedback!</h2>

          <div class="form-group2">
            <label for="user-name">Name</label>
            <input
              type="text"
              id="user-name"
              name="name"
              placeholder="Enter your name"
              required
            />
          </div>

          <div class="form-group2">
            <label for="user-email">Email</label>
            <input
              type="email"
              id="user-email"
              name="email"
              placeholder="Enter your email"
              required
            />
          </div>

          <fieldset class="form-group">
            <legend>How was your experience with MOOWR Utility?</legend>
            <div class="input-q">
              <label
                ><input type="radio" name="experience" value="Great" required />
                Great</label
              >
              <label
                ><input type="radio" name="experience" value="Good" />
                Good</label
              >
              <label
                ><input type="radio" name="experience" value="Average" />
                Average</label
              >
              <label
                ><input
                  type="radio"
                  name="experience"
                  value="Needs Improvement"
                />
                Needs Improvement</label
              >
            </div>
          </fieldset>

          <div class="form-group">
            <label for="user-feedback">Additional Feedback</label>
            <textarea
              id="user-feedback"
              name="feedback"
              rows="4"
              placeholder="Share your thoughts..."
              required
            ></textarea>
          </div>

          <div class="form-group">
            <label
              ><input
                type="checkbox"
                id="newsletter-opt-in"
                name="subscribeNewsletter"
              />
              Subscribe to our Newsletter?</label
            >
          </div>

          <div class="submit-skip">
            <div class="skip-btn" id="skip">Skip and Download</div>
            <button type="submit" id="submit-download">
              Submit & Download Report
            </button>
          </div>

          
          <input type="hidden" name="_captcha" value="false">
            <input type="hidden" name="_autoresponse" value="Thank you for your feedback!">
            <input type="hidden" name="_next" value="https://optitaxs.com/optii-savr/">
        
        </form>
      </div>
    </div>

    <script>
      function downloadPDF() {
        document.getElementById("custom-feedback-modal").style.display =
          "block";
      }

      let blobURLFromStorage = null;

      function showStatusError(message) {
        const statusEl = document.getElementById("viewer-status");
        statusEl.classList.remove("hidden");
        statusEl.classList.add("error");
        statusEl.querySelector(".status-message").style.display = "none";
        const errorEl = statusEl.querySelector(".error-message");
        errorEl.style.display = "block";
        errorEl.textContent = message;
        document.getElementById("toolbar").style.display = "none";
      }

      function showPdf(stored) {
        const byteArray = new Uint8Array(JSON.parse(stored));
        const blob = new Blob([byteArray], { type: "application/pdf" });
        blobURLFromStorage = URL.createObjectURL(blob);
        const frame = document.getElementById("pdfFrame");
        frame.src = blobURLFromStorage + "#toolbar=0&navpanes=0&scrollbar=0";
        frame.style.display = "block";
        document.getElementById("viewer-status").classList.add("hidden");
        document.getElementById("toolbar").style.display = "flex";
      }

      function retryViewer() {
        if (window.opener && !window.opener.closed) {
          window.opener.location.reload();
        }
        window.close();
      }

      (function waitForReport() {
        const POLL_MS = 300;
        const TIMEOUT_MS = 20000;
        const start = Date.now();

        function poll() {
          const errPayload = localStorage.getItem("sharedPDF_error");
          if (errPayload) {
            localStorage.removeItem("sharedPDF_error");
            let parsed;
            try {
              parsed = JSON.parse(errPayload);
            } catch (e) {
              parsed = { message: errPayload };
            }
            showStatusError(
              parsed.message ||
                "Something went wrong while generating your report."
            );
            return;
          }

          const stored = localStorage.getItem("sharedPDF");
          if (stored) {
            showPdf(stored);
            return;
          }

          if (Date.now() - start > TIMEOUT_MS) {
            showStatusError(
              "Report generation is taking longer than expected. Please retry."
            );
            return;
          }

          setTimeout(poll, POLL_MS);
        }

        poll();
      })();

      function downloadPDF1() {
        const downloadUrl =
          blobURLFromStorage || document.getElementById("pdfFrame").src;
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = "Optitx's Report.pdf";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        setTimeout(function () {
          if (window.opener && !window.opener.closed) {
            window.opener.location.reload();
          }
          window.close();
        }, 1000);
        localStorage.removeItem("sharedPDF");
      }

      document.getElementById("skip").addEventListener("click", function () {
        document.getElementById("custom-feedback-modal").style.display = "none";
        downloadPDF1();
      });

      document
        .getElementById("submit-download")
        .addEventListener("click", function () {
          document.getElementById("custom-feedback-modal").style.display =
            "none";
          downloadPDF1();
          setTimeout(function () {
            location.reload();
          }, 5000);
        });
      function onlyOne(checkbox) {
        const checkboxes = document.getElementsByName("experience");
        for (let i = 0; i < checkboxes.length; i++) {
          if (checkboxes[i] !== checkbox) {
            checkboxes[i].checked = false;
          }
        }
      }
    </script>
  </body>
</html>
