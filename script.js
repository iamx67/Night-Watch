// Функция для переключения разделов
const tabs = document.querySelectorAll(".tab");
const sections = document.querySelectorAll(".section");

tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
        // Переключение активной вкладки
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");

        // Отображение соответствующего раздела
        sections.forEach(section => section.classList.remove("active"));
        sections[index].classList.add("active");
    });
});

// Работа с патрулями
const patrolMembersInput = document.getElementById("patrolMembers");
const memberList = document.getElementById("memberList");
const assemblePatrolButton = document.getElementById("assemblePatrol");
const patrolResult = document.getElementById("patrolResult");
const patrolTypeSelect = document.getElementById("patrolType");
const noViolationsButton = document.getElementById("noViolations");
const yesViolationsButton = document.getElementById("yesViolations");
const violatorsInput = document.getElementById("violators");
const generatePatrolReportButton = document.getElementById("generatePatrolReport");
const patrolReport = document.getElementById("patrolReport");

let selectedLeaders = [];
let members = [];

// Обработка списка участников
patrolMembersInput.addEventListener("input", () => {
    const input = patrolMembersInput.value;
    members = input.split(",").map(name => name.trim()).filter(name => name !== "");
    renderMemberList();
});

// Рендер списка участников
function renderMemberList() {
    memberList.innerHTML = "";
    members.forEach(name => {
        const memberDiv = document.createElement("div");
        memberDiv.textContent = name;
        memberDiv.classList.add("clickable-item");

        // Пометка ведущих
        memberDiv.addEventListener("click", () => {
            if (selectedLeaders.includes(name)) {
                selectedLeaders = selectedLeaders.filter(leader => leader !== name);
                memberDiv.classList.remove("selected");
            } else if (selectedLeaders.length < 2) {
                selectedLeaders.push(name);
                memberDiv.classList.add("selected");
            }
        });

        memberList.appendChild(memberDiv);
    });
}

// Собрать патруль
assemblePatrolButton.addEventListener("click", () => {
    patrolResult.textContent = "";
    if (selectedLeaders.length === 0) {
        patrolResult.textContent = "Ошибка: выберите хотя бы одного ведущего.";
        return;
    }

    const leader1 = selectedLeaders[0];
    const leader2 = selectedLeaders[1] || null;
    const participants = members.filter(name => !selectedLeaders.includes(name));

    if (leader2) {
        // Два маршрута
        const half = Math.ceil(participants.length / 2);
        const route1 = participants.slice(0, half).join(", ") || "—";
        const route2 = participants.slice(half).join(", ") || "—";

        patrolResult.textContent = `[1] ${getLeaderVerb(leader1)}: ${leader1}. Участники: ${route1}.\n[2] ${getLeaderVerb(leader2)}: ${leader2}. Участники: ${route2}.`;
    } else {
        // Один маршрут
        patrolResult.textContent = `[1-2] ${getLeaderVerb(leader1)}: ${leader1}. Участники: ${participants.join(", ") || "—"}.`;
    }
});

// Определение формы "Вёл/Вела"
function getLeaderVerb(name) {
    const lastChar = name.slice(-1);
    if (["а", "ь"].includes(lastChar) || name.endsWith("ая")) {
        return "Вела";
    }
    return "Вёл";
}

// Составление отчета патруля
noViolationsButton.addEventListener("click", () => {
    violatorsInput.parentElement.classList.add("hidden");
    violatorsInput.value = "";
});

yesViolationsButton.addEventListener("click", () => {
    violatorsInput.parentElement.classList.remove("hidden");
});

generatePatrolReportButton.addEventListener("click", () => {
    const today = new Date().toLocaleDateString("ru-RU");
    const type = patrolTypeSelect.value;
    const violators = violatorsInput.value || "—";
    patrolReport.textContent = `[code][b]${today}[/b][/code]\n[code][i]${type}[/i][/code]\n${patrolResult.textContent}\nНарушители: ${violators}.`;
});

// Работа с дозором
const watchTimeInput = document.getElementById("watchTime");
const watchMembersInput = document.getElementById("watchMembers");
const noWatchViolationsButton = document.getElementById("noWatchViolations");
const yesWatchViolationsButton = document.getElementById("yesWatchViolations");
const watchViolatorsInput = document.getElementById("watchViolators");
const generateWatchReportButton = document.getElementById("generateWatchReport");
const watchReport = document.getElementById("watchReport");

// Составление отчета дозора
noWatchViolationsButton.addEventListener("click", () => {
    watchViolatorsInput.parentElement.classList.add("hidden");
    watchViolatorsInput.value = "";
});

yesWatchViolationsButton.addEventListener("click", () => {
    watchViolatorsInput.parentElement.classList.remove("hidden");
});

generateWatchReportButton.addEventListener("click", () => {
    const today = new Date().toLocaleDateString("ru-RU");
    const time = watchTimeInput.value || "чч:мм-чч:мм";
    const members = watchMembersInput.value
        .split(",")
        .map(name => name.trim())
        .filter(name => name !== "");
    const violators = watchViolatorsInput.value || "—";

    const locations = ["(Роща)", "(Тропа забвения)"];
    const memberList = members
        .map((name, index) => `${name} ${locations[index % locations.length]}`)
        .join(", ");

    watchReport.textContent = `[code][i]${today}[/i][/code]\n[code][u]Пассивный дозор[/u][/code]\n[code][b]${time}[/b][/code]\nДежурили: ${memberList}.\nНарушители: ${violators}.`;
});