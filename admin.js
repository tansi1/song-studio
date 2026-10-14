/* =========================================================
   SÓNG STUDIO - ADMIN.JS
   Kết nối Supabase Auth + điều hướng dashboard
========================================================= */

import { supabase } from "./supabase.js";


/* =========================================================
   01. DOM
========================================================= */

const navItems = document.querySelectorAll(".nav-item");
const pages = document.querySelectorAll(".admin-page");

const pageTitle = document.querySelector(".admin-header h1");

const adminEmail = document.getElementById("adminEmail");
const logoutBtn = document.getElementById("logoutBtn");


/* =========================================================
   02. KIỂM TRA ĐĂNG NHẬP
========================================================= */

async function checkAuth() {

    const {
        data: { session },
        error
    } = await supabase.auth.getSession();

    if (error) {

        console.error(
            "Lỗi kiểm tra đăng nhập:",
            error
        );

        window.location.href =
            "admin-login.html";

        return null;
    }

    if (!session) {

        window.location.href =
            "admin-login.html";

        return null;
    }

    return session;
}


/* =========================================================
   03. KHỞI TẠO ADMIN
========================================================= */

async function initAdmin() {

    const session = await checkAuth();

    if (!session) return;

    /* Hiển thị email admin */

    if (
        adminEmail &&
        session.user &&
        session.user.email
    ) {

        adminEmail.textContent =
            session.user.email;

    }

    /* Khởi tạo menu */

    initNavigation();

    /* Khởi tạo logout */

    initLogout();

    /* LOAD DATABASE */

    await loadBanners();
    await loadProjects();
    await loadSiteContent();
    await loadVisionItems();
    await loadServiceItems();
    await loadContactInfo();
    await loadSocialLinks();
    await loadMessages();
}


/* =========================================================
   04. ĐIỀU HƯỚNG DASHBOARD
========================================================= */

function initNavigation() {

    navItems.forEach(item => {

        item.addEventListener(
            "click",
            () => {

                const page =
                    item.dataset.page;

                if (!page) return;

                const targetPage =
                    document.getElementById(
                        page
                    );

                if (!targetPage) return;


                /* XÓA ACTIVE MENU */

                navItems.forEach(nav => {

                    nav.classList.remove(
                        "active"
                    );

                });


                /* XÓA ACTIVE PAGE */

                pages.forEach(section => {

                    section.classList.remove(
                        "active"
                    );

                });


                /* ACTIVE MENU */

                item.classList.add(
                    "active"
                );


                /* ACTIVE PAGE */

                targetPage.classList.add(
                    "active"
                );


                /* ĐỔI TIÊU ĐỀ HEADER */

                if (pageTitle) {

                    pageTitle.textContent =
                        item.textContent.trim();

                }


                /* LƯU TAB HIỆN TẠI */

                sessionStorage.setItem(
                    "adminCurrentPage",
                    page
                );

            }
        );

    });


    /* KHÔI PHỤC TAB CŨ */

    const savedPage =
        sessionStorage.getItem(
            "adminCurrentPage"
        );

    if (savedPage) {

        const savedNav =
            document.querySelector(
                `.nav-item[data-page="${savedPage}"]`
            );

        const savedSection =
            document.getElementById(
                savedPage
            );

        if (
            savedNav &&
            savedSection
        ) {

            navItems.forEach(nav => {

                nav.classList.remove(
                    "active"
                );

            });

            pages.forEach(section => {

                section.classList.remove(
                    "active"
                );

            });

            savedNav.classList.add(
                "active"
            );

            savedSection.classList.add(
                "active"
            );

            if (pageTitle) {

                pageTitle.textContent =
                    savedNav.textContent.trim();

            }

        }

    }

}


/* =========================================================
   05. ĐĂNG XUẤT
========================================================= */

function initLogout() {

    if (!logoutBtn) return;

    logoutBtn.addEventListener(
        "click",
        async () => {

            const confirmLogout =
                confirm(
                    "Bạn có chắc muốn đăng xuất?"
                );

            if (!confirmLogout) return;


            logoutBtn.disabled = true;

            logoutBtn.textContent =
                "Đang đăng xuất...";


            const {
                error
            } =
                await supabase.auth
                    .signOut();


            if (error) {

                console.error(
                    "Lỗi đăng xuất:",
                    error
                );

                alert(
                    "Không thể đăng xuất. Vui lòng thử lại."
                );

                logoutBtn.disabled =
                    false;

                logoutBtn.textContent =
                    "Đăng xuất";

                return;
            }


            /* XÓA TAB LƯU */

            sessionStorage.removeItem(
                "adminCurrentPage"
            );


            /* CHUYỂN VỀ LOGIN */

            window.location.href =
                "admin-login.html";

        }
    );

}


/* =========================================================
   06. THEO DÕI THAY ĐỔI AUTH
========================================================= */

supabase.auth.onAuthStateChange(
    (event, session) => {

        if (
            event === "SIGNED_OUT" ||
            !session
        ) {

            window.location.href =
                "admin-login.html";

        }

    }
);


/* =========================================================
   07. CÁC NÚT LƯU TẠM THỜI
   Hiện chưa ghi database.
========================================================= */

function initTemporaryButtons() {

    const buttons =
        document.querySelectorAll(
            ".primary-btn"
        );

    buttons.forEach(button => {

        button.addEventListener(
            "click",
            event => {

                /*
                   Tránh xử lý nút logout
                   hoặc submit đặc biệt
                */

                if (
                    button.id ===
                    "logoutBtn"
                ) {
                    return;
                }

                /*
                   Nếu button nằm trong form
                   thật sau này thì sẽ xử lý
                   riêng.
                */

                const form =
                    button.closest(
                        "form"
                    );

                if (form) return;

                console.log(
                    "Nút được nhấn:",
                    button.textContent.trim()
                );

            }
        );

    });

}

/* =========================================================
   BANNER MANAGER
========================================================= */

const bannerList =
    document.getElementById("bannerList");

const addBannerBtn =
    document.getElementById("addBannerBtn");
const projectList =
    document.getElementById("projectList");
const contentList =
    document.getElementById("contentList");
const visionList =
    document.getElementById("visionList");
const serviceList =
    document.getElementById("serviceList");
const addProjectBtn =
    document.getElementById("addProjectBtn");
const contactInfoPanel =
    document.getElementById("contactInfoPanel");
const socialList =
    document.getElementById("socialList");
const messageList =
    document.getElementById("messageList");
if (addProjectBtn) {

    addProjectBtn.addEventListener(
        "click",
        async () => {

            const {
                error
            } = await supabase
                .from("projects")
               .insert({

    title:
        "Dự án mới",

    category:
        "Chưa phân loại",

    client:
        "",

    year:
        "",

    service:
        "",

    video_url:
        "",

    description:
        "",

    thumbnail_url:
        "",

    project_link:
        "",

    sort_order:
        99,

    is_active:
        false

});


            if (error) {

                console.error(
                    "Insert project error:",
                    error
                );

                alert(
                    "Không thể thêm dự án."
                );

                return;
            }


            await loadProjects();
        }
    );
}
if (addProjectBtn) {

    addProjectBtn.addEventListener(
        "click",
        async () => {

            const {
                error
            } = await supabase
                .from("projects")
                .insert({
                    title: "Dự án mới",
                    category: "Chưa phân loại",
                    description: "",
                    thumbnail_url: "",
                    project_link: "",
                    sort_order: 99,
                    is_active: false
                });

            if (error) {

                console.error(
                    "Insert project error:",
                    error
                );

                alert(
                    "Không thể thêm dự án."
                );

                return;
            }

            await loadProjects();
        }
    );
}
/* =========================================================
   LOAD BANNERS
========================================================= */
/* =========================================
   PROJECT MANAGER
========================================= */
async function loadProjects() {

    if (!projectList) return;

    projectList.innerHTML = `
        <p class="loading-text">
            Đang tải dự án...
        </p>
    `;

    const {
        data,
        error
    } = await supabase
        .from("projects")
        .select("*")
        .order("sort_order", {
            ascending: true
        });

    if (error) {

        console.error(
            "Load projects error:",
            error
        );

        projectList.innerHTML = `
            <p style="color:#ff7777;">
                Không thể tải dự án.
            </p>
        `;

        return;
    }

    renderProjects(data || []);
}
/* =========================
   CONTENT MANAGER
========================= */
async function loadSiteContent() {

    if (!contentList) return;

    contentList.innerHTML = `
        <p class="loading-text">
            Đang tải nội dung...
        </p>
    `;

    const {
        data,
        error
    } = await supabase
        .from("site_content")
        .select("*")
        .order("sort_order", {
            ascending: true
        });

    if (error) {

        console.error(
            "Load site content error:",
            error
        );

        contentList.innerHTML = `
            <p style="color:#ff7777;">
                Không thể tải nội dung.
            </p>
        `;

        return;
    }

    renderSiteContent(data || []);
}
function renderSiteContent(items) {

    contentList.innerHTML = "";

    if (!items.length) {

        contentList.innerHTML = `
            <p class="loading-text">
                Chưa có nội dung.
            </p>
        `;

        return;
    }

    items.forEach(item => {

        const editor =
            document.createElement("div");

        editor.className =
            "content-editor";

        editor.dataset.id =
            item.id;

        editor.innerHTML = `

            <div class="content-editor-header">

                <span class="content-section-key">
                    ${escapeHtml(item.section_key || "")}
                </span>

                <h3>
                    ${escapeHtml(item.section_name || "Nội dung")}
                </h3>

            </div>


            <div class="content-form-grid">

                <div class="content-field">
                    <label>Label</label>

                    <input
                        type="text"
                        class="content-label"
                        value="${escapeHtml(item.label || "")}"
                    >
                </div>


                <div class="content-field">
                    <label>Tiêu đề</label>

                    <input
                        type="text"
                        class="content-title"
                        value="${escapeHtml(item.title || "")}"
                    >
                </div>


                <div class="content-field full">
                    <label>Highlight</label>

                    <input
                        type="text"
                        class="content-highlight"
                        value="${escapeHtml(item.highlight || "")}"
                    >
                </div>


                <div class="content-field full">
                    <label>Mô tả</label>

                    <textarea
                        class="content-description"
                    >${escapeHtml(item.description || "")}</textarea>
                </div>


                <div class="content-field">
                    <label>Text nút</label>

                    <input
                        type="text"
                        class="content-button-text"
                        value="${escapeHtml(item.button_text || "")}"
                    >
                </div>


                <div class="content-field">
                    <label>Link nút</label>

                    <input
                        type="text"
                        class="content-button-link"
                        value="${escapeHtml(item.button_link || "")}"
                    >
                </div>


                <div class="content-field full">
                    <label>Image URL</label>

                    <input
                        type="text"
                        class="content-image-url"
                        value="${escapeHtml(item.image_url || "")}"
                    >
                </div>

            </div>


            <label class="content-toggle">

                <input
                    type="checkbox"
                    class="content-active"
                    ${item.is_active ? "checked" : ""}
                >

                Hiển thị section

            </label>


            <div class="content-actions">

                <button
                    type="button"
                    class="content-save"
                >
                    Lưu thay đổi
                </button>

                <p class="content-status"></p>

            </div>

        `;

        contentList.appendChild(editor);

    });

    initContentActions();
}
function initContentActions() {

    document
        .querySelectorAll(".content-editor")
        .forEach(editor => {

            const saveBtn =
                editor.querySelector(".content-save");

            saveBtn?.addEventListener(
                "click",
                () => updateSiteContent(editor)
            );

        });
}
async function updateSiteContent(editor) {

    const id =
        Number(editor.dataset.id);

    const status =
        editor.querySelector(".content-status");

    const payload = {

        label:
            editor.querySelector(".content-label")
            ?.value.trim() || "",

        title:
            editor.querySelector(".content-title")
            ?.value.trim() || "",

        highlight:
            editor.querySelector(".content-highlight")
            ?.value.trim() || "",

        description:
            editor.querySelector(".content-description")
            ?.value.trim() || "",

        button_text:
            editor.querySelector(".content-button-text")
            ?.value.trim() || "",

        button_link:
            editor.querySelector(".content-button-link")
            ?.value.trim() || "",

        image_url:
            editor.querySelector(".content-image-url")
            ?.value.trim() || "",

        is_active:
            editor.querySelector(".content-active")
            ?.checked ?? true
    };

    const {
        error
    } = await supabase
        .from("site_content")
        .update(payload)
        .eq("id", id);

    if (error) {

        console.error(
            "Update site content error:",
            error
        );

        if (status) {

            status.style.color =
                "#ff7777";

            status.textContent =
                "Lưu thất bại.";
        }

        return;
    }

    if (status) {

        status.style.color =
            "#66e6a1";

        status.textContent =
            "Đã lưu thay đổi.";
    }
}
async function loadBanners() {

    if (!bannerList) return;

    bannerList.innerHTML = `
        <p class="loading-text">
            Đang tải banner...
        </p>
    `;

    const {
        data,
        error
    } = await supabase
        .from("banners")
        .select("*")
        .order(
            "sort_order",
            { ascending: true }
        );

    if (error) {

        console.error(
            "Load banners error:",
            error
        );

        bannerList.innerHTML = `
            <p style="color:#ff7777;">
                Không thể tải dữ liệu banner.
            </p>
        `;

        return;
    }

    renderBanners(data);

}

/* =========================================================
   LOAD PROJECT
========================================================= */
function renderProjects(projects) {

    projectList.innerHTML = "";

    if (!projects.length) {

        projectList.innerHTML = `
            <p class="loading-text">
                Chưa có dự án nào.
            </p>
        `;

        return;
    }

    projects.forEach(project => {

        const editor =
            document.createElement("div");

        editor.className =
            "project-editor";

        editor.dataset.id =
            project.id;

        editor.innerHTML = `

            <div class="project-editor-header">

                <span class="project-id">
                    PROJECT #${project.id}
                </span>

                <h3>
                    ${escapeHtml(
                        project.title || "Dự án"
                    )}
                </h3>

            </div>


            <div class="project-form-grid">

                <div class="project-field full">

                    <label>Thumbnail</label>

                    <div class="project-image-manager">

                        <img
                            class="project-preview"
                            src="${escapeHtml(
                                project.thumbnail_url || ""
                            )}"
                            alt="Project thumbnail"
                        >

                        <input
                            type="file"
                            class="project-image-file"
                            accept="image/png,image/jpeg,image/webp"
                        >

                        <input
                            type="hidden"
                            class="project-thumbnail-url"
                            value="${escapeHtml(
                                project.thumbnail_url || ""
                            )}"
                        >

                        <button
                            type="button"
                            class="project-upload"
                        >
                            Upload ảnh
                        </button>

                    </div>

                </div>


                <div class="project-field">

                    <label>Tên dự án</label>

                    <input
                        type="text"
                        class="project-title"
                        value="${escapeHtml(
                            project.title || ""
                        )}"
                    >

                </div>


                <div class="project-field">

                    <label>Danh mục</label>

                    <input
                        type="text"
                        class="project-category"
                        value="${escapeHtml(
                            project.category || ""
                        )}"
                    >

                </div>
                        <div class="project-field">
    <label>Khách hàng</label>
    <input
        type="text"
        class="project-client"
        value="${escapeHtml(project.client || "")}"
    >
</div>

<div class="project-field">
    <label>Năm</label>
    <input
        type="text"
        class="project-year"
        value="${escapeHtml(project.year || "")}"
    >
</div>

<div class="project-field">
    <label>Dịch vụ</label>
    <input
        type="text"
        class="project-service"
        value="${escapeHtml(project.service || "")}"
    >
</div>
<div class="project-field full">
    <label>Video dự án</label>
    <input
        type="text"
        class="project-video-url"
        placeholder="Dán link YouTube, Vimeo hoặc video"
        value="${escapeHtml(project.video_url || "")}"
    >
</div>
                <div class="project-field full">

                    <label>Mô tả</label>

                    <textarea
                        class="project-description"
                    >${escapeHtml(
                        project.description || ""
                    )}</textarea>

                </div>


                <div class="project-field">

                    <label>Link dự án</label>

                    <input
                        type="text"
                        class="project-link"
                        value="${escapeHtml(
                            project.project_link || ""
                        )}"
                    >

                </div>


                <div class="project-field">

                    <label>Thứ tự</label>

                    <input
                        type="number"
                        class="project-sort-order"
                        value="${project.sort_order ?? 0}"
                    >

                </div>

            </div>


            <label class="project-toggle">

                <input
                    type="checkbox"
                    class="project-active"
                    ${
                        project.is_active
                            ? "checked"
                            : ""
                    }
                >

                Hiển thị dự án

            </label>
                     
            <div class="project-gallery-manager">

    <div class="project-gallery-head">
        <div>
            <h4>Gallery dự án</h4>
            <p>Upload nhiều ảnh cho trang chi tiết dự án.</p>
        </div>

        <button
            type="button"
            class="project-gallery-upload"
        >
            + Thêm ảnh Gallery
        </button>
    </div>

    <input
        type="file"
        class="project-gallery-files"
        accept="image/png,image/jpeg,image/webp"
        multiple
        hidden
    >

    <div
        class="project-gallery-list"
        data-project-id="${project.id}"
    >
        <p class="project-gallery-loading">
            Đang tải gallery...
        </p>
    </div>

</div>

            <div class="project-actions">

                <button
                    type="button"
                    class="project-save"
                >
                    Lưu thay đổi
                </button>

                <button
                    type="button"
                    class="project-delete"
                >
                    Xóa
                </button>

                <p class="project-status"></p>

            </div>
        `;

        projectList.appendChild(editor);
    });

    initProjectActions();
}
function initProjectActions() {

    document
        .querySelectorAll(".project-editor")
        .forEach(editor => {

            const saveBtn =
                editor.querySelector(".project-save");

            const deleteBtn =
                editor.querySelector(".project-delete");

            const uploadBtn =
                editor.querySelector(".project-upload");

            const galleryBtn =
                 editor.querySelector(".project-gallery-upload");

            const galleryInput =
                editor.querySelector(".project-gallery-files");

            saveBtn?.addEventListener(
                "click",
                () => updateProject(editor)
            );

            deleteBtn?.addEventListener(
                "click",
                () => deleteProject(editor)
            );

            uploadBtn?.addEventListener(
                "click",
                () => uploadProjectImage(editor)
            );
            galleryBtn?.addEventListener(
                 "click",
                () => galleryInput?.click()
            );

            galleryInput?.addEventListener(
                "change",
                () => uploadProjectGallery(editor)
            );

loadProjectGallery(editor);

        });
}
/* =========================================================
 1111
========================================================= */
async function loadProjectGallery(editor) {

    const projectId =
        Number(editor.dataset.id);

    const galleryList =
        editor.querySelector(".project-gallery-list");

    if (!galleryList) return;

    const {
        data,
        error
    } = await supabase
        .from("project_images")
        .select("*")
        .eq("project_id", projectId)
        .order("sort_order", {
            ascending: true
        });

    if (error) {

        console.error(
            "Load gallery error:",
            error
        );

        galleryList.innerHTML = `
            <p class="project-gallery-loading">
                Không thể tải gallery.
            </p>
        `;

        return;
    }

    if (!data || data.length === 0) {

        galleryList.innerHTML = `
            <p class="project-gallery-loading">
                Chưa có ảnh gallery.
            </p>
        `;

        return;
    }

    galleryList.innerHTML = "";

    data.forEach(image => {

        const item =
            document.createElement("div");

        item.className =
            "project-gallery-item";

        item.innerHTML = `
            <img
                src="${image.image_url}"
                alt="Gallery image"
            >

            <button
                type="button"
                class="project-gallery-delete"
            >
                ×
            </button>
        `;

        item
            .querySelector(".project-gallery-delete")
            ?.addEventListener(
                "click",
                () =>
                    deleteProjectGalleryImage(
                        image.id,
                        editor
                    )
            );

        galleryList.appendChild(item);
    });
}
/* =========================================================
  22222
========================================================= */
async function uploadProjectGallery(editor) {

    const projectId =
        Number(editor.dataset.id);

    const input =
        editor.querySelector(".project-gallery-files");

    const button =
        editor.querySelector(".project-gallery-upload");

    const status =
        editor.querySelector(".project-status");

    const files =
        Array.from(input?.files || []);

    if (!files.length) return;

    button.disabled = true;
    button.textContent = "Đang upload...";

    for (let i = 0; i < files.length; i++) {

        const file = files[i];

        const allowedTypes = [
            "image/png",
            "image/jpeg",
            "image/webp"
        ];

        if (!allowedTypes.includes(file.type)) {
            continue;
        }

        if (
            file.size >
            8 * 1024 * 1024
        ) {
            continue;
        }

        const extension =
            file.name
                .split(".")
                .pop()
                .toLowerCase();

        const filePath =
            `${projectId}/${Date.now()}-${crypto.randomUUID()}.${extension}`;

        const {
            error: uploadError
        } = await supabase
            .storage
            .from("project-gallery")
            .upload(
                filePath,
                file,
                {
                    cacheControl: "3600",
                    upsert: false
                }
            );

        if (uploadError) {

            console.error(
                "Gallery upload error:",
                uploadError
            );

            continue;
        }

        const {
            data: publicData
        } = supabase
            .storage
            .from("project-gallery")
            .getPublicUrl(filePath);

        const imageUrl =
            publicData.publicUrl;

        const {
            error: insertError
        } = await supabase
            .from("project_images")
            .insert({
                project_id: projectId,
                image_url: imageUrl,
                sort_order: i,
                is_active: true
            });

        if (insertError) {

            console.error(
                "Insert gallery image error:",
                insertError
            );
        }
    }

    input.value = "";

    button.disabled = false;
    button.textContent =
        "+ Thêm ảnh Gallery";

    if (status) {

        status.style.color =
            "#66e6a1";

        status.textContent =
            "Đã upload gallery.";
    }

    await loadProjectGallery(editor);
}
/* =========================================================
  333333
========================================================= */
async function deleteProjectGalleryImage(
    imageId,
    editor
) {

    if (
        !confirm(
            "Xóa ảnh này khỏi gallery?"
        )
    ) {
        return;
    }

    const {
        error
    } = await supabase
        .from("project_images")
        .delete()
        .eq("id", imageId);

    if (error) {

        console.error(
            "Delete gallery image error:",
            error
        );

        alert(
            "Không thể xóa ảnh."
        );

        return;
    }

    await loadProjectGallery(editor);
}
/* =========================================================
  upload thumbnail
========================================================= */
async function uploadProjectImage(editor) {

    const fileInput =
        editor.querySelector(".project-image-file");

    const urlInput =
        editor.querySelector(".project-thumbnail-url");

    const preview =
        editor.querySelector(".project-preview");

    const uploadBtn =
        editor.querySelector(".project-upload");

    const status =
        editor.querySelector(".project-status");

    const file =
        fileInput?.files?.[0];


    if (!file) {

        if (status) {
            status.style.color = "#ffcc66";
            status.textContent = "Hãy chọn ảnh trước.";
        }

        return;
    }


    const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/webp"
    ];

    if (!allowedTypes.includes(file.type)) {

        if (status) {
            status.style.color = "#ff7777";
            status.textContent =
                "Chỉ hỗ trợ PNG, JPG hoặc WEBP.";
        }

        return;
    }


    if (file.size > 8 * 1024 * 1024) {

        if (status) {
            status.style.color = "#ff7777";
            status.textContent =
                "Ảnh không được lớn hơn 8MB.";
        }

        return;
    }


    uploadBtn.disabled = true;
    uploadBtn.textContent = "Đang upload...";


    const extension =
        file.name
            .split(".")
            .pop()
            .toLowerCase();

    const fileName =
        `${Date.now()}-${crypto.randomUUID()}.${extension}`;

    const filePath =
        `thumbnails/${fileName}`;


    const {
        error
    } = await supabase
        .storage
        .from("projects")
        .upload(
            filePath,
            file,
            {
                cacheControl: "3600",
                upsert: false
            }
        );


    if (error) {

        console.error(
            "Upload project image error:",
            error
        );

        if (status) {
            status.style.color = "#ff7777";
            status.textContent =
                "Upload ảnh thất bại.";
        }

        uploadBtn.disabled = false;
        uploadBtn.textContent = "Upload ảnh";

        return;
    }


    const {
        data
    } = supabase
        .storage
        .from("projects")
        .getPublicUrl(filePath);


    urlInput.value =
        data.publicUrl;

    preview.src =
        data.publicUrl;


    if (status) {
        status.style.color = "#66e6a1";
        status.textContent =
            "Upload thành công. Nhấn Lưu thay đổi.";
    }


    uploadBtn.disabled = false;
    uploadBtn.textContent = "Upload ảnh";
}
/* =========================================================
Lưu project
========================================================= */
async function updateProject(editor) {

    const id =
        Number(editor.dataset.id);

    const status =
        editor.querySelector(".project-status");


    const payload = {
        video_url:
            editor.querySelector(".project-video-url")
                ?.value.trim() || "",
                title:
            editor.querySelector(".project-title")
                ?.value.trim() || "",

                category:
            editor.querySelector(".project-category")
                ?.value.trim() || "",

                client:
    editor.querySelector(".project-client")?.value.trim() || "",

year:
    editor.querySelector(".project-year")?.value.trim() || "",

service:
    editor.querySelector(".project-service")?.value.trim() || "",

        description:
            editor.querySelector(".project-description")
                ?.value.trim() || "",

        thumbnail_url:
            editor.querySelector(".project-thumbnail-url")
                ?.value.trim() || "",

        project_link:
            editor.querySelector(".project-link")
                ?.value.trim() || "",

        sort_order:
            Number(
                editor.querySelector(".project-sort-order")
                    ?.value || 0
            ),

        is_active:
            editor.querySelector(".project-active")
                ?.checked ?? true
    };


    const {
        error
    } = await supabase
        .from("projects")
        .update(payload)
        .eq("id", id);


    if (error) {

        console.error(
            "Update project error:",
            error
        );

        if (status) {
            status.style.color = "#ff7777";
            status.textContent =
                "Lưu thất bại.";
        }

        return;
    }


    if (status) {
        status.style.color = "#66e6a1";
        status.textContent =
            "Đã lưu thay đổi.";
    }
}
/* =========================================================
   Xóa project
========================================================= */
async function deleteProject(editor) {

    const id =
        Number(editor.dataset.id);


    const confirmed =
        confirm(
            "Bạn có chắc muốn xóa dự án này?"
        );

    if (!confirmed) return;


    const {
        error
    } = await supabase
        .from("projects")
        .delete()
        .eq("id", id);


    if (error) {

        console.error(
            "Delete project error:",
            error
        );

        alert(
            "Không thể xóa dự án."
        );

        return;
    }


    await loadProjects();
}
/* =========================================================
   RENDER
========================================================= */

function renderBanners(banners) {

    bannerList.innerHTML = "";

    if (!banners.length) {

        bannerList.innerHTML = `
            <p class="loading-text">
                Chưa có banner nào.
            </p>
        `;

        return;
    }

    banners.forEach(banner => {

        const editor =
            document.createElement("div");

        editor.className =
            "banner-editor";

        editor.dataset.id =
            banner.id;

        editor.innerHTML = `

            <div class="banner-editor-header">

                <div>
                    <span class="banner-id">
                        BANNER #${banner.id}
                    </span>

                    <h3>
                        Slide ${banner.sort_order ?? ""}
                    </h3>
                </div>

            </div>

            <div class="banner-field full">

    <label>Label nhỏ</label>

    <input
        type="text"
        class="banner-label"
        value="${escapeHtml(banner.label || "")}"
    >

</div>
            <div class="banner-form-grid">

                <div class="banner-field full">

    <label>Ảnh banner</label>

    <div class="banner-image-manager">

        <img
            class="banner-preview"
            src="${escapeHtml(banner.image_url || "")}"
            alt="Banner preview"
        >

        <input
            type="file"
            class="banner-image-file"
            accept="image/png,image/jpeg,image/webp"
        >

        <input
            type="hidden"
            class="banner-image-url"
            value="${escapeHtml(banner.image_url || "")}"
        >

        <button
            type="button"
            class="banner-upload"
        >
            Upload ảnh
        </button>

    </div>

</div>


                <div class="banner-field">

                    <label>
                        Tiêu đề
                    </label>

                    <input
                        type="text"
                        class="banner-title"
                        value="${escapeHtml(
                            banner.title || ""
                        )}"
                    >

                </div>


                <div class="banner-field">

                    <label>
                        Dòng nổi bật
                    </label>

                    <input
                        type="text"
                        class="banner-highlight"
                        value="${escapeHtml(
                            banner.highlight || ""
                        )}"
                    >

                </div>


                <div class="banner-field full">

                    <label>
                        Mô tả
                    </label>

                    <textarea
                        class="banner-description"
                    >${escapeHtml(
                        banner.description || ""
                    )}</textarea>

                </div>


                <div class="banner-field">

                    <label>
                        Nội dung nút
                    </label>

                    <input
                        type="text"
                        class="banner-button-text"
                        value="${escapeHtml(
                            banner.button_text || ""
                        )}"
                    >

                </div>


                <div class="banner-field">

                    <label>
                        Link nút
                    </label>

                    <input
                        type="text"
                        class="banner-button-link"
                        value="${escapeHtml(
                            banner.button_link || ""
                        )}"
                    >

                </div>



                <div class="banner-field">

                    <label>
                        Thứ tự
                    </label>

                    <input
                        type="number"
                        class="banner-sort-order"
                        value="${
                            banner.sort_order ?? ""
                        }"
                    >

                </div>

            </div>


            <label class="banner-toggle">

                <input
                    type="checkbox"
                    class="banner-active"
                    ${
                        banner.is_active
                            ? "checked"
                            : ""
                    }
                >

                Hiển thị banner

            </label>


            <div class="banner-actions">

                <div class="banner-actions-left">

                    <button
                        type="button"
                        class="banner-save"
                    >
                        Lưu thay đổi
                    </button>

                    <button
                        type="button"
                        class="banner-delete"
                    >
                        Xóa
                    </button>

                </div>

                <p class="banner-status"></p>

            </div>

        `;

        bannerList.appendChild(
            editor
        );

    });


    initBannerActions();

}


/* =========================================================
   UPDATE / DELETE BUTTONS
========================================================= */

function initBannerActions() {

    document
        .querySelectorAll(".banner-editor")
        .forEach(editor => {

            const saveBtn =
                editor.querySelector(".banner-save");

            const deleteBtn =
                editor.querySelector(".banner-delete");

            const uploadBtn =
                editor.querySelector(".banner-upload");


            /* LƯU NỘI DUNG */
            if (saveBtn) {

                saveBtn.addEventListener(
                    "click",
                    () => {

                        console.log("SAVE BUTTON CLICKED");
                        updateBanner(editor);

                    }
                );

            }


            /* XÓA BANNER */
            if (deleteBtn) {

                deleteBtn.addEventListener(
                    "click",
                    () => {

                        deleteBanner(editor);

                    }
                );

            }


            /* UPLOAD ẢNH */
            if (uploadBtn) {

                uploadBtn.addEventListener(
                    "click",
                    () => {

                        console.log("UPLOAD BUTTON CLICKED");

                        uploadBannerImage(editor);

                    }
                );

            }

        });

}
/* =========================================================
   UPLOAD BANNER IMAGE
========================================================= */

async function uploadBannerImage(editor) {

    console.log("uploadBannerImage đang chạy");


    const fileInput =
        editor.querySelector(".banner-image-file");

    const imageUrlInput =
        editor.querySelector(".banner-image-url");

    const preview =
        editor.querySelector(".banner-preview");

    const uploadBtn =
        editor.querySelector(".banner-upload");

    const status =
        editor.querySelector(".banner-status");


    /* KIỂM TRA ELEMENT */

    if (
        !fileInput ||
        !imageUrlInput ||
        !preview ||
        !uploadBtn
    ) {

        console.error(
            "Không tìm thấy element upload ảnh."
        );

        return;
    }


    const file =
        fileInput.files[0];


    /* CHƯA CHỌN ẢNH */

    if (!file) {

        if (status) {

            status.style.color =
                "#ffcc66";

            status.textContent =
                "Hãy chọn ảnh trước.";

        }

        return;
    }


    /* KIỂM TRA ĐỊNH DẠNG */

    const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/webp"
    ];


    if (
        !allowedTypes.includes(
            file.type
        )
    ) {

        if (status) {

            status.style.color =
                "#ff7777";

            status.textContent =
                "Chỉ hỗ trợ PNG, JPG hoặc WEBP.";

        }

        return;
    }


    /* GIỚI HẠN 8MB */

    if (
        file.size >
        8 * 1024 * 1024
    ) {

        if (status) {

            status.style.color =
                "#ff7777";

            status.textContent =
                "Ảnh không được lớn hơn 8MB.";

        }

        return;
    }


    /* LOADING */

    uploadBtn.disabled = true;

    uploadBtn.textContent =
        "Đang upload...";


    /* TÊN FILE */

    const extension =
        file.name
            .split(".")
            .pop()
            .toLowerCase();


    const fileName =
        `${Date.now()}-${crypto.randomUUID()}.${extension}`;


    const filePath =
        `homepage/${fileName}`;


    /* UPLOAD SUPABASE */

    const {
        error: uploadError
    } = await supabase
        .storage
        .from("banners")
        .upload(
            filePath,
            file,
            {
                cacheControl: "3600",
                upsert: false
            }
        );


    /* UPLOAD ERROR */

    if (uploadError) {

        console.error(
            "Upload error:",
            uploadError
        );


        if (status) {

            status.style.color =
                "#ff7777";

            status.textContent =
                "Upload ảnh thất bại.";

        }


        uploadBtn.disabled =
            false;

        uploadBtn.textContent =
            "Upload ảnh";

        return;
    }


    /* LẤY PUBLIC URL */

    const {
        data
    } = supabase
        .storage
        .from("banners")
        .getPublicUrl(
            filePath
        );


    const publicUrl =
        data.publicUrl;


    /* GẮN URL VÀO FORM */

    imageUrlInput.value =
        publicUrl;


    /* PREVIEW */

    preview.src =
        publicUrl;


    /* THÔNG BÁO */

    if (status) {

        status.style.color =
            "#66e6a1";

        status.textContent =
            "Upload thành công. Nhấn Lưu thay đổi.";

    }


    uploadBtn.disabled =
        false;

    uploadBtn.textContent =
        "Upload ảnh";

}

/* =========================================================
   UPDATE BANNER
========================================================= */

async function updateBanner(editor) {

    const id =
        Number(editor.dataset.id);

    const saveBtn =
        editor.querySelector(
            ".banner-save"
        );

    const status =
        editor.querySelector(
            ".banner-status"
        );

const imageUrlInput =
    editor.querySelector(".banner-image-url");

console.log(
    "URL TRƯỚC KHI LƯU DB:",
    imageUrlInput?.value
);
    const payload = {

        label:
            editor.querySelector(
                ".banner-label"
            ).value.trim(),

        title:
            editor.querySelector(
                ".banner-title"
            ).value.trim(),

        highlight:
            editor.querySelector(
                ".banner-highlight"
            ).value.trim(),

        description:
            editor.querySelector(
                ".banner-description"
            ).value.trim(),

        button_text:
            editor.querySelector(
                ".banner-button-text"
            ).value.trim(),

        button_link:
            editor.querySelector(
                ".banner-button-link"
            ).value.trim(),

        image_url:
    imageUrlInput?.value.trim() || "",

        sort_order:
            Number(
                editor.querySelector(
                    ".banner-sort-order"
                ).value
            ),

        is_active:
            editor.querySelector(
                ".banner-active"
            ).checked

    };


    saveBtn.disabled = true;

    saveBtn.textContent =
        "Đang lưu...";

    status.textContent = "";


 const {
    data,
    error
} = await supabase
    .from("banners")
    .update(payload)
    .eq("id", id)
    .select();
    console.log(
    "DỮ LIỆU SAU KHI LƯU:",
    data
);


    if (error) {

        console.error(
            "Update banner error:",
            error
        );

        status.style.color =
            "#ff7777";

        status.textContent =
            "Lưu thất bại.";

    } else {

        status.style.color =
            "#66e6a1";

        status.textContent =
            "Đã lưu.";

    }


    saveBtn.disabled = false;

    saveBtn.textContent =
        "Lưu thay đổi";

}


/* =========================================================
   DELETE BANNER
========================================================= */

async function deleteBanner(editor) {

    const id =
        Number(editor.dataset.id);

    const accepted =
        confirm(
            "Bạn có chắc muốn xóa banner này?"
        );

    if (!accepted) return;


    const {
        error
    } = await supabase
        .from("banners")
        .delete()
        .eq("id", id);


    if (error) {

        console.error(
            "Delete banner error:",
            error
        );

        alert(
            "Không thể xóa banner."
        );

        return;
    }


    await loadBanners();

}


/* =========================================================
   ADD BANNER
========================================================= */

if (addBannerBtn) {

    addBannerBtn.addEventListener(
        "click",
        async () => {

            const {
                data,
                error
            } = await supabase
                .from("banners")
                .insert({

                    label:
                        "NEW BANNER",

                    title:
                        "TIÊU ĐỀ MỚI",

                    highlight:
                        "NỘI DUNG NỔI BẬT",

                    description:
                        "Nhập mô tả banner.",

                    button_text:
                        "Xem thêm",

                    button_link:
                        "#",

                    image_url:
                        "",

                    sort_order:
                        99,

                    is_active:
                        false

                })
                .select();


            if (error) {

                console.error(
                    "Insert banner error:",
                    error
                );

                alert(
                    "Không thể thêm banner."
                );

                return;
            }


            await loadBanners();

        }
    );

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHtml(value) {

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}

/* =========================================================
   08. INIT
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        await initAdmin();

        initTemporaryButtons();
        await loadProjects();
        await loadSiteContent();
    }
);
/* =========================
   CONTACT INFO MANAGER
========================= */
async function loadContactInfo() {

    if (!contactInfoPanel) return;

    contactInfoPanel.innerHTML = `
        <p class="loading-text">
            Đang tải thông tin liên hệ...
        </p>
    `;

    const {
        data,
        error
    } = await supabase
        .from("contact_info")
        .select("*")
        .order("id", {
            ascending: true
        })
        .limit(1);

    if (error) {

        console.error(
            "Load contact info error:",
            error
        );

        contactInfoPanel.innerHTML = `
            <p style="color:#ff7777;">
                Không thể tải thông tin liên hệ.
            </p>
        `;

        return;
    }

    const contact =
        data?.[0];

    if (!contact) {

        contactInfoPanel.innerHTML = `
            <p class="loading-text">
                Chưa có thông tin liên hệ.
            </p>
        `;

        return;
    }

    renderContactInfo(contact);
}
function renderContactInfo(contact) {

    contactInfoPanel.innerHTML = `

        <div
            class="contact-editor"
            data-id="${contact.id}"
        >

            <div class="contact-form-grid">
                <div class="contact-field full">
    <label>Logo Footer</label>

    <input
        type="text"
        class="contact-logo-url"
        value="${escapeHtml(contact.logo_url || "")}"
    >
</div>

<div class="contact-field full">
    <label>Mô tả Footer</label>

    <textarea
        class="contact-footer-description"
    >${escapeHtml(contact.footer_description || "")}</textarea>
</div>

                <div class="contact-field">
                    <label>Email</label>

                    <input
                        type="email"
                        class="contact-email"
                        value="${escapeHtml(contact.email || "")}"
                    >
                </div>


                <div class="contact-field">
                    <label>Số điện thoại</label>

                    <input
                        type="text"
                        class="contact-phone"
                        value="${escapeHtml(contact.phone || "")}"
                    >
                </div>


                <div class="contact-field full">
                    <label>Địa chỉ</label>

                    <input
                        type="text"
                        class="contact-address"
                        value="${escapeHtml(contact.address || "")}"
                    >
                </div>


                <div class="contact-field full">
                    <label>Footer text</label>

                    <input
                        type="text"
                        class="contact-footer-text"
                        value="${escapeHtml(contact.footer_text || "")}"
                    >
                </div>


                <div class="contact-field full">
                    <label>Copyright</label>

                    <input
                        type="text"
                        class="contact-copyright"
                        value="${escapeHtml(contact.copyright || "")}"
                    >
                </div>

            </div>


            <label class="contact-toggle">

                <input
                    type="checkbox"
                    class="contact-active"
                    ${contact.is_active ? "checked" : ""}
                >

                Hiển thị thông tin

            </label>


            <div class="contact-actions">

                <button
                    type="button"
                    class="contact-save"
                >
                    Lưu thay đổi
                </button>

                <p class="contact-status"></p>

            </div>

        </div>
    `;


    const editor =
        contactInfoPanel.querySelector(".contact-editor");

    const saveBtn =
        editor?.querySelector(".contact-save");

    saveBtn?.addEventListener(
        "click",
        () => updateContactInfo(editor)
    );
}
async function updateContactInfo(editor) {

    const id =
        Number(editor.dataset.id);

    const status =
        editor.querySelector(".contact-status");


    const payload = {


        email:
            editor.querySelector(".contact-email")
            ?.value.trim() || "",

        phone:
            editor.querySelector(".contact-phone")
            ?.value.trim() || "",
             
        logo_url:
            editor.querySelector(".contact-logo-url")
            ?.value.trim() || "",

        footer_description:
            editor.querySelector(".contact-footer-description")
            ?.value.trim() || "",

        address:
            editor.querySelector(".contact-address")
            ?.value.trim() || "",

        footer_text:
            editor.querySelector(".contact-footer-text")
            ?.value.trim() || "",

        copyright:
            editor.querySelector(".contact-copyright")
            ?.value.trim() || "",

        is_active:
            editor.querySelector(".contact-active")
            ?.checked ?? true
    };


    const {
        error
    } = await supabase
        .from("contact_info")
        .update(payload)
        .eq("id", id);


    if (error) {

        console.error(
            "Update contact info error:",
            error
        );

        if (status) {
            status.style.color = "#ff7777";
            status.textContent = "Lưu thất bại.";
        }

        return;
    }


    if (status) {
        status.style.color = "#66e6a1";
        status.textContent = "Đã lưu thay đổi.";
    }
}
/* =========================
   VISION ITEMS MANAGER
========================= */
async function loadVisionItems() {

    if (!visionList) return;

    visionList.innerHTML = `
        <p class="loading-text">
            Đang tải nội dung...
        </p>
    `;

    const {
        data,
        error
    } = await supabase
        .from("vision_items")
        .select("*")
        .order("sort_order", {
            ascending: true
        });

    if (error) {

        console.error(
            "Load vision items error:",
            error
        );

        visionList.innerHTML = `
            <p style="color:#ff7777;">
                Không thể tải nội dung.
            </p>
        `;

        return;
    }

    renderVisionItems(data || []);
}
function renderVisionItems(items) {

    visionList.innerHTML = "";

    if (!items.length) {

        visionList.innerHTML = `
            <p class="loading-text">
                Chưa có nội dung.
            </p>
        `;

        return;
    }


    items.forEach(item => {

        const editor =
            document.createElement("div");

        editor.className =
            "vision-editor";

        editor.dataset.id =
            item.id;


        editor.innerHTML = `

            <div class="vision-editor-header">

                <span class="vision-number-preview">
                    ${escapeHtml(item.number || "")}
                </span>

                <h3>
                    ${escapeHtml(item.title || "Nội dung")}
                </h3>

            </div>


            <div class="vision-form-grid">

                <div class="vision-field">
                    <label>Số thứ tự</label>

                    <input
                        type="text"
                        class="vision-number"
                        value="${escapeHtml(item.number || "")}"
                    >
                </div>


                <div class="vision-field">
                    <label>Tiêu đề</label>

                    <input
                        type="text"
                        class="vision-title"
                        value="${escapeHtml(item.title || "")}"
                    >
                </div>


                <div class="vision-field full">
                    <label>Mô tả</label>

                    <textarea
                        class="vision-description"
                    >${escapeHtml(item.description || "")}</textarea>
                </div>


                <div class="vision-field">
                    <label>Icon key</label>

                    <input
                        type="text"
                        class="vision-icon"
                        value="${escapeHtml(item.icon || "")}"
                    >
                </div>


                <div class="vision-field">
                    <label>Thứ tự hiển thị</label>

                    <input
                        type="number"
                        class="vision-sort-order"
                        value="${item.sort_order ?? 0}"
                    >
                </div>

            </div>


            <label class="vision-toggle">

                <input
                    type="checkbox"
                    class="vision-active"
                    ${item.is_active ? "checked" : ""}
                >

                Hiển thị thẻ

            </label>


            <div class="vision-actions">

                <button
                    type="button"
                    class="vision-save"
                >
                    Lưu thay đổi
                </button>

                <p class="vision-status"></p>

            </div>

        `;


        visionList.appendChild(editor);

    });


    document
        .querySelectorAll(".vision-editor")
        .forEach(editor => {

            const saveBtn =
                editor.querySelector(".vision-save");

            saveBtn?.addEventListener(
                "click",
                () => updateVisionItem(editor)
            );

        });
}
async function updateVisionItem(editor) {

    const id =
        Number(editor.dataset.id);

    const status =
        editor.querySelector(".vision-status");


    const payload = {

        number:
            editor.querySelector(".vision-number")
            ?.value.trim() || "",

        title:
            editor.querySelector(".vision-title")
            ?.value.trim() || "",

        description:
            editor.querySelector(".vision-description")
            ?.value.trim() || "",

        icon:
            editor.querySelector(".vision-icon")
            ?.value.trim() || "",

        sort_order:
            Number(
                editor.querySelector(".vision-sort-order")
                ?.value || 0
            ),

        is_active:
            editor.querySelector(".vision-active")
            ?.checked ?? true
    };


    const {
        error
    } = await supabase
        .from("vision_items")
        .update(payload)
        .eq("id", id);


    if (error) {

        console.error(
            "Update vision item error:",
            error
        );

        if (status) {
            status.style.color = "#ff7777";
            status.textContent = "Lưu thất bại.";
        }

        return;
    }


    if (status) {
        status.style.color = "#66e6a1";
        status.textContent = "Đã lưu thay đổi.";
    }


    await loadVisionItems();
}
/* =========================
   SERVICE ITEMS MANAGER
========================= */

async function loadServiceItems() {

    if (!serviceList) return;

    serviceList.innerHTML = `
        <p class="loading-text">
            Đang tải dịch vụ...
        </p>
    `;

    const {
        data,
        error
    } = await supabase
        .from("service_items")
        .select("*")
        .order("sort_order", {
            ascending: true
        });

    if (error) {

        console.error(
            "Load service items error:",
            error
        );

        serviceList.innerHTML = `
            <p style="color:#ff7777;">
                Không thể tải dịch vụ.
            </p>
        `;

        return;
    }

    renderServiceItems(data || []);
}
function renderServiceItems(items) {

    serviceList.innerHTML = "";

    if (!items.length) {

        serviceList.innerHTML = `
            <p class="loading-text">
                Chưa có dịch vụ.
            </p>
        `;

        return;
    }

    items.forEach(item => {

        const editor =
            document.createElement("div");

        editor.className =
            "service-editor";

        editor.dataset.id =
            item.id;

        editor.innerHTML = `

            <div class="service-editor-header">

                <span class="service-number-preview">
                    ${escapeHtml(item.number || "")}
                </span>

                <h3>
                    ${escapeHtml(item.title || "Dịch vụ")}
                </h3>

            </div>

            <div class="service-form-grid">

                <div class="service-field">
                    <label>Số thứ tự</label>

                    <input
                        type="text"
                        class="service-number"
                        value="${escapeHtml(item.number || "")}"
                    >
                </div>

                <div class="service-field">
                    <label>Tiêu đề</label>

                    <input
                        type="text"
                        class="service-title"
                        value="${escapeHtml(item.title || "")}"
                    >
                </div>

                <div class="service-field full">
                    <label>Mô tả</label>

                    <textarea
                        class="service-description"
                    >${escapeHtml(item.description || "")}</textarea>
                </div>

                <div class="service-field full">
                    <label>Link</label>

                    <input
                        type="text"
                        class="service-link"
                        value="${escapeHtml(item.link || "")}"
                    >
                </div>

                <div class="service-field">
                    <label>Thứ tự hiển thị</label>

                    <input
                        type="number"
                        class="service-sort-order"
                        value="${item.sort_order ?? 0}"
                    >
                </div>

            </div>

            <label class="service-toggle">

                <input
                    type="checkbox"
                    class="service-active"
                    ${item.is_active ? "checked" : ""}
                >

                Hiển thị dịch vụ

            </label>

            <div class="service-actions">

                <button
                    type="button"
                    class="service-save"
                >
                    Lưu thay đổi
                </button>

                <p class="service-status"></p>

            </div>

        `;

        serviceList.appendChild(editor);

    });


    document
        .querySelectorAll(".service-editor")
        .forEach(editor => {

            const saveBtn =
                editor.querySelector(".service-save");

            saveBtn?.addEventListener(
                "click",
                () => updateServiceItem(editor)
            );

        });
}
async function updateServiceItem(editor) {

    const id =
        Number(editor.dataset.id);

    const status =
        editor.querySelector(".service-status");

    const payload = {

        number:
            editor.querySelector(".service-number")
            ?.value.trim() || "",

        title:
            editor.querySelector(".service-title")
            ?.value.trim() || "",

        description:
            editor.querySelector(".service-description")
            ?.value.trim() || "",

        link:
            editor.querySelector(".service-link")
            ?.value.trim() || "",

        sort_order:
            Number(
                editor.querySelector(".service-sort-order")
                ?.value || 0
            ),

        is_active:
            editor.querySelector(".service-active")
            ?.checked ?? true
    };


    const {
        error
    } = await supabase
        .from("service_items")
        .update(payload)
        .eq("id", id);


    if (error) {

        console.error(
            "Update service item error:",
            error
        );

        if (status) {
            status.style.color = "#ff7777";
            status.textContent = "Lưu thất bại.";
        }

        return;
    }


    if (status) {
        status.style.color = "#66e6a1";
        status.textContent = "Đã lưu thay đổi.";
    }

    await loadServiceItems();
}
/* =========================
   SOCIAL MEDIA MANAGER
========================= */

async function loadSocialLinks() {

    if (!socialList) return;

    socialList.innerHTML = `
        <p class="loading-text">
            Đang tải Social Media...
        </p>
    `;

    const {
        data,
        error
    } = await supabase
        .from("social_links")
        .select("*")
        .order("sort_order", {
            ascending: true
        });

    if (error) {

        console.error(
            "Load social links error:",
            error
        );

        socialList.innerHTML = `
            <p style="color:#ff7777;">
                Không thể tải Social Media.
            </p>
        `;

        return;
    }

    renderSocialLinks(data || []);
}
function renderSocialLinks(items) {

    socialList.innerHTML = "";

    if (!items.length) {

        socialList.innerHTML = `
            <p class="loading-text">
                Chưa có Social Media.
            </p>
        `;

        return;
    }

    items.forEach(item => {

        const editor =
            document.createElement("div");

        editor.className =
            "social-editor";

        editor.dataset.id =
            item.id;

        editor.innerHTML = `

            <div class="social-editor-header">
                <h3>
                    ${escapeHtml(item.platform || "Social")}
                </h3>
            </div>


            <div class="social-form-grid">

                <div class="social-field full">
                    <label>Link</label>

                    <input
                        type="text"
                        class="social-url"
                        value="${escapeHtml(item.url || "")}"
                    >
                </div>


                <div class="social-field">
                    <label>Thứ tự</label>

                    <input
                        type="number"
                        class="social-sort-order"
                        value="${item.sort_order ?? 0}"
                    >
                </div>

            </div>


            <label class="social-toggle">

                <input
                    type="checkbox"
                    class="social-active"
                    ${item.is_active ? "checked" : ""}
                >

                Hiển thị

            </label>


            <div class="social-actions">

                <button
                    type="button"
                    class="social-save"
                >
                    Lưu thay đổi
                </button>

                <p class="social-status"></p>

            </div>

        `;

        socialList.appendChild(editor);

    });


    document
        .querySelectorAll(".social-editor")
        .forEach(editor => {

            const saveBtn =
                editor.querySelector(".social-save");

            saveBtn?.addEventListener(
                "click",
                () => updateSocialLink(editor)
            );

        });
}
async function updateSocialLink(editor) {

    const id =
        Number(editor.dataset.id);

    const status =
        editor.querySelector(".social-status");


    const payload = {

        url:
            editor.querySelector(".social-url")
            ?.value.trim() || "",

        sort_order:
            Number(
                editor.querySelector(".social-sort-order")
                ?.value || 0
            ),

        is_active:
            editor.querySelector(".social-active")
            ?.checked ?? true
    };


    const {
        error
    } = await supabase
        .from("social_links")
        .update(payload)
        .eq("id", id);


    if (error) {

        console.error(
            "Update social link error:",
            error
        );

        if (status) {
            status.style.color = "#ff7777";
            status.textContent = "Lưu thất bại.";
        }

        return;
    }


    if (status) {
        status.style.color = "#66e6a1";
        status.textContent = "Đã lưu thay đổi.";
    }
}
/* =========================
   CONTACT MESSAGES
========================= */

async function loadMessages() {

    if (!messageList) return;

    messageList.innerHTML = `
        <p class="loading-text">
            Đang tải tin nhắn...
        </p>
    `;

    const {
        data,
        error
    } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", {
            ascending: false
        });

    if (error) {

        console.error(
            "Load messages error:",
            error
        );

        messageList.innerHTML = `
            <p style="color:#ff7777;">
                Không thể tải tin nhắn.
            </p>
        `;

        return;
    }

    renderMessages(data || []);
}


function renderMessages(messages) {

    messageList.innerHTML = "";

    if (!messages.length) {

        messageList.innerHTML = `
            <p class="loading-text">
                Chưa có tin nhắn nào.
            </p>
        `;

        return;
    }

    messages.forEach(message => {

        const card =
            document.createElement("div");

        card.className =
            `message-card ${
                message.is_read
                    ? "is-read"
                    : "is-unread"
            }`;

        card.dataset.id =
            message.id;

        const time =
            message.created_at
                ? new Date(
                    message.created_at
                ).toLocaleString("vi-VN")
                : "";

        card.innerHTML = `

            <div class="message-header">

                <div>

                    <span class="message-state">
                        ${
                            message.is_read
                                ? "ĐÃ ĐỌC"
                                : "CHƯA ĐỌC"
                        }
                    </span>

                    <h3>
                        ${escapeHtml(
                            message.name || "Khách hàng"
                        )}
                    </h3>

                </div>

                <span class="message-time">
                    ${escapeHtml(time)}
                </span>

            </div>


            <div class="message-info">

                <div>
                    <span>Email</span>

                    <a href="mailto:${escapeHtml(
                        message.email || ""
                    )}">
                        ${escapeHtml(
                            message.email || ""
                        )}
                    </a>
                </div>


                <div>
                    <span>Số điện thoại</span>

                    <a href="tel:${escapeHtml(
                        message.phone || ""
                    )}">
                        ${escapeHtml(
                            message.phone || "Không có"
                        )}
                    </a>
                </div>

            </div>


            <div class="message-content">

                <span>Nội dung</span>

                <p>
                    ${escapeHtml(
                        message.message || ""
                    )}
                </p>

            </div>


            <div class="message-actions">

                <button
                    type="button"
                    class="message-read"
                >
                    ${
                        message.is_read
                            ? "Đánh dấu chưa đọc"
                            : "Đánh dấu đã đọc"
                    }
                </button>

                <button
                    type="button"
                    class="message-delete"
                >
                    Xóa
                </button>

            </div>

        `;

        messageList.appendChild(card);

    });

    initMessageActions();
}


function initMessageActions() {

    document
        .querySelectorAll(".message-card")
        .forEach(card => {

            const readBtn =
                card.querySelector(".message-read");

            const deleteBtn =
                card.querySelector(".message-delete");

            readBtn?.addEventListener(
                "click",
                () => toggleMessageRead(card)
            );

            deleteBtn?.addEventListener(
                "click",
                () => deleteMessage(card)
            );

        });
}


async function toggleMessageRead(card) {

    const id =
        Number(card.dataset.id);

    const isCurrentlyRead =
        card.classList.contains("is-read");

    const {
        error
    } = await supabase
        .from("contact_messages")
        .update({
            is_read: !isCurrentlyRead
        })
        .eq("id", id);

    if (error) {

        console.error(
            "Update message error:",
            error
        );

        alert(
            "Không thể cập nhật trạng thái tin nhắn."
        );

        return;
    }

    await loadMessages();
}


async function deleteMessage(card) {

    const id =
        Number(card.dataset.id);

    const confirmed =
        confirm(
            "Bạn có chắc muốn xóa tin nhắn này?"
        );

    if (!confirmed) return;

    const {
        error
    } = await supabase
        .from("contact_messages")
        .delete()
        .eq("id", id);

    if (error) {

        console.error(
            "Delete message error:",
            error
        );

        alert(
            "Không thể xóa tin nhắn."
        );

        return;
    }

    await loadMessages();
}