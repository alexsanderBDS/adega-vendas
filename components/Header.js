import React, { useState } from "react";
import { auth } from "../config/firebase";
import { useRouter } from "next/router";

const Header = ({ user = null, btnDisplay = false }) => {
  const [display, setDisplay] = useState("d-none");

  let router = useRouter();

  const handleClick = () => {
    if (!user) {
      if (router.query.contato) {
        return router.push("/user/vendas");
      }

      return router.push("/");
    }

    auth.signOut();
    setDisplay("d-none");
    location.reload();
  };

  return (
    <div className="fixed-top d-flex flex-row align-items-center">
      <button
        disabled={btnDisplay}
        style={{ transition: "revert" }}
        type="button"
        className="btn-close m-2 p-2"
        aria-label="Close"
        onClick={() => setDisplay("alert alert-secondary m-2 p-2 d-flex gap-2")}
      ></button>
      <div className={display} role="alert">
        <span className="m-2">{user ? "Sair do Usuário ?" : "Voltar"}</span>
        <button className="btn btn-secondary" onClick={handleClick}>
          Sim
        </button>
        <button className="btn btn-danger" onClick={() => setDisplay("d-none")}>
          Não
        </button>
      </div>
    </div>
  );
};

export default Header;
