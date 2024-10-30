async function loadExamples() {
    try {
        const response = await fetch("/examples-index.json");
        const examples = await response.json();

        const examplesList = document.getElementById("examples-list");
        examples.forEach((example) => {
            const div = document.createElement("div");
            div.className = "p-4 bg-white rounded shadow";
            div.innerHTML = `
                <h2 class="text-xl font-semibold">${example.title}</h2>
                <p class="text-gray-600">${example.description}</p>
                <div class="mt-2">
                    <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">${example.exchange}</span>
                    <span class="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">${example.category}</span>
                </div>
            `;
            examplesList.appendChild(div);
        });
    } catch (error) {
        console.error("Error loading examples:", error);
    }
}

document.addEventListener("DOMContentLoaded", loadExamples);
