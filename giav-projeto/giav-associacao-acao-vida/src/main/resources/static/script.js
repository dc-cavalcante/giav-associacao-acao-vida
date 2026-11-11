function realizarLogin(event) {
    event.preventDefault();
    document.getElementById('secao-login').style.display = 'none';
    document.getElementById('app-principal').style.display = 'block';
    carregarDadosGerais();
}

function terminarSessao() {
    document.getElementById('app-principal').style.display = 'none';
    document.getElementById('secao-login').style.display = 'flex';
}

function mudarPagina(idSecao, event) {
    event.preventDefault();
    document.querySelectorAll('.pagina-conteudo').forEach(el => {
        el.style.display = 'none';
    });
    document.getElementById(idSecao).style.display = 'block';

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    event.target.classList.add('active');

    if (idSecao === 'secao-familias') carregarFamilias();
    if (idSecao === 'secao-doacoes') carregarDoacoesSeparadas();
    if (idSecao === 'secao-visao') carregarDadosGerais();
}

function alternarContraste() {
    document.body.classList.toggle('high-contrast');
}

// --- MÁSCARAS AUTOMÁTICAS (CPF E TELEFONE) ---
function aplicarMascaraCPF(input) {
    let v = input.value.replace(/\D/g, "");
    if (v.length > 11) v = v.slice(0, 11);
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    input.value = v;
}

function aplicarMascaraTelefone(input) {
    let v = input.value.replace(/\D/g, "");
    if (v.length > 11) v = v.slice(0, 11);
    if (v.length > 10) {
        v = v.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
    } else if (v.length > 5) {
        v = v.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
    } else if (v.length > 2) {
        v = v.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
    } else {
        v = v.replace(/^(\d*)/, "($1");
    }
    input.value = v;
}

document.addEventListener("DOMContentLoaded", () => {
    const inputCpf = document.getElementById("fam-cpf");
    if (inputCpf) inputCpf.addEventListener("input", (e) => aplicarMascaraCPF(e.target));

    const inputTel = document.getElementById("fam-telefone");
    if (inputTel) inputTel.addEventListener("input", (e) => aplicarMascaraTelefone(e.target));
});

// --- GESTÃO DE FAMÍLIAS E MEMBROS ---
function abrirModalFamilia() { 
    document.getElementById('modal-familia').style.display = 'flex'; 
    document.getElementById('fam-membros').value = 1;
    document.getElementById('container-membros-extras').innerHTML = '';
}

function fecharModalFamilia() { 
    document.getElementById('modal-familia').style.display = 'none'; 
}

function gerarCamposMembros() {
    const qtdTotal = parseInt(document.getElementById('fam-membros').value) || 1;
    const container = document.getElementById('container-membros-extras');
    container.innerHTML = '';
    const qtdExtras = qtdTotal - 1;

    if (qtdExtras > 0) {
        let html = '<h4 style="color: #2c3e50; font-size: 14px; margin-bottom: 10px; border-bottom: 1px solid #dee2e6; padding-bottom: 5px;">Dados dos Demais Membros (Dependentes)</h4>';
        
        for (let i = 1; i <= qtdExtras; i++) {
            html += `
                <div style="background: #f8f9fa; padding: 12px; border-radius: 6px; margin-bottom: 10px; border: 1px solid #e9ecef;">
                    <p style="margin: 0 0 8px 0; font-weight: bold; font-size: 12px; color: #495057;">Membro ${i + 1}</p>
                    <div style="margin-bottom: 8px;">
                        <label style="font-size: 12px;">Nome Completo</label>
                        <input type="text" class="membro-nome" required style="width:100%; padding:6px; border:1px solid #ced4da; border-radius:4px; font-size: 13px;">
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <div style="flex: 1; margin-bottom: 8px;">
                            <label style="font-size: 12px;">Data de Nascimento</label>
                            <input type="date" class="membro-nascimento" required style="width:100%; padding:6px; border:1px solid #ced4da; border-radius:4px; font-size: 13px;">
                        </div>
                        <div style="flex: 1; margin-bottom: 8px;">
                            <label style="font-size: 12px;">Parentesco</label>
                            <select class="membro-parentesco" required style="width:100%; padding:6px; border:1px solid #ced4da; border-radius:4px; font-size: 13px;">
                                <option value="Esposa">Esposa</option>
                                <option value="Esposo">Esposo</option>
                                <option value="Filho">Filho</option>
                                <option value="Filha">Filha</option>
                                <option value="Outro">Outro</option>
                            </select>
                        </div>
                    </div>
                </div>
            `;
        }
        container.innerHTML = html;
    }
}

async function registarFamilia(event) {
    event.preventDefault();
    const dadosFamilia = {
        nomeResponsavel: document.getElementById('fam-responsavel').value,
        cpf: document.getElementById('fam-cpf').value,
        telefone: document.getElementById('fam-telefone').value,
        endereco: document.getElementById('fam-endereco').value,
        quantidadeMembros: parseInt(document.getElementById('fam-membros').value),
        dataCadastro: new Date().toISOString().split('T')[0]
    };

    try {
        const resFam = await fetch('/familias', {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dadosFamilia)
        });

        if (resFam.ok) {
            const familiaSalva = await resFam.json();
            
            const nomes = document.querySelectorAll('.membro-nome');
            const nascimentos = document.querySelectorAll('.membro-nascimento');
            const parentescos = document.querySelectorAll('.membro-parentesco');

            for (let i = 0; i < nomes.length; i++) {
                const dadosBeneficiario = {
                    nomeCompleto: `${nomes[i].value} (${parentescos[i].value})`,
                    cpf: "000.000.000-00",
                    dataNascimento: nascimentos[i].value,
                    familia: { id: familiaSalva.id }
                };

                await fetch('beneficiarios', {
                    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dadosBeneficiario)
                });
            }

            alert('Família e membros registados com sucesso!'); 
            fecharModalFamilia(); 
            carregarFamilias(); 
        } else { 
            alert('Erro ao registar família.'); 
        }
    } catch (e) { 
        console.error(e);
        alert('Erro de ligação com a API Spring Boot.'); 
    }
}

async function carregarFamilias() {
    try {
        const res = await fetch('/familias');
        const lista = await res.json();
        const tbody = document.querySelector('#tabela-familias tbody');
        tbody.innerHTML = '';
        
        if (lista.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: #7f8c8d;">Nenhuma família registada.</td></tr>';
            return;
        }

        lista.forEach(f => {
            tbody.innerHTML += `
                <tr>
                    <td>#${f.id}</td>
                    <td>${f.nomeResponsavel}</td>
                    <td>${f.cpf}</td>
                    <td>${f.telefone}</td>
                    <td>${f.endereco}</td>
                    <td>${f.quantidadeMembros}</td>
                    <td><span class="badge active">Ativo</span></td>
                    <td>
                        <button onclick="excluirFamilia(${f.id})" style="background: #e74c3c; color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: bold;">Excluir</button>
                    </td>
                </tr>`;
        });
    } catch (e) { console.error('Erro ao carregar famílias', e); }
}

async function excluirFamilia(id) {
    if (!confirm(`Tem a certeza de que deseja eliminar a família #${id}?`)) {
        return;
    }

    try {
        const res = await fetch(`/familias/${id}`, {
            method: 'DELETE'
        });

        if (res.ok || res.status === 204) {
            alert('Família eliminada com sucesso!');
            carregarFamilias();
        } else {
            alert('Erro ao eliminar a família. Verifique se existem dependências associadas.');
        }
    } catch (e) {
        console.error(e);
        alert('Erro de ligação com a API Spring Boot.');
    }
}

// --- GESTÃO DE ESTOQUE E ENTREGAS ---
function abrirModalRecebimento() { document.getElementById('modal-recebimento').style.display = 'flex'; }
function fecharModalRecebimento() { document.getElementById('modal-recebimento').style.display = 'none'; }

function abrirModalEntrega() { document.getElementById('modal-entrega').style.display = 'flex'; }
function fecharModalEntrega() { document.getElementById('modal-entrega').style.display = 'none'; }

async function registarRecebimento(event) {
    event.preventDefault();
    const dados = {
        descricao: document.getElementById('rec-descricao').value.trim(),
        descricaoItem: document.getElementById('rec-item').value.trim(),
        tipoDoacao: document.getElementById('rec-tipo').value.trim(),
        quantidade: parseInt(document.getElementById('rec-qtd').value),
        dataRecebimento: document.getElementById('rec-data').value,
        dataDoacao: null,
        observacoes: "Entrada em estoque",
        familia: null
    };
    
    try {
        const res = await fetch('/doacoes', {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify(dados)
        });
        
        if (res.ok) { 
            alert('Recebimento registado com sucesso!'); 
            fecharModalRecebimento(); 
            event.target.reset();
            await carregarDoacoesSeparadas(); 
        } else { 
            alert('Erro ao registar recebimento na base de dados.'); 
        }
    } catch (e) { 
        console.error("Erro no fetch:", e);
        alert('Erro de ligação com a API Spring Boot.'); 
    }
}

async function registarEntrega(event) {
    event.preventDefault();
    
    const nomeItemDesejado = document.getElementById('ent-item').value.trim();
    const qtdDesejada = parseInt(document.getElementById('ent-qtd').value);
    const chaveDesejada = nomeItemDesejado.toLowerCase().replace(/\s+/g, ' ');

    try {
        const res = await fetch('/doacoes');
        const lista = await res.json();
        
        let totalRecebido = 0;
        let totalEntregue = 0;

        lista.forEach(d => {
            let nomeBruto = d.descricaoItem || d.descricao || "";
            let chaveItem = nomeBruto.trim().toLowerCase().replace(/\s+/g, ' ');

            if (chaveItem === chaveDesejada) {
                if (d.dataRecebimento && !d.familia) {
                    totalRecebido += d.quantidade;
                } else if (d.dataDoacao || d.familia) {
                    totalEntregue += d.quantidade;
                }
            }
        });

        let saldoAtual = totalRecebido - totalEntregue;

        if (saldoAtual <= 0) {
            alert(`⚠️ Atenção: O produto "${nomeItemDesejado}" não tem estoque disponível no armazém (Saldo atual: ${saldoAtual}). Registe o recebimento primeiro!`);
            return;
        }

        if (qtdDesejada > saldoAtual) {
            alert(`⚠️ Atenção: Estoque insuficiente para "${nomeItemDesejado}". Apenas tem ${saldoAtual} unidade(s) disponível(eis) em estoque.`);
            return;
        }

        const dados = {
            descricao: "Entrega de Donativo",
            descricaoItem: nomeItemDesejado,
            tipoDoacao: "Distribuição",
            quantidade: qtdDesejada,
            dataRecebimento: null,
            dataDoacao: document.getElementById('ent-data').value,
            observacoes: "Entregue à família assistida",
            familia: { id: parseInt(document.getElementById('ent-familia-id').value) }
        };

        const resEnvio = await fetch('/doacoes', {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dados)
        });

        if (resEnvio.ok) { 
            alert('Entrega registada com sucesso!'); 
            fecharModalEntrega(); 
            event.target.reset();
            await carregarDoacoesSeparadas(); 
        } else { 
            alert('Erro ao registar entrega.'); 
        }
    } catch (e) { 
        console.error(e);
        alert('Erro de ligação com a API Spring Boot.'); 
    }
}

// --- FUNÇÃO PARA CARREGAR E SEPARAR DOAÇÕES / ESTOQUE ---
async function carregarDoacoesSeparadas() {
    try {
        const res = await fetch('/doacoes');
        const lista = await res.json();

        const tbodyRecebimentos = document.querySelector('#tabela-recebimentos tbody');
        const tbodyEntregas = document.querySelector('#tabela-entregas tbody');
        const tbodySaldo = document.querySelector('#tabela-saldo-stock tbody');

        if (!tbodyRecebimentos || !tbodyEntregas || !tbodySaldo) return;

        tbodyRecebimentos.innerHTML = '';
        tbodyEntregas.innerHTML = '';
        tbodySaldo.innerHTML = '';

        let recebimentos = [];
        let entregas = [];
        let mapEstoque = {};

        lista.forEach(d => {
            // Se tem data de recebimento ou não tem família associada, consideramos Entrada/Recebimento
            if (d.dataRecebimento && !d.familia) {
                recebimentos.push(d);
                let nomeItem = (d.descricaoItem || d.descricao || "Item Geral").trim();
                let chave = nomeItem.toLowerCase();

                if (!mapEstoque[chave]) {
                    mapEstoque[chave] = { nomeOriginal: nomeItem, recebido: 0, distribuido: 0 };
                }
                mapEstoque[chave].recebido += d.quantidade;
            } else {
                entregas.push(d);
                let nomeItem = (d.descricaoItem || d.descricao || "Item Geral").trim();
                let chave = nomeItem.toLowerCase();

                if (!mapEstoque[chave]) {
                    mapEstoque[chave] = { nomeOriginal: nomeItem, recebido: 0, distribuido: 0 };
                }
                mapEstoque[chave].distribuido += d.quantidade;
            }
        });

        // Preencher Tabela de Entradas (Recebimentos)
        if (recebimentos.length === 0) {
            tbodyRecebimentos.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #7f8c8d;">Nenhum recebimento registado.</td></tr>';
        } else {
            recebimentos.forEach(r => {
                tbodyRecebimentos.innerHTML += `
                    <tr>
                        <td>#${r.id}</td>
                        <td>${r.dataRecebimento || '-'}</td>
                        <td>${r.descricao || '-'}</td>
                        <td>${r.descricaoItem || '-'}</td>
                        <td>${r.tipoDoacao || '-'}</td>
                        <td>${r.quantidade}</td>
                    </tr>`;
            });
        }

        // Preencher Tabela de Histórico de Entregas
       if (entregas.length === 0) {
            tbodyEntregas.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #7f8c8d;">Nenhuma entrega registada.</td></tr>';
        } else {
            entregas.forEach(e => {
                
                let familiaNome = e.familia ? `#${e.familia.id} - ${e.familia.nomeResponsavel || ''}` : 'Não especificada';
                
                tbodyEntregas.innerHTML += `
                    <tr>
                        <td>#${e.id}</td>
                        <td>${e.dataDoacao || '-'}</td>
                        <td>${e.descricaoItem || e.descricao || '-'}</td>
                        <td>${e.quantidade}</td>
                        <td>${familiaNome}</td>
                    </tr>`;
            });
        }

        // Preencher Tabela de Saldo Atual em Estoque
        let chaves = Object.keys(mapEstoque);
        if (chaves.length === 0) {
            tbodySaldo.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #7f8c8d;">Nhum item em estoque.</td></tr>';
        } else {
            chaves.forEach(k => {
                let item = mapEstoque[k];
                let saldoDisponivel = item.recebido - item.distribuido;
                let corSaldo = saldoDisponivel < 0 ? 'color: red; font-weight: bold;' : 'color: #27ae60; font-weight: bold;';

                tbodySaldo.innerHTML += `
                    <tr>
                        <td><strong>${item.nomeOriginal}</strong></td>
                        <td>${item.recebido}</td>
                        <td>${item.distribuido}</td>
                        <td style="${corSaldo}">${saldoDisponivel}</td>
                    </tr>`;
            });
        }

    } catch (e) {
        console.error('Erro ao carregar doações e estoque:', e);
    }
}

// --- MÉTRICAS DO PAINEL GERAL ---
async function carregarDadosGerais() {
    try {
        const resFam = await fetch('/familias');
        const fams = await resFam.json();
        document.getElementById('card-qtd-familias').innerText = fams.length;

        let totalMembros = fams.reduce((acc, f) => acc + (f.quantidadeMembros || 1), 0);
        document.getElementById('card-qtd-beneficiarios').innerText = totalMembros;

        const resDoa = await fetch('/doacoes');
        const doas = await resDoa.json();
        let entregas = doas.filter(d => d.dataDoacao || d.familia);
        document.getElementById('card-qtd-doacoes').innerText = entregas.length;
    } catch (e) { console.error('Erro ao carregar métricas', e); }
}

async function imprimirRelatorio() {
    try {
        // 1. Busca os dados mais recentes das tabelas via API
        const resDoa = await fetch('/doacoes');
        const listaDoacoes = await resDoa.json();

        const resFam = await fetch('/familias');
        const listaFamilias = await resFam.json();

        // 2. Cria uma nova janela limpa no navegador
        const janelaPrint = window.open('', '_blank', 'width=900,height=650');
        
        if (!janelaPrint) {
            alert('O navegador bloqueou a abertura da janela de relatório. Permita os pop-ups para este site.');
            return;
        }

        // 3. Constrói o HTML completo do relatório
        let html = `
            <!DOCTYPE html>
            <html lang="pt">
            <head>
                <meta charset="UTF-8">
                <title>Relatório - Associação Ação Vida (ODS 10)</title>
                <style>
                    body { font-family: Arial, sans-serif; color: #000; margin: 30px; background: #fff; }
                    h1 { text-align: center; color: #2c3e50; font-size: 22px; margin-bottom: 5px; }
                    h2 { text-align: center; color: #555; font-size: 14px; margin-bottom: 30px; font-weight: normal; }
                    h3 { color: #2c3e50; margin-top: 25px; border-bottom: 2px solid #3498db; padding-bottom: 5px; font-size: 15px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 25px; font-size: 12px; }
                    th, td { border: 1px solid #333; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; color: #000; }
                    .footer { text-align: center; margin-top: 40px; font-size: 11px; color: #666; border-top: 1px solid #ccc; padding-top: 10px; }
                </style>
            </head>
            <body>
                <h1>Associação Ação Vida</h1>
                <h2>Relatório Oficial de Gestão e Estoque (ODS 10) — Emitido em ${new Date().toLocaleDateString('pt-BR')}</h2>

                <h3>📊 Famílias Registadas (${listaFamilias.length})</h3>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Responsável</th>
                            <th>CPF</th>
                            <th>Telefone</th>
                            <th>Endereço</th>
                            <th>Membros</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        if (listaFamilias.length === 0) {
            html += `<tr><td colspan="6" style="text-align: center;">Nenhuma família registada.</td></tr>`;
        } else {
            listaFamilias.forEach(f => {
                html += `
                    <tr>
                        <td>#${f.id}</td>
                        <td>${f.nomeResponsavel}</td>
                        <td>${f.cpf}</td>
                        <td>${f.telefone}</td>
                        <td>${f.endereco}</td>
                        <td>${f.quantidadeMembros}</td>
                    </tr>
                `;
            });
        }

        html += `
                    </tbody>
                </table>

                <h3> Histórico de Doações e Movimentos de Estoque</h3>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tipo / Data</th>
                            <th>Item / Produto</th>
                            <th>Quantidade</th>
                            <th>Detalhes / Destino</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        if (listaDoacoes.length === 0) {
            html += `<tr><td colspan="5" style="text-align: center;">Nenhum registo no estoque.</td></tr>`;
        } else {
            listaDoacoes.forEach(d => {
                let tipo = (d.dataRecebimento && !d.familia) ? 'Entrada (Recebimento)' : 'Saída (Entrega)';
                let data = d.dataRecebimento || d.dataDoacao || '-';
                let destino = d.familia ? `Família #${d.familia.id} (${d.familia.nomeResponsavel || ''})` : (d.descricao || 'Estoque Geral');
                
                html += `
                    <tr>
                        <td>#${d.id}</td>
                        <td>${tipo} (${data})</td>
                        <td><strong>${d.descricaoItem || d.descricao || '-'}</strong></td>
                        <td>${d.quantidade}</td>
                        <td>${destino}</td>
                    </tr>
                `;
            });
        }

        html += `
                    </tbody>
                </table>
                <div class="footer">
                    Associação Ação Vida — Promovendo a Redução das Desigualdades (ODS 10). Sistema GIAV.
                </div>
            </body>
            </html>
        `;

        // 4. Escreve o conteúdo na nova janela e dispara a impressão após o carregamento
        janelaPrint.document.open();
        janelaPrint.document.write(html);
        janelaPrint.document.close();

        janelaPrint.onload = function() {
            janelaPrint.focus();
            janelaPrint.print();
        };

    } catch (e) {
        console.error("Erro ao gerar relatório:", e);
        alert('Erro ao comunicar com a API para gerar o relatório.');
    }
}
