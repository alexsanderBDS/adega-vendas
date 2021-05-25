import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { db } from "../config/firebase";
import { AuthContext, ContactsContext } from "../context/firebaseContext";
import Header from "./Header";

const FormClientes = () => {
  const { state } = useContext(AuthContext);
  const [query, setQuery] = useState("");
  const [btnDisplay, setBtnDisplay] = useState(false);
  const { state: stateContatos } = useContext(ContactsContext);
  // I was tired, so I did this :)
  const [display, setDisplay] = useState("none");
  const [display2, setDisplay2] = useState("none");
  const [display3, setDisplay3] = useState("none");

  let router = useRouter();

  useEffect(() => {
    if (router.query) {
      setQuery(router.query.name);
    }
  }, [router.query]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dados = new FormData(e.target);
    const { user } = state;

    let existe = stateContatos.todos.find((one) => {
      return (
        one.nome.trim().toLowerCase() ===
          dados.get("nome").trim().toLowerCase() && one.admin === user.email
      );
    });

    if (existe) {
      setDisplay("block");

      setTimeout(() => {
        setDisplay("none");
      }, 3000);

      return;
    } else if (dados.get("celular").length < 11) {
      setDisplay3("block");

      setTimeout(() => {
        setDisplay3("none");
      }, 3000);

      return;
    }

    setBtnDisplay(true);

    try {
      await db.collection("contatos").add({
        nome: dados.get("nome"),
        whatsapp: dados.get("celular"),
        admin: user.email,
      });

      setDisplay2("block");
    } catch (error) {
      console.log("Erro: ", error);
    }

    setTimeout(() => {
      setBtnDisplay(false);
      location.reload();
    }, 1000);

    if (router.query.name) {
      alert("Vamos Continuar");
      return router.push("/user/adicionar_venda");
    }
  };

  return (
    <div id="top">
      <Header btnDisplay={btnDisplay} />
      <div className="grid-contacts">
        <div className="border border-dark rounded bg-dark text-white">
          <form onSubmit={handleSubmit}>
            <div className="d-flex flex-column">
              <label htmlFor="nome">Nome</label>
              <input
                name="nome"
                type="text"
                maxLength="15"
                placeholder="Forneça um nome"
                required
                className="p-2"
                defaultValue={query}
              />
              <label htmlFor="celular">Número do Whatssap</label>
              <input
                name="celular"
                type="tel"
                placeholder="Ex.: 11956543333"
                maxLength="11"
                required
                className="p-2"
                pattern="[0-9]{2}[0-9]{5}[0-9]{4}"
              />
              <button disabled={btnDisplay} className="btn btn-secondary">
                Adicionar
              </button>
            </div>
          </form>
        </div>
        <div
          style={{ display: display }}
          className="alert alert-danger"
          role="alert"
        >
          Registre um nome diferente, esse já existe!
        </div>
        <div
          style={{ display: display3 }}
          className="alert alert-danger"
          role="alert"
        >
          Registre um número de telefone válido!
        </div>
        <div
          style={{ display: display2 }}
          className="alert alert-info"
          role="alert"
        >
          Contato adicionado!
        </div>
      </div>
    </div>
  );
};

export default FormClientes;
