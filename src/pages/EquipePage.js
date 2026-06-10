import Equipe from "../components/Equipe";

export default function EquipePage() {
  return (
    <div>
      <h1>Equipe</h1>

      <Equipe nome="Lisiane" cargo="Desenvolvedora" idade={41} />
      <Equipe nome="Pedro" cargo="Marketing" idade={23} />
      <Equipe nome="Ana" cargo="Analista" idade={46} />
    </div>
  );
}