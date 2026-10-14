import { supabase } from "./supabase.js";


const projectDetail =
    document.getElementById("projectDetail");


async function loadProjectDetail() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const projectId =
        params.get("id");


    if (!projectId) {

        projectDetail.innerHTML = `
            <p class="project-detail-error">
                Không tìm thấy dự án.
            </p>
        `;

        return;
    }


    const {
        data: project,
        error
    } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .eq("is_active", true)
        .single();


    if (error || !project) {

        console.error(
            "Load project detail error:",
            error
        );

        projectDetail.innerHTML = `
            <p class="project-detail-error">
                Dự án không tồn tại
                hoặc chưa được hiển thị.
            </p>
        `;

        return;
    }


   const {
    data: gallery,
    error: galleryError
} = await supabase
    .from("project_images")
    .select("*")
    .eq("project_id", projectId)
    .eq("is_active", true)
    .order("sort_order", {
        ascending: true
    });

if (galleryError) {
    console.error(
        "Load gallery error:",
        galleryError
    );
}

renderProjectDetail(
    project,
    gallery || []
);
}


function renderProjectDetail(project, gallery)  {

    document.title =
        `${project.title} | Sóng Studio`;


    projectDetail.innerHTML = `

        <section class="project-detail-hero">

            <span class="project-detail-category">
                ${project.category || "Dự án"}
            </span>

            <h1>
                ${project.title || "Dự án"}
            </h1>

            <p class="project-detail-description">
                ${project.description || ""}
            </p>

        </section>

        <div class="project-meta">

    <div class="project-meta-item">
        <span>Khách hàng</span>
        <strong>${project.client || "—"}</strong>
    </div>

    <div class="project-meta-item">
        <span>Năm</span>
        <strong>${project.year || "—"}</strong>
    </div>

    <div class="project-meta-item">
        <span>Dịch vụ</span>
        <strong>${project.service || "—"}</strong>
    </div>

</div>

        <div class="project-detail-image">

            ${
                project.thumbnail_url

                    ? `
                        <img
                            src="${project.thumbnail_url}"
                            alt="${project.title || "Dự án"}"
                        >
                    `

                    : `
                        <div class="project-detail-placeholder">
                            Chưa có hình ảnh
                        </div>
                    `
            }

        </div>
        <section class="project-video-section">

    <div class="project-gallery-title">
        <span>VIDEO</span>
        <h2>VIDEO DỰ ÁN.</h2>
    </div>

    ${
        project.video_url
            ? `
                <div class="project-video-wrap">
                    ${getProjectVideoEmbed(project.video_url)}
                </div>
            `
            : `
                <p class="project-gallery-empty">
                    Chưa có video dự án.
                </p>
            `
    }

</section>
            <section class="project-detail-gallery">

    <div class="project-gallery-title">
        <span>GALLERY</span>
        <h2>HÌNH ẢNH DỰ ÁN.</h2>
    </div>

    <div class="project-gallery-grid">

        ${
            gallery.length
                ? gallery.map(image => `
                    <div class="project-gallery-photo">
                        <img
                            src="${image.image_url}"
                            alt="${project.title || "Project gallery"}"
                        >
                    </div>
                `).join("")
                : `
                    <p class="project-gallery-empty">
                        Chưa có ảnh gallery.
                    </p>
                `
        }

    </div>

</section>
    `;
}
function getProjectVideoEmbed(url) {

    if (!url) return "";

    if (
        url.includes("youtube.com") ||
        url.includes("youtu.be")
    ) {

        let videoId = "";

        if (url.includes("youtu.be")) {
            videoId =
                url.split("youtu.be/")[1]
                ?.split("?")[0];
        }

        if (url.includes("youtube.com")) {
            const params =
                new URL(url).searchParams;

            videoId =
                params.get("v");
        }

        if (!videoId) return "";

        return `
            <iframe
                src="https://www.youtube.com/embed/${videoId}"
                title="Project video"
                frameborder="0"
                allow="
                    accelerometer;
                    autoplay;
                    clipboard-write;
                    encrypted-media;
                    gyroscope;
                    picture-in-picture;
                    web-share
                "
                allowfullscreen
            ></iframe>
        `;
    }

    return `
        <video controls>
            <source src="${url}">
        </video>
    `;
}

loadProjectDetail();