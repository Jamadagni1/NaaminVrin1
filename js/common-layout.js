(function () {
    try {
        localStorage.setItem("language", "en");
    } catch (_e) {
        // ignore storage edge cases
    }
    document.documentElement.lang = "en";

    const COMMON_HEADER_HTML = `
<nav class="navbar">
    <div class="nav-brand-cluster">
        <a href="/index.html" class="navbar-back-home" aria-label="Back to home">
            <span class="navbar-back-icon" aria-hidden="true">&larr;</span>
            <span class="navbar-back-label">Home</span>
        </a>
        <div class="logo">Naam<span class="logo-in">in</span></div>
    </div>

    <ul class="nav-links desktop-only">
        <li><a href="/index.html" data-en="Home" data-hi="Home">Home</a></li>
        <li><a href="/about.html" data-en="About" data-hi="About">About</a></li>
        <li><a href="/parents-mix.html" data-en="Parents to Child" data-hi="Parents to Child">Parents to Child</a></li>
        <li><a href="/index.html#video-gallery" data-en="Video Gallery" data-hi="Video Gallery">Video Gallery</a></li>
        <li class="dropdown">
            <a href="#" class="dropdown-toggle" data-en="More" data-hi="More">More<span class="arrow">&#9662;</span></a>
            <ul class="dropdown-menu">
                <li><a href="/popular-names.html" data-en="Popular Names" data-hi="Popular Names">Popular Names</a></li>
                <li><a href="/unique-names.html" data-en="Unique Names" data-hi="Unique Names">Unique Names</a></li>
                <li><a href="/famous-personalities.html" data-en="Famous Personalities" data-hi="Famous Personalities">Famous Personalities</a></li>
                <li><a href="/more/motto-for-everything/index.html" data-en="Motto Creator" data-hi="Motto Creator">Motto Creator</a></li>
                <li><a href="/more/zodiac-finder/index.html" data-en="Zodiac Finder" data-hi="Zodiac Finder">Zodiac Finder</a></li>
                <li><a href="/name-report.html" data-en="Name Report" data-hi="Name Report">Name Report</a></li>
                <li><a href="/product.html" data-en="Our Products" data-hi="Our Products">Our Products</a></li>
                <li><a href="/services.html" data-en="Services" data-hi="Services">Services</a></li>
                <li><a href="/careers.html" data-en="Careers" data-hi="Careers">Careers</a></li>
                <li><a href="/blog.html" data-en="Blog" data-hi="Blog">Blog</a></li>
                <li><a href="/contact.html" data-en="Contact" data-hi="Contact">Contact</a></li>
            </ul>
        </li>
    </ul>

    <div class="nav-actions desktop-only">
        <button id="fav-view-btn" class="btn btn-fav" title="Wishlist">
            <i class="fas fa-heart"></i>
            <span id="fav-count">0</span>
        </button>
        <a href="/login.html" class="btn btn-login">Log in</a>
        <a href="/signup.html" class="btn btn-signup">Sign up</a>
    </div>

    <div class="mobile-header-actions mobile-only">
        <button id="fav-view-btn-mobile" class="btn btn-fav mobile-btn" aria-label="Shortlist">
            <i class="fas fa-heart"></i>
            <span id="fav-count-mobile">0</span>
        </button>
    </div>

    <button class="hamburger-menu mobile-only" id="hamburger-menu" aria-label="Toggle menu">
        <i class="fas fa-bars"></i>
    </button>

    <div class="mobile-menu" id="mobile-menu">
        <ul class="mobile-nav-links">
            <li><a href="/index.html" data-en="Home" data-hi="Home">Home</a></li>
            <li><a href="/about.html" data-en="About" data-hi="About">About</a></li>
            <li><a href="/parents-mix.html" data-en="Parents to Child" data-hi="Parents to Child">Parents to Child</a></li>
            <li><a href="/index.html#video-gallery" data-en="Video Gallery" data-hi="Video Gallery">Video Gallery</a></li>
            <li class="mobile-dropdown">
                <a href="#" class="mobile-dropdown-toggle" data-en="More" data-hi="More">More<span class="arrow">&#9662;</span></a>
                <ul class="mobile-dropdown-menu">
                    <li><a href="/popular-names.html" data-en="Popular Names" data-hi="Popular Names">Popular Names</a></li>
                    <li><a href="/unique-names.html" data-en="Unique Names" data-hi="Unique Names">Unique Names</a></li>
                    <li><a href="/famous-personalities.html" data-en="Famous Personalities" data-hi="Famous Personalities">Famous Personalities</a></li>
                    <li><a href="/more/motto-for-everything/index.html" data-en="Motto Creator" data-hi="Motto Creator">Motto Creator</a></li>
                    <li><a href="/more/zodiac-finder/index.html" data-en="Zodiac Finder" data-hi="Zodiac Finder">Zodiac Finder</a></li>
                    <li><a href="/name-report.html" data-en="Name Report" data-hi="Name Report">Name Report</a></li>
                    <li><a href="/product.html" data-en="Our Products" data-hi="Our Products">Our Products</a></li>
                    <li><a href="/services.html" data-en="Services" data-hi="Services">Services</a></li>
                    <li><a href="/careers.html" data-en="Careers" data-hi="Careers">Careers</a></li>
                    <li><a href="/blog.html" data-en="Blog" data-hi="Blog">Blog</a></li>
                    <li><a href="/contact.html" data-en="Contact" data-hi="Contact">Contact</a></li>
                </ul>
            </li>
        </ul>

        <div class="mobile-actions">
            <a href="/login.html" class="btn btn-login mobile-btn">Log in</a>
            <a href="/signup.html" class="btn btn-signup mobile-btn">Sign up</a>
        </div>
    </div>
</nav>`;

    const COMMON_FOOTER_HTML = `
<footer>
    <div class="footer-grid">
        <div>
            <h3 data-en="Quick Links" data-hi="Quick Links">Quick Links</h3>
            <a href="/index.html" data-en="Home" data-hi="Home">Home</a>
            <a href="/about.html" data-en="About" data-hi="About">About</a>
            <a href="/services.html" data-en="Services" data-hi="Services">Services</a>
            <a href="/contact.html" data-en="Contact" data-hi="Contact">Contact</a>
        </div>
        <div>
            <h3 data-en="Our Services" data-hi="Our Services">Our Services</h3>
            <a href="/services.html#consultation" data-en="Name Consultation" data-hi="Name Consultation">Name Consultation</a>
            <a href="/services.html#brand" data-en="Brand & Startup Naming" data-hi="Brand & Startup Naming">Brand & Startup Naming</a>
            <a href="/services.html#company" data-en="Company & Institution Naming" data-hi="Company & Institution Naming">Company & Institution Naming</a>
            <a href="/more/domain-name-creator/index.html" data-en="Domain Naming Service" data-hi="Domain Naming Service">Domain Naming Service</a>
            <a href="/more/motto-for-everything/index.html" data-en="Motto Creator" data-hi="Motto Creator">Motto Creator</a>
            <a href="/name-report.html" data-en="Name Report" data-hi="Name Report">Name Report</a>
            <a href="/product.html" data-en="Our Products" data-hi="Our Products">Our Products</a>
        </div>
        <div>
            <h3 data-en="Follow Us" data-hi="Follow Us">Follow Us</h3>
            <p><a href="https://www.linkedin.com/company/naamin/" target="_blank" rel="noopener">LinkedIn</a></p>
            <p><a href="#" target="_blank" rel="noopener">Instagram</a></p>
            <p><a href="#" target="_blank" rel="noopener">Facebook</a></p>
        </div>
        <div>
            <h3 data-en="Contact" data-hi="Contact">Contact</h3>
            <p><a href="tel:+919413678955">+91 94136 78955</a></p>
            <p><a href="mailto:naamin.com@gmail.com">naamin.com@gmail.com</a></p>
            <p data-en="Hyderabad, Telangana, India" data-hi="Hyderabad, Telangana, India">Hyderabad, Telangana, India</p>
        </div>
    </div>
    <p class="copyrights" data-en="© 2025 Naamin. All rights reserved." data-hi="© 2025 Naamin. All rights reserved.">© 2025 Naamin. All rights reserved.</p>
</footer>`;

    function normalizePath(pathname) {
        if (!pathname || pathname === "/") return "/index.html";
        const clean = pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
        return clean || "/index.html";
    }

    function getPathFromHref(href) {
        if (!href || href.startsWith("#")) return "";
        try {
            return normalizePath(new URL(href, window.location.origin).pathname);
        } catch (_e) {
            return "";
        }
    }

    function markActiveLinks() {
        const currentPath = normalizePath(window.location.pathname);
        const currentHash = window.location.hash || "";

        document.querySelectorAll(".navbar .nav-links a, .navbar .mobile-nav-links a").forEach((link) => {
            link.classList.remove("active");
            const href = link.getAttribute("href") || "";
            const linkPath = getPathFromHref(href);
            const linkHash = href.includes("#") ? href.slice(href.indexOf("#")) : "";

            if (!linkPath) return;

            const pathMatched = linkPath === currentPath;
            const hashMatched = !linkHash || linkHash === currentHash;

            if (pathMatched && hashMatched) {
                link.classList.add("active");
            }
        });

        const homePaths = new Set(["/index.html", "/"]);
        const backBtn = document.querySelector(".navbar .navbar-back-home");
        if (backBtn && homePaths.has(window.location.pathname)) {
            backBtn.style.display = "none";
        }
    }

    function replaceIfExists(selector, html) {
        const target = document.querySelector(selector);
        if (target) {
            target.outerHTML = html;
            return true;
        }
        return false;
    }

    function applyCommonLayout() {
        const headerReplaced = replaceIfExists("nav.navbar", COMMON_HEADER_HTML);
        const footerReplaced = replaceIfExists("footer", COMMON_FOOTER_HTML);

        if (!headerReplaced && !footerReplaced) {
            return;
        }

        markActiveLinks();
        document.dispatchEvent(new CustomEvent("naamin:layout-ready"));
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", applyCommonLayout, { once: true });
    } else {
        applyCommonLayout();
    }
})();

