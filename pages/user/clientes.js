import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import Header from "../../components/Header";
import { db } from "../../config/firebase";
import { AuthContext, ContactsContext } from "../../context/firebaseContext";

const Clientes = () => {
  const { state } = useContext(AuthContext);
  const { state: stateContacts } = useContext(ContactsContext);
  const [dados, setDados] = useState([]);
  const [deleteMultiplo, setDeleteMultiplo] = useState(false);
  const [btnDisplay, setBtnDisplay] = useState(false);
  const [listaExcluir, setListaExcluir] = useState([]);

  useEffect(async () => {
    const { user } = state;

    try {
      if (stateContacts.todos) {
        const myContacts = stateContacts.todos.filter((todo) => {
          return todo.admin === user.email;
        });

        setDados(myContacts);
      }
    } catch (error) {
      console.log("Erro", error.message);
    }
  }, [stateContacts]);

  const handleDelete = async (e) => {
    const id = e.target.parentNode.getAttribute("data_key");

    const resp = confirm("Excluir Contato ?");

    if (!resp) {
      return;
    }

    try {
      setBtnDisplay(true);

      await db.collection("contatos").doc(id).delete();

      setBtnDisplay(false);
      location.reload();

      alert("Contato excluído!");
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
          await db.collection("contatos").doc(id).delete();
        }

        setBtnDisplay(false);
        alert("Contatos Excluídos!");
        return location.reload();
      }

      setListaExcluir([]);
    }

    setDeleteMultiplo(!deleteMultiplo);
  };

  const handleCheckChange = (e) => {
    if (e.target.checked) {
      setListaExcluir((oldValues) => [
        ...oldValues,
        e.target.parentNode.getAttribute("data_key"),
      ]);
      console.log(e.target.parentNode.getAttribute("data_key"));
    } else {
      setListaExcluir(
        listaExcluir.filter((todos) => {
          return todos !== e.target.parentNode.getAttribute("data_key");
        })
      );
    }
  };

  return (
    <div id="top">
      <Header btnDisplay={btnDisplay} />
      <div className="d-flex flex-column justify-content-center mt-5 gap-4">
        <h1 className="d-flex justify-content-center">Lista</h1>
        {dados.length > 0 && (
          <button
            disabled={btnDisplay}
            className="btn btn-danger m-auto"
            onClick={handleDeleteMultiplo}
          >
            Excluir Multiplo
          </button>
        )}
        {dados.length === 0 && (
          <Link href="/user/cadastrar_cliente">
            <a className="btn btn-outline-secondary m-4">
              Nenhuma contato cadastrado ainda :(
            </a>
          </Link>
        )}
        <ol className="list-group list-group-numbered">
          {dados &&
            dados.map(({ nome, whatsapp, id }) => {
              return (
                <li
                  key={id}
                  data_key={id}
                  className="list-group-item border-1 d-flex flex-row align-items-center justify-content-between m-3 p-2"
                >
                  <div>{nome}</div>
                  <div>{whatsapp}</div>
                  {deleteMultiplo ? (
                    <input
                      disabled={btnDisplay}
                      type="checkbox"
                      className="form-check-input"
                      onChange={handleCheckChange}
                    />
                  ) : (
                    <button
                      disabled={btnDisplay}
                      type="button"
                      className="btn-close border border-danger"
                      aria-label="Close"
                      onClick={handleDelete}
                    ></button>
                  )}
                </li>
              );
            })}
        </ol>
        {dados.length > 0 && (
          <a
            style={{ visibility: btnDisplay ? "hidden" : "visible" }}
            href="#top"
            className="text-center btn btn-secondary m-auto mb-3"
          >
            Voltar ao Topo
          </a>
        )}
      </div>
    </div>
  );
};

export default Clientes;
