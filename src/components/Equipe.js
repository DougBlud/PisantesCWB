import Sobre from "./Sobre";
import Sociais from "./Sociais";

function Equipe(props) {
  return (
    <div>
      <Sobre 
        usuario={props.nome}
        funcao={props.cargo}
        anos={props.idade}
      />

      <Sociais 
        linked={props.linkedin}
        gith={props.github}
      />

      <hr />
    </div>
  );
}

export default Equipe;

