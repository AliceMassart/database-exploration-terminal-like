const shellForm = document.forms.namedItem("shellInput");
const commandInput = shellForm.elements.namedItem("cmd");
const terminalOutput = document.getElementById("terminalOutput");

function appendOutput(text, className = "") {
    const line = document.createElement("div");
    line.className = className;
    line.textContent = text;
    terminalOutput.append(line);
}

shellForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const command = commandInput.value.trim();
    if (!command) {
        return;
    }

    appendOutput(`> ${command}`, "command");
    commandInput.value = "";
    commandInput.disabled = true;

    try {
        if (!/^[\w-]+$/.test(command)) {
            appendOutput("Aucune donnée correspondante");
            return;
        }

        const response = await fetch(`data/${encodeURIComponent(command)}.txt`);
        if (response.status === 404) {
            appendOutput("Aucune donnée correspondante");
            return;
        }
        if (!response.ok) {
            throw new Error(`Échec du chargement (${response.status})`);
        }

        const content = await response.text();
        content.split(/\r?\n/).forEach((line) => appendOutput(line, "file-content"));
    } catch (error) {
        console.error("Impossible de charger le fichier demandé.", error);
        appendOutput("Impossible de lire les données correspondantes");
    } finally {
        commandInput.disabled = false;
        commandInput.focus();
    }
});