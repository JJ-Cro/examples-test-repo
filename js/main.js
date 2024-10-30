function createTreeNode(item) {
    const div = document.createElement("div");
    div.className = "ml-4";

    if (item.type === "folder") {
        div.innerHTML = `
            <div class="flex items-center py-2">
                <button class="flex items-center focus:outline-none" onclick="toggleFolder(this)">
                    <svg class="w-4 h-4 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                    <span class="ml-2 font-medium">${item.name}</span>
                </button>
            </div>
            <div class="hidden ml-4">
                ${item.children.map((child) => createTreeNode(child).outerHTML).join("")}
            </div>
        `;
    } else {
        div.innerHTML = `
            <div class="py-2 cursor-pointer hover:bg-gray-100 rounded px-2" onclick="showExample(${JSON.stringify(
                item
            )})">
                <span class="text-blue-600">${item.name}</span>
            </div>
        `;
    }

    return div;
}

function toggleFolder(button) {
    const content = button.parentElement.nextElementSibling;
    const arrow = button.querySelector("svg");
    content.classList.toggle("hidden");
    arrow.classList.toggle("rotate-90");
}

function showExample(example) {
    const content = document.getElementById("example-content");
    content.innerHTML = `
        <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-2xl font-bold mb-2">${example.metadata.title || example.name}</h2>
            <p class="text-gray-600 mb-4">${example.metadata.description || ""}</p>
            <pre class="bg-gray-50 p-4 rounded overflow-x-auto">
                <code>${example.code}</code>
            </pre>
        </div>
    `;
}

async function loadExamples() {
    try {
        const response = await fetch("/examples-index.json");
        const tree = await response.json();

        const examplesList = document.getElementById("examples-list");
        examplesList.appendChild(createTreeNode(tree));
    } catch (error) {
        console.error("Error loading examples:", error);
    }
}

document.addEventListener("DOMContentLoaded", loadExamples);
