import ContadorFuncaoComEstado from "../components/contador_funcao_com_estado";
import ContadorClasseComEstado from "../components/contador_classe_com_estado";

export default function ContadoresPage({ valor, setValor }) {
  return (
    <div>
      <h1>Contadores</h1>

      <ContadorFuncaoComEstado valor={valor} setValor={setValor} />
      <ContadorClasseComEstado valor={valor} setValor={setValor} />
    </div>
  );
}

