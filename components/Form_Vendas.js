import React, { useContext, useEffect, useState } from "react";
import {
  AuthContext,
  ContactsContext,
  ProdutosContext,
} from "../context/firebaseContext";
import { useRouter } from "next/router";
import { db } from "../config/firebase";
import Header from "./Header";

const FormVendas = () => {
  const [data, setData] = useState("");
  const [descr, setDescr] = useState("");
  const [nomeContato, setNomeContato] = useState("");
  const [quant, setQuant] = useState(1);
  const [valor, setValor] = useState(0);
  const [btnDisplay, setBtnDisplay] = useState(false);
  const [valorTotal, setValorTotal] = useState(0);
  const [myContacts, setMyContacts] = useState([]);
  const [myProdutos, setMyProdutos] = useState([]);
  const [warnOne, setwarnOne] = useState("none");
  const [warnTwo, setwarnTwo] = useState("none");
  const [warnThree, setWarnThree] = useState("none");
  const [warnFour, setWarnFour] = useState("none");
  const {
    state: { user },
  } = useContext(AuthContext);
  const { state } = useContext(ContactsContext);
  const {
    state: { produtos },
  } = useContext(ProdutosContext);

  let router = useRouter();

  useEffect(() => {
    if (sessionStorage.getItem("form-data")) {
      const getValues = JSON.parse(sessionStorage.getItem("form-data"));

      setDescr(getValues.descricao);
      setQuant(getValues.quantidade);
      setValor(getValues.valor.toFixed(2));
      setValorTotal(getValues.valor_total.toFixed(2));
      setNomeContato(getValues.contato.nome);
    }
  }, []);

  useEffect(() => {
    if (produtos) {
      setMyProdutos(
        produtos.filter((produto) => {
          return produto.admin === user.email;
        })
      );
    }
  }, [state, produtos]);

  useEffect(() => {
    let hoje = new Date().toLocaleDateString().split("/");

    let hojeArrumado = hoje[2].concat("-", hoje[1], "-", hoje[0]);

    setData(hojeArrumado);

    if (state.todos) {
      setMyContacts(
        state.todos.filter((todo) => {
          return todo.admin === user.email;
        })
      );
    }
  }, [user, state.todos]);

  const getValorXQuantidade = () => {
    setwarnTwo("block");
    setValorTotal((valor * quant).toFixed(2));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const valores = new FormData(e.target);

      let existeContato = myContacts.find((one) => {
        return (
          one.nome.trim().toUpperCase() ===
          valores.get("form-pessoa-cadastrada").trim().toUpperCase()
        );
      });

      const { dia, mes, ano } = {
        dia: valores.get("form-data").split("-")[2],
        mes: valores.get("form-data").split("-")[1],
        ano: valores.get("form-data").split("-")[0],
      };

      const toSave = {
        admin: user.email,
        data: `${dia}/${mes}/${ano}`,
        descricao: valores.get("form-prod"),
        contato: {
          nome: existeContato
            ? existeContato.nome
            : valores.get("form-pessoa-cadastrada"),
          whats: existeContato ? existeContato.whatsapp : "",
        },
        quantidade: parseInt(valores.get("form-quant")),
        valor: parseFloat(valores.get("form-valor")),
        valor_total: parseFloat(valores.get("form-valor-total")),
      };

      if (toSave.descricao && toSave.valor) {
        try {
          const validar = myProdutos.find((produto) => {
            return (
              produto.descricao.trim().toLowerCase() ===
              toSave.descricao.trim().toLowerCase()
            );
          });

          if (!validar) {
            await db.collection("produtos").add({
              descricao: toSave.descricao.trim(),
              valor_unitario: toSave.valor,
              admin: toSave.admin,
            });
          }
        } catch (error) {
          console.log("Não foi possível cadastrar o produto!");
        }
      }

      if (!existeContato) {
        alert("Vamos cadastrar esse contato primeiro.");

        sessionStorage.setItem("form-data", JSON.stringify({ ...toSave }));

        setBtnDisplay(true);
        return router.push(
          "/user/cadastrar_cliente?name=" +
            valores.get("form-pessoa-cadastrada")
        );
      }

      sessionStorage.removeItem("form-data");

      setBtnDisplay(true);
      await db.collection("vendas").add({
        ...toSave,
      });

      alert("Venda adicionada!");
      setBtnDisplay(false);
      location.reload();
    } catch (error) {
      console.log(error.message);
    }
  };

  const setValorUnitaioFunction = (e) => {
    const produto = myProdutos.find((prod) => {
      return prod.descricao === e.target.value;
    });

    if (produto) {
      setValor(produto.valor_unitario.toFixed(2));
    }

    setWarnThree("none");
  };

  return (
    <>
      <Header btnDisplay={btnDisplay} />
      <h2 className="mb-2 mt-5">Formulário</h2>
      <form id="formulario-vendas" onSubmit={handleSubmit}>
        <div className="d-flex flex-column gap-2 m-auto p-3">
          <label className="mb-2" htmlFor="form-data">
            Data
          </label>
          <input
            className="mb-3 border-primary p-2"
            name="form-data"
            id="form-data"
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
          />
          <label htmlFor="form-prod" className="mb-2">
            Descrição do Produto
          </label>
          <input
            className="mb-3 border-primary p-2"
            name="form-prod"
            id="form-prod"
            list="produtos-cadastrados"
            type="text"
            required
            maxLength="25"
            autoComplete="off"
            value={descr}
            onFocus={() => setWarnThree("block")}
            onChange={(e) => setDescr(e.target.value)}
            onBlur={setValorUnitaioFunction}
            placeholder="Ex.: Whisky Royal"
          />
          <datalist id="produtos-cadastrados" name="lista_produtos">
            {myProdutos &&
              myProdutos.map((value) => {
                return <option key={value.id} value={value.descricao} />;
              })}
          </datalist>
          <span style={{ display: warnThree }} className="alert alert-warning">
            A lista exibida são
            <br />
            produtos já cadastrados.
          </span>
          <label htmlFor="form-quant" className="mb-2">
            Quantidade
          </label>
          <input
            className="mb-3 border-primary p-2"
            name="form-quant"
            id="form-quant"
            type="number"
            min="1"
            max="1000"
            required
            value={quant}
            onChange={(e) => setQuant(e.target.value)}
          />
          <label htmlFor="form-valor" className="mb-2">
            Valor
          </label>
          <input
            className="mb-3 border-primary p-2"
            name="form-valor"
            id="form-valor"
            type="number"
            min="0.1"
            step="any"
            required
            onChange={(e) => setValor(e.target.value)}
            value={valor}
            onFocus={() => setwarnOne("block")}
            onBlur={() => setwarnOne("none")}
          />
          <span style={{ display: warnOne }} className="alert alert-warning">
            Para Centavos utilize 0, ou 0.
            <br />
            Exemplo: 0,50 = 50 Centavos
          </span>
          <label htmlFor="form-valor-total" className="mb-2">
            Valor Total
          </label>
          <input
            className="mb-3 border-primary p-2"
            name="form-valor-total"
            id="form-valor-total"
            type="number"
            min="0.1"
            step="any"
            required
            onFocus={getValorXQuantidade}
            onChange={(e) => setValorTotal(e.target.value)}
            value={valorTotal}
            onBlur={() => setwarnTwo("none")}
          />
          <span style={{ display: warnTwo }} className="alert alert-warning">
            Para Centavos utilize 0, ou 0.
            <br />
            Exemplo: 0,50 = 50 Centavos
          </span>
          <label htmlFor="form-pessoa-cadastrada" className="form-label mb-2">
            Cliente | Whatsapp Cadastrado
          </label>
          <input
            className="mb-3 border-primary p-2"
            name="form-pessoa-cadastrada"
            list="datalistOptions"
            id="form-pessoa-cadastrada"
            placeholder="Informe o nome"
            autoComplete="off"
            maxLength="15"
            value={nomeContato}
            onChange={(e) => setNomeContato(e.target.value)}
            required
            onFocus={() => setWarnFour("block")}
            onBlur={() => setWarnFour("none")}
          />
          <datalist id="datalistOptions" name="lista_valores">
            {myContacts &&
              myContacts.map((value) => {
                return <option key={value.id} value={value.nome} />;
              })}
          </datalist>
          <span style={{ display: warnFour }} className="alert alert-warning">
            A lista exibida são
            <br />
            clientes já cadastrados.
          </span>
        </div>
        <div className="d-flex justify-content-center mb-5">
          <button disabled={btnDisplay} className="btn btn-primary mt-3">
            Confirmar
          </button>
        </div>
      </form>
    </>
  );
};

export default FormVendas;
