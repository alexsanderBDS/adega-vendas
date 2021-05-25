import React, { useEffect, useState } from "react";
import Header from "./Header";
import { useRouter } from "next/router";

const Admin = ({ user }) => {
  let router = useRouter();
  const [username, setUsername] = useState("");

  useEffect(() => {
    setUsername(localStorage.getItem("username"));
  }, [localStorage.getItem("username")]);

  const changeUsername = (e) => {
    try {
      let novo = prompt(`Mudar o nome ${e.target.textContent} para:`);
      if (novo) {
        localStorage.setItem("username", novo.trim().toUpperCase());
        location.reload();
      }
    } catch (error) {
      console.log("Erro", error.message);
    }
  };

  return (
    <div>
      <Header user={user} />
      <ul className="list-group d-flex flex-column align-items-around gap-2 shadow p-3 mb-5 bg-body rounded">
        <h1 className="text-center">
          Bem Vindo!
          <br />
          <button
            onClick={changeUsername}
            className="btn btn-light font-weight-bold"
          >
            <h2 className="font-2">
              {username && username}
              {!username && user.email.split("@")[0].toUpperCase()}
            </h2>
          </button>
        </h1>
        <li className="list-group-item p-2 d-flex justify-content-between align-items-center gap-2 border-1">
          <span>Minha Lista de Contatos</span>
          <button
            className="btn btn-primary p-2"
            onClick={() => router.push("/user/clientes")}
          >
            Aqui
          </button>
        </li>
        <li className="list-group-item p-2 d-flex justify-content-between align-items-center gap-2 border-1">
          <span>Cadastrar Whatsapp</span>
          <button
            className="btn btn-primary p-2"
            onClick={() => router.push("/user/cadastrar_cliente")}
          >
            Aqui
          </button>
        </li>
        <li className="list-group-item p-2 d-flex justify-content-between align-items-center gap-2 border-1">
          <span>Minha lista de Vendas</span>
          <button
            className="btn btn-dark p-2"
            onClick={() => router.push("/user/vendas")}
          >
            Aqui
          </button>
        </li>
        <li className="list-group-item p-2 d-flex justify-content-between align-items-center gap-2 border-1">
          <span>Cadastrar Venda</span>
          <button
            className="btn btn-dark p-2"
            onClick={() => router.push("/user/adicionar_venda")}
          >
            Aqui
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Admin;
