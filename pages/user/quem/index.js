import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import Header from "../../../components/Header";
import { VendasContext } from "../../../context/firebaseContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

const ContatoVendas = () => {
  const [vendaEspecifica, setVendaEspecifica] = useState([]);
  const [consolidado, setConsolidado] = useState({
    nome: "",
    whats: "",
    quantidade: 0,
    valor: 0,
  });

  let router = useRouter();
  const {
    state: { vendas },
  } = useContext(VendasContext);

  let { contato: contatoQuery } = router.query;

  useEffect(() => {
    if (vendas) {
      const getVendas = vendas.filter(({ contato }) => {
        return contato.nome === contatoQuery;
      });

      getVendas.map((cada) => {
        setConsolidado({
          nome: (consolidado.nome = cada.contato.nome),
          whats: (consolidado.whats = cada.contato.whats),
          quantidade: (consolidado.quantidade += cada.quantidade),
          valor: (consolidado.valor += cada.valor_total),
        });
      });

      setVendaEspecifica(getVendas);
    }
  }, [vendas]);

  return (
    <>
      <Header />
      <div className="d-flex flex-column w-100 h-100 justify-content-center align-items-center">
        <div className="d-flex flex-column mt-5 justify-content-center align-items-center">
          <h1 style={{ textAlign: "center" }}>Consolidado</h1>
          <h3>
            {consolidado.nome}
            <a
              style={{
                fontSize: "1.7rem",
                color: "green",
              }}
              className="mx-3"
              href={`https://wa.me/550${consolidado.whats}/?text=Olá ${
                consolidado.nome
              }! Sua conta fechou em ${consolidado.valor.toLocaleString(
                "pt-BR",
                {
                  minimumFractionDigits: 2,
                  style: "currency",
                  currency: "BRL",
                }
              )}.`}
              target="_blank"
            >
              <FontAwesomeIcon icon={faWhatsapp} />
            </a>
          </h3>

          <ul className="list-group list-group-horizontal border border-danger mb-5">
            <li className="list-group-item bg-dark text-white">
              <ul className="list-group bg-dark text-white">
                <li className="list-group-item border-0 bg-dark text-white">
                  Quantidade Total
                </li>
                <li className="list-group-item border-0 bg-dark text-white">
                  {consolidado.quantidade}
                </li>
              </ul>
            </li>
            <li className="list-group-item bg-dark text-white">
              <ul className="list-group bg-dark text-white">
                <li className="list-group-item border-0 bg-dark text-white">
                  Valor Total
                </li>
                <li className="list-group-item border-0 bg-dark text-white">
                  {consolidado.valor.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                    style: "currency",
                    currency: "BRL",
                  })}
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <div className="d-flex flex-column align-items-center ">
          <h2>Produtos Comprados</h2>
          {vendaEspecifica &&
            vendaEspecifica.map((cada) => {
              return (
                <ul key={cada.id} className="list-group list-group-horizontal">
                  <li className="list-group-item border-0">
                    <ul className="list-group">
                      <li className="list-group-item border-0">
                        <strong>Descrição</strong>
                      </li>
                      <li className="list-group-item border-0">
                        {cada.descricao}
                      </li>
                    </ul>
                  </li>
                  <li className="list-group-item border-0">
                    <ul className="list-group">
                      <li className="list-group-item border-0">
                        <strong>Quantidade</strong>
                      </li>
                      <li className="list-group-item border-0">
                        {cada.quantidade}
                      </li>
                    </ul>
                  </li>
                  <li className="list-group-item border-0">
                    <ul className="list-group">
                      <li className="list-group-item border-0">
                        <strong>Valor</strong>
                      </li>
                      <li className="list-group-item border-0">
                        {cada.valor_total.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                          style: "currency",
                          currency: "BRL",
                        })}
                      </li>
                    </ul>
                  </li>
                </ul>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default ContatoVendas;
