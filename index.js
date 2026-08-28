import dicionario from './data/dicionario.json' with { type: 'json' };

var translatorInstance = null;
var isReady = false;
const output = document.getElementById("translatorOutput");
const ipa_output = document.getElementById("ipaOutput");
const libstatus = document.getElementById("libStatus")
async function init() {
    try {
        const response = await fetch('./maxakali.lang');
        const binary = new Uint8Array(await response.arrayBuffer());
        
        const module = await import('./lang_it/lang_it.js');
        translatorInstance = await module.default();
        
        translatorInstance.load(binary);
        isReady = true;
        
        console.log('Translator ready');
        libstatus.innerText = "Biblioteca carregada com sucesso!"
    } catch (error) {
        console.error('Init failed:', error);
        output.innerText = 'Failed to load translator';
    }
}

window.traduzir = function(text) {
    if (!isReady) {
        output.innerText = 'Loading...';
        return;
    }
    try {
        const result = translatorInstance.translate(text);
        const ipa = translatorInstance.ipa(result);
        output.innerText = result || 'No translation';
        ipa_output.innerText = ipa || 'erro no ipa';
    } catch (error) {
        console.error(error);
        output.innerText = 'Erro';
    }
};

function renderEntry(entry, entries) {
    const div = document.createElement("div");
    const tran = document.createElement("strong");
    const strong = document.createElement("i");
    const def = document.createElement("p");
    const classif = document.createElement("strong");

    strong.textContent = entry.pt || "(sem termo)";
    tran.textContent = entry.mbl || "(sem tradução)";
    def.textContent = entry.d || "(sem definição)";
    classif.textContent = entry.t ? ` [${entry.t}]` : " [sem classificação]";

    const exemploLabel = document.createElement("strong");
    exemploLabel.textContent = "Exemplo: ";

    div.classList.add("entry");
    strong.classList.add("pt");
    tran.classList.add("mbl");

    div.append(
        tran,
        document.createTextNode(": "),
        strong,
        classif,
        def,
        exemploLabel,
        document.createTextNode(entry.e_mbl || ""),
        document.createTextNode(entry.e_pt ? ` (${entry.e_pt})` : "")
    );

    entries.appendChild(div);
}

window.updateSearch = function(event) {
    const q = event.target.value.toLowerCase().trim();
    if (!q) {
        renderList(dicionario);
        return;
    }
    const filtered = dicionario.filter(entry =>
        entry.pt?.toLowerCase().includes(q) ||
        entry.mbl?.toLowerCase().includes(q) ||
        entry.d?.toLowerCase().includes(q)
    );
    renderList(filtered);
}

function renderList(list) {
    const entries = document.getElementById("entries");
    entries.innerHTML = ""; 
    list.forEach(entry => renderEntry(entry, entries));
}

function loadDict() {
    renderList(dicionario);
}

// DOM setup
document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById("translatorInput");
    if (input) {
        let timer;
        input.addEventListener('input', function(e) {
            clearTimeout(timer);
            timer = setTimeout(() => {
                if (e.target.value.trim()) {
                    window.traduzir(e.target.value);
                } else {
                    output.innerText = '';
                }
            }, 300);
        });
    }
    loadDict();
    init();
});