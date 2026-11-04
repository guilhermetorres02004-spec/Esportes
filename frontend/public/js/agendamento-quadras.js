import { agoraLocal, horario, dataCurta, deslocarData, haConflito, periodoPassado } from "./horto-utils.js";

const elemento = id => document.getElementById(id);
const estado = { quadra: 1, quadras: [], esportes: [], reservas: [], pronto: false, carregando: false, salvando: false, sequencia: 0 };
const dataInput = elemento("data-reserva");
const inicioInput = elemento("inicio");
const fimInput = elemento("fim");
const esporteInput = elemento("esporte");

function mensagem(texto = "", erro = false) {
    elemento("mensagem").textContent = texto;
    elemento("mensagem").classList.toggle("error", erro);
    elemento("mensagem").hidden = !texto;
}

async function requisitar(caminho, opcoes = {}) {
    const resposta = await fetch(caminho, { ...opcoes, credentials: "include", signal: AbortSignal.timeout(12000) });
    if (resposta.status === 401) {
        window.location.replace("login.html?proxima=agendamento-quadras.html");
        throw new Error("Sua sessão expirou. Entre novamente.");
    }
    if (!resposta.ok) {
        const dados = await resposta.json().catch(() => ({}));
        const erro = new Error(dados.mensagem || (resposta.status === 403
            ? "O agendamento está disponível apenas para administradores."
            : "Não foi possível acessar a agenda. Tente novamente."));
        erro.status = resposta.status;
        throw erro;
    }
    return resposta.status === 204 || resposta.headers.get("content-length") === "0"
        ? null : resposta.json();
}

function periodo() {
    return { quadra: estado.quadra, dataReserva: dataInput.value,
        inicioMinutos: Number(inicioInput.value), fimMinutos: Number(fimInput.value) };
}

function nomeQuadra(numero) {
    const quadra = estado.quadras.find(item => item.numero === numero);
    const detalhe = quadra?.tipo === "AREIA" ? "Areia" : quadra?.coberta ? "Coberta" : "";
    return `${quadra?.nome || `Quadra ${numero}`}${detalhe ? ` · ${detalhe}` : ""}`;
}

function conflito(inicio = Number.parseInt(inicioInput.value, 10), fim = Number.parseInt(fimInput.value, 10), quadra = estado.quadra) {
    return haConflito(estado.reservas, quadra, dataInput.value, inicio, fim);
}

function prepararHorarios() {
    for (let minutos = 0; minutos < 1440; minutos += 60) inicioInput.add(new Option(horario(minutos), String(minutos)));
    for (let minutos = 60; minutos <= 1440; minutos += 60) fimInput.add(new Option(horario(minutos), String(minutos)));
    const agora = agoraLocal();
    dataInput.min = agora.data;
    let inicio = (Math.floor(agora.minutos / 60) + 1) * 60;
    dataInput.value = inicio >= 1440 ? deslocarData(agora.data, 1) : agora.data;
    if (inicio >= 1440) inicio = 0;
    inicioInput.value = String(inicio);
    fimInput.value = String(inicio + 60);
}

function desenharQuadras() {
    const foco = document.activeElement?.dataset.quadra;
    const itens = estado.quadras.map(quadra => {
        const botao = document.createElement("button");
        botao.type = "button";
        botao.dataset.quadra = String(quadra.numero);
        const indisponivel = estado.pronto && conflito(undefined, undefined, quadra.numero);
        botao.className = `horto-court${quadra.tipo === "AREIA" ? " sand" : ""}${indisponivel ? " busy" : ""}`;
        botao.setAttribute("aria-pressed", String(estado.quadra === quadra.numero));
        botao.disabled = estado.salvando;
        // A ilustração é esquemática; não representa uma foto ou planta real da quadra.
        botao.innerHTML = '<span class="horto-court-title"><span></span><i class="horto-court-check" aria-hidden="true">✓</i></span>'
            + '<span class="horto-court-type"></span>'
            + '<svg viewBox="0 0 160 80" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.2" opacity=".55"><rect x="17" y="10" width="126" height="60" rx="1"/><path d="M80 10v60M17 25h19v30H17m126-30h-19v30h19"/><circle cx="80" cy="40" r="14"/><path d="M36 25a18 18 0 0 1 0 30m88-30a18 18 0 0 0 0 30"/></g></svg>'
            + '<span class="horto-court-status"></span><span class="horto-court-detail"></span>';
        botao.querySelector(".horto-court-title > span").textContent = quadra.nome;
        botao.querySelector(".horto-court-type").textContent = quadra.tipo === "AREIA"
            ? "Quadra de areia" : quadra.coberta ? "Quadra coberta" : "Quadra";
        botao.querySelector(".horto-court-status").textContent = !estado.pronto ? "Consultando…"
            : !inicioInput.value || !fimInput.value ? "Selecione um horário"
            : indisponivel ? "Indisponível no período"
            : periodoPassado(dataInput.value, Number(inicioInput.value)) ? "Período encerrado" : "Disponível no período";
        const total = estado.reservas.filter(reserva => reserva.quadra === quadra.numero).length;
        botao.querySelector(".horto-court-detail").textContent = `${total} ${total === 1 ? "reserva neste dia" : "reservas neste dia"}`;
        botao.addEventListener("click", () => {
            estado.quadra = quadra.numero;
            mensagem();
            atualizarTela();
            elemento("quadras").querySelector(`[data-quadra="${quadra.numero}"]`)?.focus({ preventScroll: true });
        });
        return botao;
    });
    elemento("quadras").replaceChildren(...itens);
    if (foco) elemento("quadras").querySelector(`[data-quadra="${foco}"]`)?.focus({ preventScroll: true });
}

function desenharSlots() {
    const inicio = Number.parseInt(inicioInput.value, 10), fim = Number.parseInt(fimInput.value, 10);
    const agora = agoraLocal();
    const itens = [];
    for (let minuto = 0; minuto < 1440; minuto += 60) {
        const ocupado = conflito(minuto, minuto + 60);
        const passado = periodoPassado(dataInput.value, minuto, agora);
        const selecionado = minuto >= inicio && minuto < fim;
        const botao = document.createElement("button");
        botao.type = "button";
        botao.className = `horto-slot${ocupado ? " booked" : passado ? " elapsed" : selecionado ? " selected" : ""}`;
        botao.disabled = !estado.pronto || estado.salvando || ocupado || passado;
        botao.setAttribute("aria-pressed", String(selecionado && !ocupado && !passado));
        const intervalo = document.createElement("span");
        intervalo.textContent = `${horario(minuto)} – ${horario(minuto + 60)}`;
        const status = document.createElement("small");
        status.textContent = !estado.pronto ? "Consultando" : ocupado ? "Reservado" : passado ? "Encerrado" : selecionado ? "Selecionado" : "Disponível";
        botao.append(intervalo, status);
        botao.addEventListener("click", () => {
            inicioInput.value = String(minuto);
            fimInput.value = String(minuto + 60);
            mensagem();
            atualizarTela();
            inicioInput.focus({ preventScroll: true });
        });
        itens.push(botao);
    }
    elemento("horarios").replaceChildren(...itens);
}

function desenharReservas() {
    const itens = estado.reservas.map(reserva => {
        const linha = document.createElement("tr");
        const criado = new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo", dateStyle: "short", timeStyle: "short" }).format(new Date(reserva.registradoEm));
        const esporte = estado.esportes.find(item => item.codigo === reserva.esporte)?.nome || "Não informado";
        for (const valor of [nomeQuadra(reserva.quadra), dataCurta(reserva.dataReserva),
            `${horario(reserva.inicioMinutos)} – ${horario(reserva.fimMinutos)}`, esporte, reserva.responsavel, criado]) {
            const celula = document.createElement("td");
            celula.textContent = valor;
            linha.append(celula);
        }
        return linha;
    });
    elemento("reservas").replaceChildren(...itens);
    elemento("reservas-vazias").hidden = !estado.pronto || itens.length > 0;
    elemento("total-reservas").textContent = String(itens.length);
}

function atualizarTela() {
    const hoje = agoraLocal().data;
    dataInput.min = hoje;
    const inicio = Number.parseInt(inicioInput.value, 10), fim = Number.parseInt(fimInput.value, 10);
    const horariosSelecionados = Number.isFinite(inicio) && Number.isFinite(fim);
    const passado = periodoPassado(dataInput.value, inicio);
    const ocupado = conflito();
    for (const opcao of inicioInput.options) {
        const minuto = Number(opcao.value);
        opcao.disabled = opcao.value !== "" && (!estado.pronto || periodoPassado(dataInput.value, minuto) || conflito(minuto, minuto + 60));
    }
    for (const opcao of fimInput.options) {
        const minuto = Number(opcao.value);
        opcao.disabled = opcao.value !== "" && (!estado.pronto || minuto <= inicio || conflito(inicio, minuto));
    }
    const esporteValido = estado.esportes.some(item => item.codigo === esporteInput.value);
    const permitido = estado.pronto && !estado.salvando && horariosSelecionados && !passado && !ocupado && esporteValido && fim - inicio >= 60;
    elemento("confirmar").disabled = !permitido;
    elemento("confirmar").textContent = estado.salvando ? "Confirmando reserva…" : "Confirmar reserva →";
    elemento("status-periodo").textContent = !estado.pronto ? "Aguarde a atualização da agenda para reservar."
        : !horariosSelecionados ? "Selecione os horários de início e término."
        : passado ? "Escolha uma data e um horário futuros."
        : ocupado ? "Período indisponível. Há uma reserva nesse intervalo."
        : !esporteValido ? "Selecione o tipo de esporte para confirmar."
        : "Período disponível para agendamento.";
    elemento("status-periodo").classList.toggle("unavailable", passado || ocupado);
    const duracao = (fim - inicio) / 60;
    elemento("duracao").textContent = horariosSelecionados ? `${duracao} ${duracao === 1 ? "hora" : "horas"}` : "—";
    elemento("quadra-selecionada").textContent = nomeQuadra(estado.quadra).toLocaleUpperCase("pt-BR");
    elemento("form-quadra").textContent = nomeQuadra(estado.quadra);
    elemento("form-data").textContent = dataCurta(dataInput.value);
    elemento("data-extenso").textContent = new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC", day: "numeric", month: "long", year: "numeric" }).format(new Date(`${dataInput.value}T12:00:00Z`));
    elemento("resumo-disponibilidade").textContent = horariosSelecionados
        ? `Disponibilidade para ${horario(inicio)} às ${horario(fim)}.` : "Selecione um horário para consultar a disponibilidade.";
    for (const id of ["data-reserva", "dia-anterior", "dia-seguinte", "hoje", "atualizar", "inicio", "fim", "responsavel", "esporte"]) elemento(id).disabled = estado.salvando;
    elemento("dia-anterior").disabled = estado.salvando || dataInput.value <= hoje;
    desenharQuadras();
    desenharSlots();
    desenharReservas();
}

async function carregarDia() {
    const sequencia = ++estado.sequencia;
    estado.pronto = false;
    estado.carregando = true;
    elemento("atualizacao").textContent = "Atualizando agenda…";
    atualizarTela();
    try {
        const [quadras, reservas, esportes] = await Promise.all([
            requisitar("/api/horto/quadras"),
            requisitar(`/api/horto/reservas?data=${encodeURIComponent(dataInput.value)}`),
            requisitar("/api/horto/esportes"),
        ]);
        if (sequencia !== estado.sequencia) return;
        if (!Array.isArray(quadras) || !Array.isArray(reservas) || !Array.isArray(esportes)) throw new Error("A agenda retornou uma resposta inválida.");
        estado.quadras = quadras;
        estado.reservas = reservas;
        if (JSON.stringify(estado.esportes) !== JSON.stringify(esportes)) {
            const escolhido = esporteInput.value;
            esporteInput.replaceChildren(new Option("Selecione o esporte", ""),
                ...esportes.map(item => new Option(item.nome, item.codigo)));
            esporteInput.value = esportes.some(item => item.codigo === escolhido) ? escolhido : "";
        }
        estado.esportes = esportes;
        estado.pronto = true;
        elemento("atualizacao").textContent = "Agenda atualizada agora";
    } catch (erro) {
        if (sequencia !== estado.sequencia) return;
        elemento("atualizacao").textContent = "Agenda indisponível";
        mensagem(erro.message || "Não foi possível atualizar a agenda.", true);
    } finally {
        if (sequencia === estado.sequencia) {
            estado.carregando = false;
            atualizarTela();
        }
    }
}

function selecionarData(data) {
    if (estado.salvando) return;
    const hoje = agoraLocal().data;
    const anterior = !data || data < hoje;
    dataInput.value = anterior ? hoje : data;
    estado.reservas = [];
    mensagem(anterior ? "Não é permitido agendar em datas anteriores a hoje." : "", anterior);
    carregarDia();
}

elemento("reserva-form").addEventListener("submit", async evento => {
    evento.preventDefault();
    if (!dataInput.value || dataInput.value < agoraLocal().data) {
        selecionarData(agoraLocal().data);
        mensagem("Não é permitido agendar em datas anteriores a hoje.", true);
        return;
    }
    atualizarTela();
    if (!estado.pronto || estado.salvando || elemento("confirmar").disabled) return;
    const pedido = { ...periodo(), responsavel: elemento("responsavel").value.trim(), esporte: esporteInput.value };
    estado.salvando = true;
    mensagem();
    atualizarTela();
    try {
        await requisitar("/api/horto/reservas", { method: "POST",
            headers: { "Content-Type": "application/json" }, body: JSON.stringify(pedido) });
        elemento("reserva-form").reset();
        mensagem(`Reserva confirmada! ${nomeQuadra(pedido.quadra)}, ${dataCurta(pedido.dataReserva)}, das ${horario(pedido.inicioMinutos)} às ${horario(pedido.fimMinutos)}.`);
    } catch (erro) {
        mensagem(erro.message || "Não foi possível confirmar a reserva. Atualize a agenda antes de tentar novamente.", true);
    } finally {
        estado.salvando = false;
        await carregarDia();
    }
});

dataInput.addEventListener("change", () => {
    selecionarData(dataInput.value || agoraLocal().data);
});
inicioInput.addEventListener("change", () => {
    if (inicioInput.value && Number(fimInput.value) <= Number(inicioInput.value)) fimInput.value = String(Number(inicioInput.value) + 60);
    mensagem(); atualizarTela();
});
fimInput.addEventListener("change", () => { mensagem(); atualizarTela(); });
esporteInput.addEventListener("change", () => { mensagem(); atualizarTela(); });
elemento("dia-anterior").addEventListener("click", () => selecionarData(deslocarData(dataInput.value, -1)));
elemento("dia-seguinte").addEventListener("click", () => selecionarData(deslocarData(dataInput.value, 1)));
elemento("hoje").addEventListener("click", () => selecionarData(agoraLocal().data));
elemento("atualizar").addEventListener("click", () => carregarDia());
elemento("sair").addEventListener("click", async () => {
    try { await fetch("/logout", { method: "POST", credentials: "include", signal: AbortSignal.timeout(12000) });
        window.location.href = "login.html";
    } catch { mensagem("Não foi possível encerrar a sessão. Tente novamente.", true); }
});

async function iniciar() {
    try {
        const usuario = await requisitar("/api/auth/me");
        if (!usuario?.authorities?.some(perfil => perfil.authority === "ROLE_ADMIN")) throw new Error("O acesso à agenda exige um perfil administrativo.");
        prepararHorarios();
        elemento("conteudo").hidden = false;
        elemento("acesso").hidden = true;
        await carregarDia();
        setInterval(() => { if (!document.hidden && !estado.salvando && !estado.carregando && dataInput.value) carregarDia(); }, 30000);
    } catch (erro) {
        elemento("acesso").textContent = erro.message || "Não foi possível verificar o acesso. Recarregue a página para tentar novamente.";
    }
}

iniciar();
