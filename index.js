import dicionario from './data/dicionario.json' with { type: 'json' };


function loadDict() {
  const entries = document.getElementById("entries");

  dicionario.map((entry) => {
    const div = document.createElement("div");
    const tran = document.createElement("strong");
    const strong = document.createElement("i");
    const def = document.createElement("p");
    const classif = document.createElement("strong");

    strong.textContent = entry.pt || "(sem termo)";
    tran.textContent = entry.mbl || "(sem tradução)";
    def.textContent = entry.d || "(sem definição)";
    classif.textContent = "   [" + entry.t + "]" || "[sem classificação]"
    const exemploLabel = document.createElement("strong");
    exemploLabel.textContent = "Exemplo: ";

    div.classList.add("entry");
    strong.classList.add("pt");
    tran.classList.add("mbl");

    div.append(
      tran,
      document.createTextNode(`: `),
      strong,
      classif,
      def,
      exemploLabel,
       document.createTextNode(`${entry.e_mbl}`), 
      
      document.createTextNode(` (${entry.e_pt})`),
    );

    entries.appendChild(div);
  });
}

window.onload = function(){
    loadDict();
}
