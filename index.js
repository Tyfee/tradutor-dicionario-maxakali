import dicionario from './data/dicionario.json' with { type: 'json' };
import importTranslator from './lang_it/engine_mbl_pt_lang_it_test.js'


var tradutorCarregadoComSucesso = false;
const tradutorOuput = document.getElementById("translatorOutput");
var contexto;
window.direcao = {
  "de": "pt",
  "para": "mbl"
}

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${(bytes / Math.pow(k, i)).toFixed(decimals)} ${sizes[i]}`;
}


window.teste_tradutor = function(){
  const libStatus = document.getElementById("libStatus");
  importTranslator().then(Module => {
    const result = Module.translate("hoje", "pt", "mbl", 0);
 if(result) {
      tradutorCarregadoComSucesso = true;
      contexto = Module;
   
      fetch("./lang_it/engine_mbl_pt_lang_it_test.js", { method: "HEAD" })
  .then(res => {
    const size = res.headers.get("content-length");
    console.log("Size (bytes):", formatBytes(size));
     libStatus.innerText = `Biblioteca carregada com sucesso! Tamanho: ${formatBytes(size)}`;
    
  });

    console.log(result);
    }else if(!result){
       tradutorCarregadoComSucesso = false;
      libStatus.innerText = "Biblioteca não foi carregada com sucesso....";
    }
  });


}

window.traduzir = function(valor){
if(tradutorCarregadoComSucesso){
  var traducao = contexto.translate(valor, direcao.de, direcao.para, 0);
  console.log(direcao);
  tradutorOuput.innerText = traducao;
}else{
  tradutorOuput.innerText = "A biblioteca WASM lang_it não pode ser carregada!! Entre em contato comigo para me ajudar a corrigir erros de compatibilidade s2";
}

}


teste_tradutor("hoje", true);


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



window.onload = function(){
    loadDict();
}
