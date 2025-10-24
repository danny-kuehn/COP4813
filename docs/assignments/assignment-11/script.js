async function loadCourses() {
  try {
    const response = await fetch("data.json");
    const data = await response.json();
    return data.levels;
  } catch (err) {
    console.error("Error loading course data:", err);
    return {};
  }
}

function buildCourseList(levels) {
  const courseList = document.getElementById("course-list");
  courseList.innerHTML = "";

  Object.keys(levels)
    .sort((a, b) => a - b)
    .forEach((level) => {
      const heading = document.createElement("h4");
      heading.textContent = level;
      heading.className = "course-level-heading";
      courseList.appendChild(heading);

      levels[level].forEach((course) => {
        const div = document.createElement("div");
        div.className = "course-item";
        div.innerHTML = `
          <label>
            <input type="checkbox" value="${course.code}" />
            ${course.code} – ${course.name}
          </label>
        `;
        courseList.appendChild(div);
      });
    });
}

function checkEligibility(levels) {
  const taken = Array.from(
    document.querySelectorAll("#course-list input:checked"),
  ).map((cb) => cb.value);

  const availableSection = document.getElementById("available-courses-section");
  const availableDiv = document.getElementById("available-courses");
  availableDiv.innerHTML = "";

  const allCourses = Object.values(levels).flat();
  const eligible = allCourses.filter((c) => {
    if (taken.includes(c.code)) return false;
    if (!c.prereqs.length) return true;

    return c.prereqs.every((group) => {
      if (Array.isArray(group)) {
        return group.some((req) => taken.includes(req));
      } else {
        return taken.includes(group);
      }
    });
  });

  if (eligible.length === 0) {
    availableDiv.textContent =
      "No new classes available based on your selections.";
  } else {
    const grouped = {};
    eligible.forEach((c) => {
      const level = Object.keys(levels).find((lvl) =>
        levels[lvl].some((x) => x.code === c.code),
      );
      if (!grouped[level]) grouped[level] = [];
      grouped[level].push(c);
    });

    Object.keys(grouped)
      .sort((a, b) => a - b)
      .forEach((level) => {
        const heading = document.createElement("h4");
        heading.textContent = level;
        heading.className = "course-level-heading";
        availableDiv.appendChild(heading);

        grouped[level].forEach((c) => {
          const prereqText = c.prereqs.length
            ? c.prereqs
                .map((group) => {
                  if (Array.isArray(group)) {
                    const text = group.join(" or ");
                    return c.prereqs.length > 1 ? `(${text})` : text;
                  }
                  return group;
                })
                .join(" and ")
            : "None";

          const div = document.createElement("div");
          div.className = "course-item";
          div.innerHTML = `
            <div>
              <strong>${c.code}</strong> – ${c.name}
              <div class="course-info">
                <p style="font-size:0.95rem; line-height:1.5;">${c.description}</p>
                <p>
                  <strong>Credits:</strong> ${c.credits}<br/>
                  <strong>Prerequisites:</strong> ${prereqText}<br/>
                  <strong>Offered:</strong> ${c.offered.join(", ")}<br/>
                  ${c.notes ? `<strong>Note:</strong> ${c.notes}` : ""}
                </p>
                ${
                  c.link
                    ? `<a href="${c.link}" target="_blank" rel="noopener">View Catalog</a>`
                    : ""
                }
              </div>
            </div>
          `;
          availableDiv.appendChild(div);
        });
      });
  }

  availableSection.classList.add("visible");
  availableSection.scrollIntoView({ behavior: "smooth" });
}

document.addEventListener("DOMContentLoaded", async () => {
  const levels = await loadCourses();
  buildCourseList(levels);

  document
    .getElementById("check-eligibility")
    .addEventListener("click", () => checkEligibility(levels));
});
