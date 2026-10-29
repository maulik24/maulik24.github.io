// Two small jobs. Without JavaScript the site still shows everything:
// the placeholder portrait stays, and all roles stay visible.

// 1. Portrait: try site/photo.jpg, then site/photo.png. If neither loads,
//    the marked placeholder underneath stays visible.
function loadPortrait(frame) {
  const sources = ["./photo.jpg", "./photo.png"];
  const img = new Image();
  img.alt = frame.dataset.alt || "";
  let i = 0;
  img.onload = () => {
    frame.prepend(img);
    frame.classList.add("has-photo");
  };
  img.onerror = () => {
    i += 1;
    if (i < sources.length) img.src = sources[i];
  };
  img.src = sources[i];
}

document.querySelectorAll(".portrait").forEach(loadPortrait);

// 2. Skill filter on the Home page: pick a skill, and the roles where I used it
//    light up (hi-vis thread); the rest fade. Pick it again to show all.
function setupSkillFilter() {
  const list = document.querySelector(".roles");
  const chips = document.querySelectorAll(".chip");
  const status = document.querySelector(".filter-status");
  if (!list || !chips.length) return;

  const roles = list.querySelectorAll(".role");

  function show(skill, label) {
    chips.forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.skill === skill)));
    if (!skill) {
      list.classList.remove("filtering");
      roles.forEach((r) => r.classList.remove("match"));
      status.textContent = "";
      return;
    }
    let count = 0;
    roles.forEach((r) => {
      const hit = r.dataset.skills.split(" ").includes(skill);
      r.classList.toggle("match", hit);
      if (hit) count += 1;
    });
    list.classList.add("filtering");
    status.textContent = `${label}: used in ${count} ${count === 1 ? "role" : "roles"}.`;
  }

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const already = chip.getAttribute("aria-pressed") === "true";
      show(already ? null : chip.dataset.skill, chip.textContent.trim());
    });
  });
}

setupSkillFilter();
