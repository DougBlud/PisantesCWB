import React, { Component } from "react";

class ContadorClasseSemEstado extends Component {
  render() {
    return (
      <div>
        <h2>Contador (Classe)</h2>
        <p>Valor: {this.props.valor}</p>
        <button>Incrementar</button>
      </div>
    );
  }
}

export default ContadorClasseSemEstado;


