async function cadastrarUsuario(dados) {
  validarDados(dados);

  // Simulação de chamada à API (substitua por fetch real futuramente)
  await new Promise((res) => setTimeout(res, 800));

  return {
    sucesso: true,
    id: Math.random().toString(36).slice(2, 9),
    mensagem: `Usuário ${dados.nome} cadastrado com sucesso!`,
  };
}

function validarDados(dados) {
  const erros = [];

  if (!dados.nome?.trim())
    erros.push("Nome é obrigatório");

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email))
    erros.push("E-mail inválido");

  if (dados.idade && (dados.idade < 1 || dados.idade > 120))
    erros.push("Idade fora do intervalo válido");

  if (!dados.aceiteTermos)
    erros.push("Você deve aceitar os termos de uso");

  if (erros.length > 0)
    throw new Error(erros.join(", "));
}

export { cadastrarUsuario };