/* =====================================
   01. INTRO
===================================== */
import { supabase } from "./supabase.js";
const intro = document.getElementById("intro");

const website = document.getElementById("website");


// Thời gian hiển thị intro: 1.5 giây

const introDuration = 1500;


// Thời gian biến mất: 0.8 giây

const fadeDuration = 800;



function closeIntro() {

    // Cho website xuất hiện

    website.classList.add("show");


    // Intro bắt đầu mờ dần

    intro.classList.add("hide");


    // Cho phép cuộn trang

    document.body.classList.remove("intro-active");


    // Xóa intro sau khi hiệu ứng hoàn tất

    setTimeout(() => {

        intro.remove();

    }, fadeDuration);

}


// Tự động đóng intro

setTimeout(closeIntro, introDuration);

/* =========================================================
   02. BANNER SLIDESHOW FROM SUPABASE
========================================================= */

const slidesContainer =
    document.getElementById("slides");

const dotsContainer =
    document.getElementById("sliderDots");

const prevBtn =
    document.querySelector(".arrow.prev");

const nextBtn =
    document.querySelector(".arrow.next");


let currentSlide = 0;
let slides = [];
let dots = [];
let slideInterval = null;


/* =========================================================
   LOAD BANNERS FROM SUPABASE
========================================================= */

async function loadPublicBanners() {

    if (!slidesContainer) {
        console.error("Không tìm thấy #slides");
        return;
    }

    const {
        data: banners,
        error
    } = await supabase
        .from("banners")
        .select(`
            id,
            label,
            title,
            highlight,
            description,
            button_text,
            button_link,
            image_url,
            sort_order,
            is_active
        `)
        .eq("is_active", true)
        .order("sort_order", {
            ascending: true
        });


    if (error) {

        console.error(
            "Không thể tải banner:",
            error
        );

        slidesContainer.innerHTML = `
            <div class="banner-error">
                Không thể tải banner.
            </div>
        `;

        return;
    }


    if (!banners || banners.length === 0) {

        slidesContainer.innerHTML = `
            <div class="banner-error">
                Hiện chưa có banner.
            </div>
        `;

        return;
    }


    slidesContainer.innerHTML = "";

    if (dotsContainer) {
        dotsContainer.innerHTML = "";
    }


    banners.forEach(
        (banner, index) => {

            createBannerSlide(
                banner,
                index
            );

        }
    );


    slides = Array.from(
        document.querySelectorAll(".slide")
    );

    dots = Array.from(
        document.querySelectorAll(".dot")
    );


    showSlide(0);

    startAutoSlide();
}


/* =========================================================
   CREATE SLIDE
========================================================= */

function createBannerSlide(
    banner,
    index
) {

    const slide =
        document.createElement("div");

    slide.className = "slide";


    if (banner.image_url) {

        slide.style.backgroundImage =
            `url("${banner.image_url}")`;

    }


    const overlay =
        document.createElement("div");

    overlay.className = "overlay";


    const content =
        document.createElement("div");

    content.className = "slide-content";


    /* LABEL */

    const label =
        document.createElement("span");

    label.className = "slide-label";

    label.textContent =
        banner.label || "";


    /* TITLE */

    const heading =
        document.createElement("h1");

    heading.appendChild(
        document.createTextNode(
            banner.title || ""
        )
    );

    heading.appendChild(
        document.createElement("br")
    );


    const highlight =
        document.createElement("span");

    highlight.textContent =
        banner.highlight || "";

    heading.appendChild(
        highlight
    );


    /* DESCRIPTION */

    const description =
        document.createElement("p");

    description.textContent =
        banner.description || "";


    /* BUTTON */

    const button =
        document.createElement("a");

    button.className = "main-btn";

    button.href =
        banner.button_link || "#";


    const buttonText =
        document.createElement("span");

    buttonText.textContent =
        banner.button_text || "Xem thêm";


    const buttonArrow =
        document.createElement("span");

    buttonArrow.textContent = "↗";


    button.appendChild(
        buttonText
    );

    button.appendChild(
        buttonArrow
    );


    /* GHÉP CONTENT */

    content.appendChild(label);

    content.appendChild(heading);

    content.appendChild(description);

    content.appendChild(button);


    /* GHÉP SLIDE */

    slide.appendChild(overlay);

    slide.appendChild(content);

    slidesContainer.appendChild(
        slide
    );


    /* DOT */

    if (dotsContainer) {

        const dot =
            document.createElement(
                "button"
            );

        dot.className = "dot";

        dot.setAttribute(
            "aria-label",
            `Slide ${index + 1}`
        );


        dot.addEventListener(
            "click",
            () => {

                showSlide(index);

                restartAutoSlide();

            }
        );


        dotsContainer.appendChild(
            dot
        );

    }

}


/* =========================================================
   SHOW SLIDE
========================================================= */

function showSlide(index) {

    if (!slides.length) return;


    slides.forEach(
        slide => {

            slide.classList.remove(
                "active"
            );

        }
    );


    dots.forEach(
        dot => {

            dot.classList.remove(
                "active"
            );

        }
    );


    currentSlide =
        (
            index +
            slides.length
        ) %
        slides.length;


    slides[
        currentSlide
    ].classList.add(
        "active"
    );


    if (dots[currentSlide]) {

        dots[
            currentSlide
        ].classList.add(
            "active"
        );

    }

}


/* =========================================================
   NEXT SLIDE
========================================================= */

function nextSlide() {

    showSlide(
        currentSlide + 1
    );

}


/* =========================================================
   PREVIOUS SLIDE
========================================================= */

function previousSlide() {

    showSlide(
        currentSlide - 1
    );

}


/* =========================================================
   AUTO PLAY
========================================================= */

function startAutoSlide() {

    stopAutoSlide();


    if (slides.length <= 1) {
        return;
    }


    slideInterval =
        setInterval(
            () => {

                nextSlide();

            },
            5000
        );

}


/* =========================================================
   STOP AUTO PLAY
========================================================= */

function stopAutoSlide() {

    if (slideInterval) {

        clearInterval(
            slideInterval
        );

        slideInterval = null;

    }

}


/* =========================================================
   RESTART AUTO PLAY
========================================================= */

function restartAutoSlide() {

    stopAutoSlide();

    startAutoSlide();

}


/* =========================================================
   BUTTON NEXT
========================================================= */

if (nextBtn) {

    nextBtn.addEventListener(
        "click",
        () => {

            nextSlide();

            restartAutoSlide();

        }
    );

}


/* =========================================================
   BUTTON PREVIOUS
========================================================= */

if (prevBtn) {

    prevBtn.addEventListener(
        "click",
        () => {

            previousSlide();

            restartAutoSlide();

        }
    );

}


/* =========================================================
   PAUSE KHI CHUYỂN TAB
========================================================= */

document.addEventListener(
    "visibilitychange",
    () => {

        if (document.hidden) {

            stopAutoSlide();

        } else {

            startAutoSlide();

        }

    }
);


/* =========================================================
   START SLIDESHOW
========================================================= */

loadPublicBanners();

/* =====================================



/* =====================================
   03. MOBILE MENU
===================================== */

const menuToggle = document.querySelector(".menu-toggle");

const nav = document.querySelector(".nav");



/* MỞ VÀ ĐÓNG MENU */

menuToggle.addEventListener("click", () => {

    nav.classList.toggle("open");


    const isOpen = nav.classList.contains("open");


    menuToggle.setAttribute(

        "aria-expanded",

        isOpen

    );


    menuToggle.textContent = isOpen ? "✕" : "☰";

});



/* ĐÓNG MENU KHI CHỌN MỤC */

document.querySelectorAll(".nav a").forEach(link => {

    link.addEventListener("click", () => {

        nav.classList.remove("open");


        menuToggle.setAttribute(

            "aria-expanded",

            "false"

        );


        menuToggle.textContent = "☰";

    });

});

/* HIỆU ỨNG XUẤT HIỆN KHI CUỘN */

const revealElements = document.querySelectorAll(
    ".section .container"
);

const revealObserver = new IntersectionObserver(
    (entries, observer) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("visible");

                observer.unobserve(entry.target);

            }

        });

    },
    {
        threshold: 0.1
    }
);

revealElements.forEach(element => {

    element.classList.add("reveal");

    revealObserver.observe(element);

});

/* HIỆU ỨNG ACTIVE MENU KHI CUỘN */

const sections = document.querySelectorAll(
    "section[id]"
);

const navLinks = document.querySelectorAll(
    ".nav a"
);

function updateActiveMenu() {

    let currentSection = "home";

    sections.forEach(section => {

        const sectionTop = section.offsetTop;

        if (window.scrollY >= sectionTop - 150) {
            currentSection = section.getAttribute("id");
        }

    });

    navLinks.forEach(link => {

        link.classList.remove("active");

        if (
            link.getAttribute("href") ===
            "#" + currentSection
        ) {
            link.classList.add("active");
        }

    });

}

window.addEventListener(
    "scroll",
    updateActiveMenu,
    { passive: true }
);

window.addEventListener(
    "load",
    updateActiveMenu
);
/* ==============================
   HIỆU ỨNG CHUYỂN SECTION
============================== */

const motionSections = document.querySelectorAll(
    ".section .container"
);

const motionReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

if (!motionReduced && "IntersectionObserver" in window) {

    // Thiết lập trạng thái ban đầu
    motionSections.forEach(element => {
        element.classList.add("motion-ready");
    });

    // Theo dõi khi nội dung đi vào màn hình
    const motionObserver = new IntersectionObserver(
        (entries) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add(
                        "is-visible"
                    );

                } else {

                    // Đặt lại để có thể chạy lần sau
                    entry.target.classList.remove(
                        "is-visible"
                    );

                }

            });

        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -10% 0px"
        }
    );

    motionSections.forEach(element => {
        motionObserver.observe(element);
    });

    // Kích hoạt lại khi nhấn vào menu
    document.querySelectorAll(
        '.nav a[href^="#"]'
    ).forEach(link => {

        link.addEventListener("click", () => {

            const targetId = link.getAttribute("href");

            const target = document.querySelector(
                targetId
            );

            if (!target) return;

            const content = target.querySelector(
                ".container"
            );

            if (!content) return;

            // Đặt lại hiệu ứng
            content.classList.remove("is-visible");

            // Chạy lại khi nội dung đang trong màn hình
            requestAnimationFrame(() => {

                motionObserver.unobserve(content);
                motionObserver.observe(content);

            });

        });

    });

}
/* ==============================
   CINEMATIC PAGE TRANSITION
============================== */

// Tạo lớp chuyển cảnh tự động

/* ==============================
   CINEMATIC BLUR TRANSITION
============================== */

const transitionLayer = document.createElement("div");
transitionLayer.id = "song-transition-layer";

document.body.appendChild(transitionLayer);

const transitionTime = 550;
let transitionRunning = false;

const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

function changeSection(target) {

    if (transitionRunning) return;

    transitionRunning = true;

    // Giai đoạn 1: Làm mờ cảnh hiện tại
    transitionLayer.classList.add("cover");

    setTimeout(() => {

        // Giai đoạn 2: Chuyển mục khi đang blur
        const header = document.querySelector(".header");

        const headerHeight = header
            ? header.offsetHeight
            : 0;

        const targetPosition =
            target.getBoundingClientRect().top +
            window.scrollY -
            headerHeight;

        // Tắt cuộn mượt để tránh nhìn thấy trang di chuyển
        document.documentElement.style.scrollBehavior = "auto";

        window.scrollTo(
            0,
            Math.max(0, targetPosition)
        );

        // Giai đoạn 3: Làm rõ cảnh mới
        requestAnimationFrame(() => {

            transitionLayer.classList.remove("cover");

        });

        setTimeout(() => {

            transitionRunning = false;

        }, transitionTime);

    }, transitionTime);

}


// Xử lý khi nhấn vào menu

document.addEventListener("click", function(event) {

    const link = event.target.closest(
        '.nav a[href^="#"], .brand[href^="#"]'
    );

    if (!link) return;

    const targetId = link.getAttribute("href");

    if (!targetId || targetId === "#") return;

    const target = document.querySelector(targetId);

    if (!target) return;

    event.preventDefault();
    event.stopPropagation();

    if (prefersReducedMotion) {
        target.scrollIntoView({ behavior: "instant" });
        return;
    }

    if (transitionRunning) return;

    history.replaceState(null, "", targetId);

    // Đóng menu trên điện thoại
    const mobileNav = document.querySelector(".nav");
    const mobileToggle = document.querySelector(".menu-toggle");

    if (mobileNav) {
        mobileNav.classList.remove("open");
    }

    if (mobileToggle) {
        mobileToggle.setAttribute("aria-expanded", "false");
        mobileToggle.textContent = "☰";
    }

    changeSection(target);

}, true);
/* ==============================
   BLUR PAGE TRANSITION
============================== */

const page = document.getElementById("website");

let isChangingPage = false;

const blurDuration = 450;

document.querySelectorAll(
    '.nav a[href^="#"], .brand[href^="#"]'
).forEach(link => {

    link.addEventListener("click", function(event) {

        event.preventDefault();

        if (isChangingPage) return;

        const targetId = this.getAttribute("href");

        const target = document.querySelector(targetId);

        if (!target) return;

        isChangingPage = true;

        // 1. Làm mờ nội dung hiện tại
        page.classList.add("page-blur");

        // 2. Đợi hiệu ứng blur kết thúc
        setTimeout(() => {

            const header = document.querySelector(".header");

            const headerHeight = header
                ? header.offsetHeight
                : 0;

            const targetPosition =
                target.getBoundingClientRect().top +
                window.scrollY -
                headerHeight;

            // Chuyển đến mục mới
            window.scrollTo({
                top: Math.max(0, targetPosition),
                behavior: "instant"
            });

            // Cập nhật địa chỉ
            history.replaceState(
                null,
                "",
                targetId
            );

            // 3. Hiện rõ nội dung mới
            requestAnimationFrame(() => {

                requestAnimationFrame(() => {

                    page.classList.remove("page-blur");

                });

            });

            setTimeout(() => {

                isChangingPage = false;

            }, blurDuration);

        }, blurDuration);

    });

});

const modal = document.getElementById("contactModal");
const openBtn = document.getElementById("openContact");
const closeBtn = document.getElementById("closeContact");

openBtn.addEventListener("click", () => {
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
});

closeBtn.addEventListener("click", () => {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
});
/* ==============================
   CONTACT MODAL
============================== */

const contactModal = document.getElementById("contactModal");
const openContact = document.getElementById("openContact");
const closeContact = document.getElementById("closeContact");

/* MỞ FORM */

openContact.addEventListener("click", function() {
    contactModal.classList.add("active");
});

/* ĐÓNG FORM */

closeContact.addEventListener("click", function() {
    contactModal.classList.remove("active");
});

/* NHẤN RA NGOÀI ĐỂ ĐÓNG */

contactModal.addEventListener("click", function(event) {
    if (event.target === contactModal) {
        contactModal.classList.remove("active");
    }
});

/* NHẤN ESC ĐỂ ĐÓNG */

document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        contactModal.classList.remove("active");
    }
});
/* =========================================================
   PROJECTS FROM SUPABASE
========================================================= */

const projectsGrid =
    document.getElementById("projectsGrid");


async function loadPublicProjects() {
    console.log("BẮT ĐẦU LOAD PROJECT");
    if (!projectsGrid) {
    console.error("KHÔNG TÌM THẤY #projectsGrid");
    return;
}

    const {
        data: projects,
        error
    } = await supabase
        .from("projects")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", {
            ascending: true
        });
        console.log("PROJECT DATA:", projects);
console.log("PROJECT ERROR:", error);

    if (error) {
        console.error("Không thể tải dự án:", error);

        projectsGrid.innerHTML = `
            <p class="projects-loading">
                Không thể tải dự án.
            </p>
        `;

        return;
    }

    if (!projects || projects.length === 0) {
        projectsGrid.innerHTML = `
            <p class="projects-loading">
                Hiện chưa có dự án.
            </p>
        `;

        return;
    }

    renderPublicProjects(projects);
}


function renderPublicProjects(projects) {

    projectsGrid.innerHTML = "";

    projects.forEach(project => {

        const card =
            document.createElement("a");

        card.className =
            "project-card";

       card.href =
    `project-detail.html?id=${project.id}`;


        card.innerHTML = `
            <div class="project-image"
                style="background-image:url('${project.thumbnail_url || ""}')">
            </div>

            <div class="project-overlay"></div>

            <div class="project-content">

                <span class="project-category">
                    ${project.category || "Dự án"}
                </span>

                <h3>
                    ${project.title || "Dự án"}
                </h3>

                <p>
                    ${project.description || ""}
                </p>

                <span class="project-arrow">
                    ↗
                </span>

            </div>
        `;

        projectsGrid.appendChild(card);
    });
}


loadPublicProjects();
/* ==============================
   GỬI FORM QUA FORMSPREE
============================== */

const form = document.getElementById("contactForm");

const formStatus = document.getElementById("formStatus");

const submitBtn = form.querySelector(".submit-btn");

// THAY BẰNG ĐƯỜNG DẪN FORMSPREE CỦA BẠN

const formEndpoint = "https://formspree.io/f/mnpnyerz";


form.addEventListener("submit", async function(event) {

    event.preventDefault();

    // Kiểm tra thông tin bắt buộc

    if (!form.reportValidity()) return;

    // Ngăn gửi nhiều lần

    submitBtn.disabled = true;

    submitBtn.textContent = "ĐANG GỬI...";

    formStatus.textContent = "";


    try {

        // Lấy dữ liệu khách hàng

        const formData = new FormData(form);
        const name =
    form.querySelector('[name="name"]')
    ?.value.trim() || "";

const email =
    form.querySelector('[name="email"]')
    ?.value.trim() || "";
const phone =
    form.querySelector('[name="phone"]')
    ?.value.trim() || "";
const message =
    form.querySelector('[name="message"]')
    ?.value.trim() || "";


const {
    error: messageError
} = await supabase
    .from("contact_messages")
    .insert({
        name,
        email,
        phone,
        message,
        is_read: false
    });
console.log("MESSAGE ERROR:", messageError);

if (messageError) {
    console.error(
        "Save contact message error:",
        messageError
    );
}
        // Gửi đến Formspree

        const response = await fetch(formEndpoint, {

            method: "POST",

            body: formData,

            headers: {
                "Accept": "application/json"
            }

        });


        // Kiểm tra kết quả

        if (response.ok) {

            formStatus.textContent =
                "Thông tin đã được tiếp nhận thành công!";

            formStatus.style.color = "#4ade80";

            // Xóa thông tin đã nhập

            form.reset();

        } else {

            throw new Error("Không thể gửi thông tin.");

        }

    } catch (error) {

        formStatus.textContent =
            "Gửi thất bại. Vui lòng thử lại sau.";

        formStatus.style.color = "#ff6b6b";

    } finally {

        // Khôi phục nút gửi

        submitBtn.disabled = false;

        submitBtn.textContent = "GỬI THÔNG TIN ↗";

    }
/* =========================================================
   SITE CONTENT FROM SUPABASE
========================================================= */








});
async function loadSiteContentPublic() {
console.log("ĐANG LOAD SITE CONTENT");
    const {
        data,
        error
    } = await supabase
        .from("site_content")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", {
            ascending: true
        });
        console.log("SITE CONTENT DATA:", data);
        console.log("SITE CONTENT ERROR:", error);

    if (error) {
        console.error(
            "Load site content error:",
            error
        );
        return;
    }

    data.forEach(item => {
        applySiteContent(item);
    });
}
function applySiteContent(item) {

    const section =
        document.getElementById(item.section_key);

    if (!section) return;


    const label =
        section.querySelector(".section-label");

    if (label && item.label) {
        label.textContent = item.label;
    }


    /* ABOUT */
    if (item.section_key === "about") {

        const heading =
            section.querySelector(".about-heading h2");

        if (heading) {

            heading.innerHTML = `
                ${item.title || ""}
                <br>
                <span>
                    ${item.highlight || ""}
                </span>
            `;
        }
        const paragraphs =
    section.querySelectorAll(".about-content p");

if (paragraphs.length > 0 && item.description) {

    const parts =
        item.description
            .split("\n")
            .filter(Boolean);

    if (paragraphs[0]) {
        paragraphs[0].textContent =
            parts[0] || "";
    }

    if (paragraphs[1]) {
        paragraphs[1].textContent =
            parts[1] || "";
    }
}
const button =
    section.querySelector(".text-btn");

if (button) {

    if (item.button_text) {
        button.textContent =
            `${item.button_text} ↗`;
    }

    if (item.button_link) {
        button.href =
            item.button_link;
    }
}
    }
/* SERVICES */
if (item.section_key === "services") {

    const title =
        section.querySelector(".section-title");

    if (title) {

        title.innerHTML = `
            ${item.title || ""}
            <span>
                ${item.highlight || ""}
            </span>
        `;
    }
}
/* =========================
   PROJECTS
========================= */

if (item.section_key === "projects") {

    const title =
        section.querySelector(".section-title");

    if (title) {

        title.innerHTML = `
            ${item.title || ""}
            <span>
                ${item.highlight || ""}
            </span>
        `;
    }

}
/* =========================
   CONTACT
========================= */

if (item.section_key === "contact") {

    const title =
        section.querySelector("h2");

    if (title) {

        title.innerHTML = `
            ${item.title || ""}
            <br>
            <span>
                ${item.highlight || ""}
            </span>
        `;
    }

    const description =
        section.querySelector("p");

    if (
        description &&
        item.description
    ) {
        description.textContent =
            item.description;
    }

}
}
loadSiteContentPublic();
async function loadPublicContactInfo() {

    const {
        data,
        error
    } = await supabase
        .from("contact_info")
        .select("*")
        .eq("is_active", true)
        .limit(1)
        .maybeSingle();

    console.log("CONTACT DATA:", data);
    console.log("CONTACT ERROR:", error);

    if (error) {
        console.error(
            "Load contact info error:",
            error
        );
        return;
    }

    if (!data) return;


    const tagline =
        document.getElementById("footerTagline");

    const address =
        document.getElementById("footerAddress");

    const email =
        document.getElementById("footerEmail");

    const phone =
        document.getElementById("footerPhone");

    const copyright =
        document.getElementById("footerCopyright");


    if (tagline) {
        tagline.textContent =
            data.footer_text || "";
    }


    if (address) {
        address.textContent =
            data.address || "";
    }


    if (email) {

        email.textContent =
            data.email || "";

        email.href =
            data.email
                ? `mailto:${data.email}`
                : "#";
    }


    if (phone) {

        phone.textContent =
            data.phone || "";

        const cleanPhone =
            (data.phone || "")
                .replace(/[^\d+]/g, "");

        phone.href =
            cleanPhone
                ? `tel:${cleanPhone}`
                : "#";
    }


    if (copyright) {
        copyright.textContent =
            data.copyright || "";
    }
}
loadPublicContactInfo();
/* =========================================================
   VISION ITEMS FROM SUPABASE
========================================================= */

async function loadVisionItemsPublic() {

    const {
        data,
        error
    } = await supabase
        .from("vision_items")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", {
            ascending: true
        });

    if (error) {
        console.error(
            "Load vision items error:",
            error
        );
        return;
    }

    renderVisionItemsPublic(data || []);
}


function renderVisionItemsPublic(items) {

    const cards =
        document.querySelectorAll(
            "#vision .vision-card"
        );

    if (!cards.length) return;


    items.forEach((item, index) => {

        const card =
            cards[index];

        if (!card) return;


        const number =
            card.querySelector(".vision-number");

        const title =
            card.querySelector("h3");

        const description =
            card.querySelector("p");

        const icon =
            card.querySelector(".vision-icon");


        if (number) {
            number.textContent =
                item.number || "";
        }

        if (title) {
            title.textContent =
                item.title || "";
        }

        if (description) {
            description.textContent =
                item.description || "";
        }


        if (icon) {

            if (item.icon === "vision") {
                icon.textContent = "◎";
            }

            else if (item.icon === "mission") {
                icon.textContent = "◉";
            }

            else if (item.icon === "values") {
                icon.textContent = "✧";
            }

        }

    });
}


loadVisionItemsPublic();
/* =========================================================
   SERVICE ITEMS FROM SUPABASE
========================================================= */

async function loadServiceItemsPublic() {

    console.log("ĐANG LOAD SERVICE ITEMS");

    const {
        data,
        error
    } = await supabase
        .from("service_items")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", {
            ascending: true
        });

    console.log("SERVICE DATA:", data);
    console.log("SERVICE ERROR:", error);

    if (error) {
        console.error(
            "Load service items error:",
            error
        );
        return;
    }

    renderServiceItemsPublic(data || []);
}


function renderServiceItemsPublic(items) {

    const cards =
        document.querySelectorAll(
            "#services .service-card"
        );

    if (!cards.length) return;

    items.forEach((item, index) => {
        const serviceContent =
    card.querySelector(".service-content");

let serviceLink =
    card.querySelector(".service-link");

if (!serviceLink && item.link) {

    serviceLink =
        document.createElement("a");

    serviceLink.className =
        "service-link";

    serviceLink.textContent =
        "XEM VIDEO ↗";

    serviceContent.appendChild(serviceLink);
}

if (serviceLink) {

    if (item.link) {

        serviceLink.href = item.link;
        serviceLink.target = "_blank";
        serviceLink.rel = "noopener noreferrer";
        serviceLink.style.display = "inline-flex";

    } else {

        serviceLink.style.display = "none";
    }
}
        const card =
            cards[index];

        if (!card) return;

        const number =
            card.querySelector(".service-number");

        const title =
            card.querySelector("h3");

        const description =
            card.querySelector("p");


        if (number) {
            number.textContent =
                item.number || "";
        }

        if (title) {
            title.textContent =
                item.title || "";
        }

        if (description) {
            description.textContent =
                item.description || "";
        }

    });
}


loadServiceItemsPublic();
/* =========================================================
   SOCIAL LINKS FROM SUPABASE
========================================================= */

async function loadSocialLinksPublic() {

    console.log("ĐANG LOAD SOCIAL LINKS");

    const {
        data,
        error
    } = await supabase
        .from("social_links")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", {
            ascending: true
        });

    console.log("SOCIAL DATA:", data);
    console.log("SOCIAL ERROR:", error);

    if (error) {
        console.error(
            "Load social links error:",
            error
        );
        return;
    }

    renderSocialLinksPublic(data || []);
}


function renderSocialLinksPublic(items) {

    items.forEach(item => {

        const platform =
            (item.platform || "")
                .trim()
                .toLowerCase();

        const link =
            document.querySelector(
                `[data-social="${platform}"]`
            );

        if (!link) {
            console.warn(
                "Không tìm thấy icon:",
                platform
            );
            return;
        }

        link.href =
            item.url || "#";

        link.target =
            "_blank";

        link.rel =
            "noopener noreferrer";
    });
}


loadSocialLinksPublic();