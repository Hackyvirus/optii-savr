<?php
/* 
Template Name: Optii-Savr User Manual
*/

$nonce = base64_encode(random_bytes(16));

header(
    "Content-Security-Policy: ".
    "default-src 'none'; ".
    "script-src 'self' https://code.jquery.com https://cdnjs.cloudflare.com 'nonce-$nonce'; ".
    "style-src 'self' https://fonts.googleapis.com 'nonce-$nonce'; ".
    "img-src 'self' data: https://secure.gravatar.com https://optitaxs.com; ".
    "font-src 'self' https://fonts.gstatic.com; ".
    "connect-src 'self' https://optitaxs.com https://*.optitaxs.com; ".
    "frame-src 'self'; ".
    "frame-ancestors 'none'; ".
    "base-uri 'self'; ".
    "object-src 'none'; ".
    "form-action 'self'; ".
    "manifest-src 'self'; ".
    "media-src 'self'; ".
    "worker-src 'self' blob:;"
);
?>


<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <title>Optii-Savr Tool - Step-by-Step User Manual & Guide</title>
    <meta
      name="description"
      content="Learn how to use the Optii-Savr Tool with our detailed user manual. Step-by-step instructions with images to help you calculate customs duty savings."
    />
    <meta
      name="keywords"
      content="Optii-Savr, customs duty calculator, user manual, guide, import-export schemes, calculate duty savings, Optii tool"
    />
    <meta name="author" content="Optitaxs's" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="https://optitaxs.com/optii-savr-user-manual/" />

    <!-- Open Graph Meta Tags for Social Sharing -->
    <meta
      property="og:title"
      content="Optii-Savr Tool - Step-by-Step User Manual"
    />
    <meta
      property="og:description"
      content="Get a complete guide on how to use Optii-Savr to calculate your customs duty savings efficiently."
    />
    <meta
      property="og:image"
      content="https://www.optitaxs.com/images/optii-preview.png"
    />
    <link rel="canonical" href="https://optitaxs.com/optii-savr-user-manual/" />
    <meta property="og:type" content="website" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta
      name="twitter:title"
      content="Optii-Savr Tool - User Manual & Guide"
    />
    <meta
      name="twitter:description"
      content="A detailed step-by-step guide on how to use the Optii-Savr customs duty calculator."
    />
    <meta
      name="twitter:image"
      content="https://www.optitaxs.com/images/optii-preview.png"
    />

    <link
      rel="shortcut icon"
      href="https://optitaxs.com/wp-content/themes/optitaxtheme/tools/optii-savr/img/icon.png"
      type="image/x-icon"
    />

    <link rel="stylesheet" href="https://optitaxs.com/wp-content/themes/optitaxtheme/tools/optii-savr/css/optii-savr-usermanual.css" />
    <style nonce="<?= $nonce ?>">
</style>
  </head>
  <body>
    <header>
      <h1>User Manual - Optii-Savr Customs Duty Saving Tool</h1>
    </header>

    <main>
      <section class="step">
        <h2>1) Introduction</h2>
        <p>
          Optii-Savr is an advanced customs duty saving calculator tool. This
          guide explains how to navigate the tool, understand its features, and
          enter accurate information to get the best evaluation.
        </p>
        <img
          src="https://optitaxs.com/wp-content/themes/optitaxtheme/tools/optii-savr/img/User Manual/title.png"
          alt="Optii-Savr Tool Home Page Title Screenshot"
        />
      </section>

      <section class="step">
        <h2>2) Home Page Navigation</h2>
        <p>
          On the main screen, you'll see two helpful buttons— first one for
          learning more about schemes and second one is to comparison of scheme
          & third one explaining key terms. Review these to understand the
          tool’s context better.
        </p>
        <img
          src="https://optitaxs.com/wp-content/themes/optitaxtheme/tools/optii-savr/img/User Manual/learn-more-about-btn.png"
          alt="Learn More About Schemes Button"
        />
        <img
          src="https://optitaxs.com/wp-content/themes/optitaxtheme/tools/optii-savr/img/User Manual/Comparison of the schemes  btn.png"
          alt="Comparison of schemes Button"
        />
        <img
          src="https://optitaxs.com/wp-content/themes/optitaxtheme/tools/optii-savr/img/User Manual/explanation-of-relevent-terms-btn.png"
          alt="Explanation of Relevant Terms Button"
        />
        <p>Each button opens an information screen for better clarity:</p>
        <img
          src="https://optitaxs.com/wp-content/themes/optitaxtheme/tools/optii-savr/img/User Manual/learn-more-about-screen.png"
          alt="Learn More About Schemes Info Screen"
        />
        <img
          src="https://optitaxs.com/wp-content/themes/optitaxtheme/tools/optii-savr/img/User Manual/Comparison of the schemes  screen.png"
          alt="Learn More About Schemes Info Screen"
        />
        <img
          src="https://optitaxs.com/wp-content/themes/optitaxtheme/tools/optii-savr/img/User Manual/explanation-of-relevent-terms-screenpng.png"
          alt="Explanation of Relevant Terms Info Screen"
        />
        <img
          src="https://optitaxs.com/wp-content/themes/optitaxtheme/tools/optii-savr/img/User Manual/home-next-btn.png"
          alt="Next Button to Proceed"
        />
      </section>

      <section class="step">
        <h2>3) Accepting Terms & Conditions</h2>
        <p>
          Before using the tool, review and accept the terms and conditions.
          This ensures responsible and informed usage.
        </p>
        <img
          src="https://optitaxs.com/wp-content/themes/optitaxtheme/tools/optii-savr/img/User Manual/accept-temrm-and-conditions-screen.png"
          alt="Terms and Conditions Page Screenshot"
        />
      </section>

      <section class="step">
        <h2>4) Starting the Calculator</h2>
        <p>
          After accepting, you’ll reach the calculator dashboard. It’s divided
          into multiple sections that collect data step by step.
        </p>
        <img
          src="https://optitaxs.com/wp-content/themes/optitaxtheme/tools/optii-savr/img/User Manual/calculator-home-page-and-capital-goods-input.png"
          alt="Calculator Dashboard Screenshot"
        />
      </section>

      <section class="step">
        <h2>5) Enter Imported Capital Goods</h2>
        <p>
          Fill in values for imported capital goods, including applicable
          duties. Use Next/Prev buttons to move across sections.
        </p>
        <img
          src="https://optitaxs.com/wp-content/themes/optitaxtheme/tools/optii-savr/img/User Manual/imported-capital-goods.png"
          alt="Imported Capital Goods Input Section"
        />
      </section>

      <section class="step">
        <h2>6) Enter Domestic Capital Goods</h2>
        <p>
          Provide similar inputs for domestically sourced capital goods to help
          compare savings effectively.
        </p>
        <img
          src="https://optitaxs.com/wp-content/themes/optitaxtheme/tools/optii-savr/img/User Manual/domestic-capital-goods.png"
          alt="Domestic Capital Goods Input Section"
        />
      </section>

      <section class="step">
        <h2>7) Imported Raw Materials for Export</h2>
        <p>
          Record data for raw materials used for exports, SEZ supplies, or
          deemed exports.
        </p>
        <img
          src="https://optitaxs.com/wp-content/themes/optitaxtheme/tools/optii-savr/img/User Manual/imported-raw-material-for-sez.png"
          alt="Imported Raw Materials for Export Input"
        />
      </section>

      <section class="step">
        <h2>8) Imported Raw Materials for DTA</h2>
        <p>
          Input the cost and duty for raw materials used in products sold in the
          domestic tariff area (DTA).
        </p>
        <img
          src="https://optitaxs.com/wp-content/themes/optitaxtheme/tools/optii-savr/img/User Manual/imported-raw-material-for-dta.png"
          alt="Imported Raw Materials for DTA Section"
        />
      </section>

      <section class="step">
        <h2>9) Domestic Raw Materials</h2>
        <p>
          List the costs and values of raw materials procured locally, which
          contribute to your final product.
        </p>
        <img
          src="https://optitaxs.com/wp-content/themes/optitaxtheme/tools/optii-savr/img/User Manual/domestic-raw-materialpng.png"
          alt="Domestic Raw Materials Section"
        />
      </section>

      <section class="step">
        <h2>10) Answer Common Questions</h2>
        <p>
          Respond to key business-related queries such as export timelines,
          inventory turnover, and growth assumptions.
        </p>
        <img
          src="https://optitaxs.com/wp-content/themes/optitaxtheme/tools/optii-savr/img/User Manual/common-questions.png"
          alt="Common Questions Form Screenshot"
        />
      </section>

      <section class="step">
        <h2>11) Calculate Savings</h2>
        <p>
          After inputting all data, click the
          <strong>“Calculate”</strong> button. A progress bar will show
          completion status.
        </p>
        <img
          src="https://optitaxs.com/wp-content/themes/optitaxtheme/tools/optii-savr/img/User Manual/progressbar.png"
          alt="Progress Bar Indicating Calculation in Progress"
        />
      </section>

      <section class="step">
        <h2>12) View Report</h2>
        <p>
          The tool displays your personalized report. Click the download button
          to save a PDF version for your records.
        </p>
        <img
          src="https://optitaxs.com/wp-content/themes/optitaxtheme/tools/optii-savr/img/User Manual/report-downloading-page.png"
          alt="Calculation Report Output Screenshot"
        />
      </section>

      <section class="step">
        <h2>13) Submit Feedback</h2>
        <p>
          After downloading the report, you'll be prompted for quick feedback.
          This helps us improve the tool further.
        </p>
        <img
          src="https://optitaxs.com/wp-content/themes/optitaxtheme/tools/optii-savr/img/User Manual/feedback-form.png"
          alt="Feedback Form Screenshot"
        />
      </section>

      <section class="step">
        <h2>14) FAQs</h2>
        <p>
          If you have queries regarding these schemes you can refer our FAQs
          section.
        </p>
        <img
          src="https://optitaxs.com/wp-content/themes/optitaxtheme/tools/optii-savr/img/User Manual/faq.png"
          alt="Feedback Form Screenshot"
        />
      </section>

      <h2 style="text-align: center">
        <a href="https://optitaxs.com/optii-savr-calculator/"
          >→ Go to Optii-Savr Calculator</a
        >
      </h2>
    </main>
    <button onclick="scrollToTop()" id="backToTopBtn" title="Go to top">
      ↑ Top
    </button>

    <footer>
      &copy; <span id="year"></span> Optii-Savr. Built for better duty savings.
      All rights reserved.
    </footer>
    <script nonce="<?= $nonce ?>">
    console.log("Inline JS now allowed!");
</script>

    <script src="https://optitaxs.com/wp-content/themes/optitaxtheme/tools/optii-savr/scripts/optii-savr-usermanual.js"></script>
  </body>
</html>
