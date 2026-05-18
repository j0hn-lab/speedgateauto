# -*- coding: utf-8 -*-
from pathlib import Path

HERO_IMG = "carbackground.png"

html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Speedgate Logistics | Import Your Dream Car to Kenya</title>
  <meta name="description" content="Speedgate Logistics — import cars from Japan, UK, Thailand and more to Kenya." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
  <link rel="stylesheet" href="css/speedgate.css" />
</head>
<body>

<div class="top-bar">
  <motion class="container">
    <span>Import Your Dream Car to Kenya</span>
    <motion class="top-bar-right">
      <a href="tel:+254789071061"><i class="fas fa-phone"></i> +254 789 071 061</a>
      <a href="mailto:info@speedgatelogistics.co.ke"><i class="fas fa-envelope"></i> info@speedgatelogistics.co.ke</a>
      <motion class="top-social">
        <a href="#" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
        <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
        <a href="https://wa.me/254789071061" target="_blank" rel="noopener" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i></a>
      </motion>
    </motion>
  </motion>
</motion>

<header class="site-header" id="header">
  <motion class="container header-inner">
    <a href="#home" class="logo">
      <motion class="logo-mark">S</motion>
      <motion class="logo-text"><strong>SPEEDGATE LOGISTICS</strong><span>Import &amp; Clearance Experts</span></motion>
    </a>
    <button class="menu-toggle" id="menuToggle" aria-label="Menu"><span></span><span></span><span></span></button>
    <nav class="main-nav" id="mainNav">
      <a href="#home" class="nav-link">Home</a>
      <a href="#process" class="nav-link">How It Works</a>
      <a href="#services" class="nav-link">Import Services</a>
      <a href="#why-choose" class="nav-link">Why Choose Us</a>
      <a href="#about" class="nav-link">About Us</a>
      <a href="#blog" class="nav-link">Blog</a>
      <a href="#contact" class="nav-link">Contact Us</a>
      <a href="#contact" class="btn-quote">Get Import Quote</a>
    </nav>
  </motion>
</header>

<section id="home" class="hero" style="background-image:url('{HERO_IMG}')">
  <motion class="container">
    <h1>Import Your Dream Car to <em>Kenya</em> with Confidence</h1>
    <p>We source quality vehicles from Japan, UK, Thailand, and other markets — handle shipping, clearance, and delivery so you get the right car at a clear landed price.</p>
    <motion class="hero-btns">
      <a href="#cars" class="btn btn-navy">Browse Cars</a>
      <a href="#contact" class="btn btn-orange">Get Import Quote</a>
      <a href="https://wa.me/254789071061" class="btn btn-wa" target="_blank" rel="noopener"><i class="fab fa-whatsapp"></i> WhatsApp Us</a>
    </motion>
  </motion>
</section>

<motion class="search-strip-wrap">
  <motion class="container">
    <motion class="search-strip">
      <form id="heroSearchForm">
        <motion class="search-field"><label for="searchMake">Make</label><select id="searchMake" name="make"><option value="">Any Make</option><option>Toyota</option><option>Nissan</option><option>Honda</option><option>Subaru</option><option>Mercedes-Benz</option><option>BMW</option><option>Land Rover</option></select></motion>
        <motion class="search-field"><label for="searchModel">Model</label><select id="searchModel" name="model"><option value="">Any Model</option><option>Harrier</option><option>Forester</option><option>RAV4</option><option>Fielder</option></select></motion>
        <motion class="search-field"><label for="searchYear">Year</label><select id="searchYear" name="year"><option value="">Any Year</option><option>2024</option><option>2023</option><option>2022</option><option>2021</option><option>2020</option><option>2019</option></select></motion>
        <motion class="search-field"><label for="searchBudget">Budget</label><select id="searchBudget" name="budget"><option value="">Any Budget</option><option>Under KES 2M</option><option>KES 2M – 4M</option><option>KES 4M – 8M</option><option>Above KES 8M</option></select></motion>
        <motion class="search-field"><label for="searchFuel">Fuel Type</label><select id="searchFuel" name="fuel"><option value="">Any Fuel</option><option>Petrol</option><option>Diesel</option><option>Hybrid</option><option>Electric</option></select></motion>
        <button type="submit" class="btn-search"><i class="fas fa-search"></i> Search Cars</button>
      </form>
    </motion>
  </motion>
</motion>

<section class="features-row">
  <motion class="container">
    <motion class="features-grid">
      <motion class="feature-item reveal"><motion class="icon"><i class="fas fa-tags"></i></motion><h3>Transparent Pricing</h3><p>No hidden charges</p></motion>
      <motion class="feature-item reveal"><motion class="icon"><i class="fas fa-shield-alt"></i></motion><h3>Verified Vehicles</h3><p>Quality checked</p></motion>
      <motion class="feature-item reveal"><motion class="icon"><i class="fas fa-lock"></i></motion><h3>Secure Payments</h3><p>100% safe transactions</p></motion>
      <motion class="feature-item reveal"><motion class="icon"><i class="fas fa-truck"></i></motion><h3>Nationwide Delivery</h3><p>Across Kenya</p></motion>
    </motion>
  </motion>
</section>

<section id="process" class="process-section">
  <motion class="container">
    <motion class="section-head reveal"><h2>How Car Importation <em>Works</em></h2><p>Seven simple steps from selection to your driveway.</p></motion>
    <motion class="process-flow">
      <motion class="process-step reveal"><motion class="num-circle">1</motion><motion class="step-icon"><i class="fas fa-car"></i></motion><h4>Choose Your Car</h4></motion>
      <motion class="process-step reveal"><motion class="num-circle">2</motion><motion class="step-icon"><i class="fas fa-file-invoice"></i></motion><h4>Request Quotation</h4></motion>
      <motion class="process-step reveal"><motion class="num-circle">3</motion><motion class="step-icon"><i class="fas fa-check-circle"></i></motion><h4>Confirm Order</h4></motion>
      <motion class="process-step reveal"><motion class="num-circle">4</motion><motion class="step-icon"><i class="fas fa-credit-card"></i></motion><h4>Payment &amp; Docs</h4></motion>
      <motion class="process-step reveal"><motion class="num-circle">5</motion><motion class="step-icon"><i class="fas fa-ship"></i></motion><h4>Shipping</h4></motion>
      <motion class="process-step reveal"><motion class="num-circle">6</motion><motion class="step-icon"><i class="fas fa-clipboard-check"></i></motion><h4>Clearance</h4></motion>
      <motion class="process-step reveal"><motion class="num-circle">7</motion><motion class="step-icon"><i class="fas fa-home"></i></motion><h4>Delivery</h4></motion>
    </motion>
  </motion>
</section>

<section id="services" class="services-section">
  <motion class="container">
    <motion class="section-head reveal"><h2>Our Import <em>Services</em></h2><p>End-to-end support for every type of importer.</p></motion>
    <motion class="services-grid">
      <motion class="service-card reveal"><motion class="svc-icon"><i class="fas fa-flag"></i></motion><h3>Japan Car Imports</h3><p>Auction and dealer sourcing with inspection reports.</p></motion>
      <motion class="service-card reveal"><motion class="svc-icon"><i class="fas fa-flag-usa"></i></motion><h3>UK Car Imports</h3><p>Right-hand drive and premium UK stock.</p></motion>
      <motion class="service-card reveal"><motion class="svc-icon"><i class="fas fa-percent"></i></motion><h3>Duty-Free Imports</h3><p>Diplomatic and exempt categories handled professionally.</p></motion>
      <motion class="service-card reveal"><motion class="svc-icon"><i class="fas fa-plane-arrival"></i></motion><h3>Returning Resident</h3><p>Guidance on eligibility and documentation.</p></motion>
      <motion class="service-card reveal"><motion class="svc-icon"><i class="fas fa-wheelchair"></i></motion><h3>PWD Imports</h3><p>Support for persons with disabilities exemptions.</p></motion>
      <motion class="service-card reveal"><motion class="svc-icon"><i class="fas fa-anchor"></i></motion><h3>Car Clearance</h3><p>Mombasa port clearance and KRA coordination.</p></motion>
      <motion class="service-card reveal"><motion class="svc-icon"><i class="fas fa-clipboard-list"></i></motion><h3>Vehicle Inspection</h3><p>Pre-export and compliance checks arranged.</p></motion>
      <motion class="service-card reveal"><motion class="svc-icon"><i class="fas fa-truck-loading"></i></motion><h3>Delivery Kenya</h3><p>Nationwide delivery after clearance.</p></motion>
    </motion>
  </motion>
</section>

<section id="why-choose" class="why-section">
  <motion class="container">
    <motion class="section-head reveal"><h2>Why Choose Speedgate Logistics?</h2><p>Trusted import partners for individuals, diplomats, and businesses.</p></motion>
    <motion class="why-grid">
      <motion class="why-card reveal"><h3>Expert Team</h3><p>Dedicated advisors from quotation through delivery with clear updates.</p></motion>
      <motion class="why-card reveal"><h3>Clear Landed Costs</h3><p>Upfront breakdown of C&amp;F, duty, clearing, and delivery before you commit.</p></motion>
      <motion class="why-card reveal"><h3>Proven Process</h3><p>Structured milestones so you always know where your vehicle is.</p></motion>
    </motion>
  </motion>
</section>

<section id="about" class="about-section">
  <motion class="container about-grid">
    <motion class="reveal">
      <h2>About <em>Speedgate Logistics</em></h2>
      <p>Speedgate Logistics helps Kenyans import dream cars with confidence. We combine sourcing networks in Japan, the UK, and beyond with local clearance expertise.</p>
      <p>Whether you need a family SUV, a diplomatic duty-free unit, or a returning-resident import, our team guides you at every step.</p>
    </motion>
    <motion class="reveal">
      <img src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=800&q=80" alt="Vehicle import" style="border-radius:8px;width:100%;" loading="lazy" />
    </motion>
  </motion>
</section>

<section id="cars" class="cars-section">
  <motion class="container">
    <motion class="section-head reveal"><h2>Browse <em>Cars</em></h2><p>Sample stock — contact us for live availability.</p></motion>
    <motion class="listings-grid">
      <article class="listing-card reveal"><motion class="listing-img"><img src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=600&q=80" alt="Car" loading="lazy" /></motion><motion class="listing-body"><h3>TOYOTA HARRIER</h3><p class="listing-tags">2020 · Hybrid · 38,000 km</p><p class="listing-price">KES 3,450,000</p><a href="#contact" class="btn btn-orange" style="width:100%;justify-content:center;">Details</a></motion></article>
      <article class="listing-card reveal"><motion class="listing-img"><img src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80" alt="Car" loading="lazy" /></motion><motion class="listing-body"><h3>SUBARU FORESTER</h3><p class="listing-tags">2019 · Petrol · 45,000 km</p><p class="listing-price">KES 2,134,241</p><a href="#contact" class="btn btn-orange" style="width:100%;justify-content:center;">Details</a></motion></article>
      <article class="listing-card reveal"><motion class="listing-img"><img src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=600&q=80" alt="Car" loading="lazy" /></motion><motion class="listing-body"><h3>MERCEDES GLE</h3><p class="listing-tags">2020 · Diesel · 49,800 km</p><p class="listing-price">KES 8,236,934</p><a href="#contact" class="btn btn-orange" style="width:100%;justify-content:center;">Details</a></motion></article>
    </motion>
  </motion>
</section>

<section id="blog" class="blog-section">
  <motion class="container">
    <motion class="section-head reveal"><h2>Latest <em>Blog</em></h2></motion>
    <motion class="blog-grid">
      <article class="blog-card reveal"><motion class="blog-img"><i class="fas fa-newspaper"></i></motion><motion class="blog-body"><h3>Duty-Free Imports in Kenya</h3><p>Who qualifies and what documents you need.</p></motion></article>
      <article class="blog-card reveal"><motion class="blog-img"><i class="fas fa-car"></i></motion><motion class="blog-body"><h3>Japan vs UK Imports</h3><p>Which market fits your budget and needs.</p></motion></article>
      <article class="blog-card reveal"><motion class="blog-img"><i class="fas fa-book"></i></motion><motion class="blog-body"><h3>KRA Duty Breakdown</h3><p>Understanding your landed cost lines.</p></motion></article>
    </motion>
  </motion>
</section>

<section id="contact" class="contact-section">
  <motion class="container contact-grid">
    <motion class="contact-info reveal">
      <h3>Contact Speedgate Logistics</h3>
      <motion class="contact-item"><i class="fas fa-phone"></i><motion><strong>Phone</strong><br><a href="tel:+254789071061">+254 789 071 061</a></motion></motion>
      <motion class="contact-item"><i class="fas fa-envelope"></i><motion><strong>Email</strong><br><a href="mailto:info@speedgatelogistics.co.ke">info@speedgatelogistics.co.ke</a></motion></motion>
      <motion class="contact-item"><i class="fas fa-map-marker-alt"></i><motion><strong>Location</strong><br>Nairobi, Kenya</motion></motion>
    </motion>
    <motion class="contact-form reveal">
      <h3>Get Import Quote</h3>
      <form id="inquiryForm">
        <motion class="form-row">
          <motion class="form-group"><label>Full Name *</label><input type="text" name="name" required /></motion>
          <motion class="form-group"><label>Phone *</label><input type="tel" name="phone" required /></motion>
        </motion>
        <motion class="form-group"><label>Email</label><input type="email" name="email" /></motion>
        <motion class="form-row">
          <motion class="form-group"><label>Service *</label><select name="service" required><option value="">Select</option><option>Japan Import</option><option>UK Import</option><option>Duty-Free Import</option><option>Returning Resident</option><option>PWD Import</option><option>Clearance Only</option></select></motion>
          <motion class="form-group"><label>Budget</label><select name="budget"><option value="">Select</option><option>Under KES 2M</option><option>KES 2M – 4M</option><option>Above KES 4M</option></select></motion>
        </motion>
        <motion class="form-group"><label>Vehicle Preference</label><input type="text" name="vehicle" placeholder="e.g. Toyota Harrier 2020" /></motion>
        <motion class="form-group"><label>Message</label><textarea name="message"></textarea></motion>
        <button type="submit" class="btn btn-orange form-submit">Send Enquiry</button>
      </form>
    </motion>
  </motion>
</section>

<footer class="site-footer">
  <motion class="container">
    <motion class="footer-grid">
      <motion><motion class="logo-mark" style="margin-bottom:1rem;">S</motion><p style="font-size:.88rem;max-width:280px;">Speedgate Logistics — your partner for importing vehicles to Kenya with transparency and care.</p></motion>
      <motion><h4>Quick Links</h4><a href="#home">Home</a><a href="#process">How It Works</a><a href="#services">Services</a><a href="#contact">Contact</a></motion>
      <motion><h4>Services</h4><a href="#services">Japan Imports</a><a href="#services">UK Imports</a><a href="#services">Duty-Free</a><a href="#services">Clearance</a></motion>
      <motion><h4>Contact</h4><a href="tel:+254789071061">+254 789 071 061</a><a href="mailto:info@speedgatelogistics.co.ke">info@speedgatelogistics.co.ke</a></motion>
    </motion>
    <motion class="footer-bottom">&copy; 2026 Speedgate Logistics. All rights reserved.</motion>
  </motion>
</footer>

<a href="https://wa.me/254789071061" class="wa-fab" target="_blank" rel="noopener" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i></a>
<motion class="toast" id="toast"><i class="fas fa-check-circle"></i><span id="toastMsg"></span></motion>

<script src="js/supabase-config.js"></script>
<script src="js/supabase-db.js"></script>
<script src="js/site.js"></script>
</body>
</html>
"""

# Fix accidental tag name in generator
html = html.replace("<motion", "<div").replace("</motion>", "</div>")

Path(__file__).parent.joinpath("index.html").write_text(html, encoding="utf-8")
print("OK: index.html written")
