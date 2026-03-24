
// ===== ELEMENTOS =====
let tarefaEmEdicao = null;
const form = document.querySelector("#todo-form");
const input = document.querySelector("#todo-input");
const descricao = document.querySelector("#descricao");
const prioridade = document.querySelector("#prioridade");
const tabela = document.querySelector("#tabelaTarefas");
const filtro = document.querySelector("#filter-select");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const campoDescricao = document.querySelector(".campo")
const searchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#erase-button");


// ===== SALVAR =====
function salvar() {
  const tarefas = [];
  const linhas = tabela.querySelectorAll("tr"); 

  linhas.forEach(function (linha) {
    const tds = linha.querySelectorAll("td");

    tarefas.push({
      titulo: tds[0].textContent,
      descricao: tds[1].textContent,
      prioridade: tds[2].textContent,
      data: tds[3].textContent,
      status: tds[4].textContent,
    });
  });

  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

// ===== CRIAR TAREFA =====
function criarTarefa(titulo, desc, prio, data = null, status = "Pendente") {
  const tr = document.createElement("tr");

  const tdTitulo = document.createElement("td");
  tdTitulo.textContent = titulo;

  const tdDesc = document.createElement("td");
  tdDesc.textContent = desc;

  const tdPrio = document.createElement("td");
  tdPrio.textContent = prio;

  const tdData = document.createElement("td");
  tdData.textContent = data ? data : new Date().toLocaleDateString();

  const tdStatus = document.createElement("td");
  tdStatus.textContent = status;

  const tdAcoes = document.createElement("td");

  // ✔ CONCLUIR//
  const btnCheck = document.createElement("button");
  btnCheck.textContent = "✔";

  btnCheck.addEventListener("click", function () {
    if (tr.classList.contains("concluido")) {
      tr.classList.remove("concluido");
      tdStatus.textContent = "Pendente";
    } else {
      tr.classList.add("concluido");
      tdStatus.textContent = "Concluído";
    }

    salvar();
  });

  // REMOVER//
  const btnDelete = document.createElement("button");
  btnDelete.textContent = "❌";

  btnDelete.addEventListener("click", function () {
    tr.remove();
    salvar();
    verificarListaVazia();
  });

  // ✏ EDITAR//
const btnEdit = document.createElement("button");
btnEdit.textContent = "✏";

btnEdit.addEventListener("click", function () {
    
    form.classList.add("hide");
    const editForm = document.querySelector("#edit-form");
    editForm.classList.remove("hide");
    campoDescricao.classList.add("hide");
    
    const editInput = document.querySelector("#edit-input");
    editInput.value = tdTitulo.textContent;

    tarefaEmEdicao = tr; 
});

  tdAcoes.appendChild(btnCheck);
  tdAcoes.appendChild(btnDelete);
  tdAcoes.appendChild(btnEdit);

  tr.appendChild(tdTitulo);
  tr.appendChild(tdDesc);
  tr.appendChild(tdPrio);
  tr.appendChild(tdData);
  tr.appendChild(tdStatus);
  tr.appendChild(tdAcoes);

  // manter status ao carregar
  if (status === "Concluído") {
    tr.classList.add("concluido");
  }

  tabela.appendChild(tr);
}

//ADICIONAR//
form.addEventListener("submit", function (e) {
  e.preventDefault();

  if (input.value === "" || prioridade.value === "") {
    alert("Preencha os campos!");
    return;
  }

  criarTarefa(input.value, descricao.value, prioridade.value);
  salvar();
  verificarListaVazia();

  input.value = "";
  descricao.value = "";
  prioridade.value = "";
});

   const filterTodos = (filterValue) => {
  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => {
    const isDone = todo.classList.contains("done");

    if (filterValue === "all") {
      todo.style.display = "table-row";
    }

    if (filterValue === "done") {
      todo.style.display = isDone ? "table-row" : "none";
    }

    if (filterValue === "todo") {
      todo.style.display = !isDone ? "table-row" : "none";
    }
  });
};


//CARREGAR//
function carregar() {
  let dados = JSON.parse(localStorage.getItem("tarefas")) || [];

  dados.forEach(function (tarefa) {
    criarTarefa(
      tarefa.titulo,
      tarefa.descricao,
      tarefa.prioridade,
      tarefa.data,
      tarefa.status
    );
  });
  verificarListaVazia();
}

carregar();

// FILTRO //
filtro.addEventListener("change", function () {
  const valor = this.value;
  const linhas = tabela.querySelectorAll("tr");

  linhas.forEach(function (linha) {
    const concluido = linha.classList.contains("concluido");

    if (valor === "all") {
      linha.style.display = "table-row";
    } else if (valor === "done") {
      linha.style.display = concluido ? "table-row" : "none";
    } else if (valor === "todo") {
      linha.style.display = !concluido ? "table-row" : "none";
    }
  });
});


editForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (editInput.value.trim() !== "" && tarefaEmEdicao) {
        
        const tdTitulo = tarefaEmEdicao.querySelector("td");
        
       
        tdTitulo.textContent = editInput.value;

        // Salva no LocalStorage
        salvar();

        // Volta para o formulário inicial
        fecharEdicao();
    }
});

// ===== BUSCA DE TAREFAS =====
searchInput.addEventListener("input", (e) => {
  const search = e.target.value.toLowerCase(); // O que o usuário digitou
  const linhas = tabela.querySelectorAll("tr"); // Todas as linhas da tabela

  linhas.forEach((linha) => {
    
  
    const tdTitulo = linha.querySelector("td");
    
    if (tdTitulo) {
      const titulo = tdTitulo.textContent.toLowerCase();

      // Se o título inclui o que foi digitado, mostra a linha, senão esconde
      if (titulo.includes(search)) {
        linha.style.display = "table-row";
      } else {
        linha.style.display = "none";
      }
    }
  });
});

eraseBtn.addEventListener("click", (e) => {
  e.preventDefault();

  searchInput.value = "";

  searchInput.dispatchEvent(new Event("input"));
});

filtro.addEventListener("change", (e) => {
  const filterValue = e.target.value;

  filterTodos(filterValue);
});


// Botão para limpar a busca e mostrar tudo de novo
eraseBtn.addEventListener("click", function () {
  searchInput.value = "";
  const linhas = tabela.querySelectorAll("tr");
  
  linhas.forEach(function (linha) {
    linha.style.display = ""; // Mostra todas as linhas novamente
  });
});

cancelEditBtn.addEventListener("click", fecharEdicao);

// ===== VERIFICAR LISTA VAZIA =====
function verificarListaVazia() {
  const mensagemVazia = document.querySelector("#mensagem-vazia");
  const linhas = tabela.querySelectorAll("tr");

  if (linhas.length === 0) {
    mensagemVazia.classList.remove("hide");
  } else {
    mensagemVazia.classList.add("hide");
  }
}

function fecharEdicao() {
    editForm.classList.add("hide");
    form.classList.remove("hide");
    campoDescricao.classList.remove("hide");
    tarefaEmEdicao = null;

}

