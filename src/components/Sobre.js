function Sobre(props) {
  return (
    <div>
      <h2>Olá, eu sou a {props.usuario}</h2>
      <p>Eu sou {props.funcao} e tenho {props.anos} anos.</p>
    </div>
  );
}

export default Sobre;

