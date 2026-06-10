function Sociais(props) {
  return (
    <div>
      <h3>Redes sociais:</h3>
      <ul>
        <li>
          <a href={`https://www.linkedin.com/in/${props.linked}`}>
            LinkedIn
          </a>
        </li>
        <li>
          <a href={`https://github.com/${props.gith}`}>
            GitHub
          </a>
        </li>
      </ul>
    </div>
  );
}

export default Sociais;

