import React, { useContext, useEffect, useState } from "react";
import Header from "../../components/Header";
import { db } from "../../config/firebase";
import { AuthContext, VendasContext } from "../../context/firebaseContext";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { CSVLink } from "react-csv";

const Vendas = () => {
  const [myData, setMyData] = useState([]);
  const [newData, setnewData] = useState([]);
  const [deleteMultiplo, setDeleteMultiplo] = useState(false);
  const [btnDisplay, setBtnDisplay] = useState(false);
  const [listaExcluir, setListaExcluir] = useState([]);
  const { state } = useContext(AuthContext);
  const {
    state: { vendas },
  } = useContext(VendasContext);

  useEffect(() => {
    if (myData) {
      setnewData(
        myData.map((data) => {
          return {
            data: data.data,
            descricao: data.descricao,
            quantidade: data.quantidade,
            valor_unitario: data.valor.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            }),
            valor_total: data.valor_total.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            }),
            nome: data.contato.nome,
            contato: data.contato.whats,
          };
        })
      );
    }
  }, [myData]);

  useEffect(async () => {
    if (state.user && vendas) {
      const { email } = state.user;
      setMyData(
        vendas.filter((value) => {
          return value.admin === email;
        })
      );
    }
  }, [state, vendas]);

  const deleteVenda = async (id) => {
    const resp = confirm("Excluir Venda ?");

    if (!resp) {
      return;
    }

    try {
      setBtnDisplay(true);

      await db.collection("vendas").doc(id).delete();

      setBtnDisplay(false);
      location.reload();

      alert("Venda excluída!");
    } catch (error) {
      setBtnDisplay(false);
      alert(error.message);
    }
  };

  const handleDeleteMultiplo = async () => {
    if (listaExcluir.length > 0) {
      const resp = confirm("Deseja excluir os selecionados ?");

      if (resp) {
        setBtnDisplay(true);

        for (const id of listaExcluir) {
          await db.collection("vendas").doc(id).delete();
        }

        setBtnDisplay(false);
        alert("Vendas Excluídas!");
        return location.reload();
      }

      setListaExcluir([]);
    }

    setDeleteMultiplo(!deleteMultiplo);
  };

  const handleCheckChange = (e, id) => {
    if (e.target.checked) {
      setListaExcluir((oldValues) => [...oldValues, id]);
    } else {
      setListaExcluir(
        listaExcluir.filter((todos) => {
          return todos !== id;
        })
      );
    }
  };

  return (
    <div className="d-flex flex-column gap-4 align-items-center m-auto">
      <Header btnDisplay={btnDisplay} />
      <h1 id="top" className="mt-5">
        Minha Lista de Vendas
      </h1>
      {newData.length > 0 && (
        <div className="d-flex flex-row gap-2">
          <CSVLink
            style={{ visibility: btnDisplay ? "hidden" : "visible" }}
            data={newData}
            filename={"Minhas_Vendas.csv"}
            className="btn btn-primary"
            target="_blank"
            separator={";"}
          >
            Download
          </CSVLink>
          <button
            onClick={handleDeleteMultiplo}
            disabled={btnDisplay}
            className="btn btn-danger m-auto"
          >
            Excluir Multiplo
          </button>
        </div>
      )}
      {myData.length === 0 && (
        <Link href="/user/adicionar_venda">
          <a className="btn btn-outline-secondary">
            Nenhuma venda realizada ainda :(
          </a>
        </Link>
      )}
      {myData &&
        myData.map((data) => {
          return (
            <div key={data.id} className="card" style={{ width: "18rem" }}>
              <div className="card-header d-flex flex-row justify-content-between align-items-center">
                <div>
                  <Link href={`/user/quem?contato=${data.contato.nome}`}>
                    <a
                      style={{ visibility: btnDisplay ? "hidden" : "visible" }}
                      className="btn btn-link"
                    >
                      {data.contato.nome}
                    </a>
                  </Link>
                </div>
                <div>
                  <a
                    style={{
                      fontSize: "1.7rem",
                      color: "green",
                      visibility: btnDisplay ? "hidden" : "visible",
                    }}
                    href={`https://wa.me/550${data.contato.whats}/?text=[ ${
                      data.data
                    } ] Olá ${data.contato.nome}, você comprou ${
                      data.quantidade
                    } ${
                      data.descricao
                    }(s) no valor de ${data.valor_total.toLocaleString(
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
                </div>
                <div>
                  {deleteMultiplo ? (
                    <input
                      type="checkbox"
                      className="form-check-input"
                      onChange={(e) => handleCheckChange(e, data.id)}
                    />
                  ) : (
                    <button
                      disabled={btnDisplay}
                      type="button"
                      className="btn-close"
                      aria-label="Close"
                      onClick={() => deleteVenda(data.id)}
                    ></button>
                  )}
                </div>
              </div>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <ul className="list-group list-group-horizontal d-flex justify-content-between">
                    <li className="list-group-item border-0">Data</li>
                    <li className="list-group-item border-0">{data.data}</li>
                  </ul>
                  <ul className="list-group list-group-horizontal d-flex justify-content-between">
                    <li className="list-group-item border-0">Descrição</li>
                    <li className="list-group-item border-0">
                      {data.descricao}
                    </li>
                  </ul>
                  <ul className="list-group list-group-horizontal d-flex justify-content-between">
                    <li className="list-group-item border-0">Quantidade</li>
                    <li className="list-group-item border-0">
                      {data.quantidade}
                    </li>
                  </ul>
                  <ul className="list-group list-group-horizontal d-flex justify-content-between">
                    <li className="list-group-item border-0">Valor</li>
                    <li className="list-group-item border-0">
                      {data.valor.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        style: "currency",
                        currency: "BRL",
                      })}
                    </li>
                  </ul>
                  <ul className="list-group list-group-horizontal d-flex justify-content-between">
                    <li className="list-group-item border-0">Valor Total</li>
                    <li className="list-group-item border-0">
                      {data.valor_total.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        style: "currency",
                        currency: "BRL",
                      })}
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          );
        })}
      {myData.length > 0 && (
        <a
          style={{ visibility: btnDisplay ? "hidden" : "visible" }}
          href="#top"
          className="text-center btn btn-secondary m-auto mb-3"
        >
          Voltar ao Topo
        </a>
      )}
    </div>
  );
};

export default Vendas;
