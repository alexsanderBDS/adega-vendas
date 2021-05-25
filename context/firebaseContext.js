import React, { createContext, useEffect, useReducer } from "react";
import { auth, db } from "../config/firebase";

const firebaseReducer = (state, action) => {
  switch (action.type) {
    case "LOGGED_USER":
      return { ...state, user: action.payload };
    default:
      return state;
  }
};
const firebaseContactsReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_LIST":
      return { ...state, todos: action.payload };
    default:
      return state;
  }
};
const firebaseVendasReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_LIST":
      return { ...state, vendas: action.payload };
    default:
      return state;
  }
};

const firebaseProdutosReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_LIST":
      return { ...state, produtos: action.payload };
    default:
      return state;
  }
};

const ProdutosContext = createContext();
const ContactsContext = createContext();
const VendasContext = createContext();
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(firebaseReducer, { user: null });
  const value = { state, dispatch };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const tokenID = await user.getIdTokenResult();

        dispatch({
          type: "LOGGED_USER",
          payload: { email: user.email, token: tokenID.token },
        });
      } else {
        dispatch({
          type: "LOGGED_USER",
          payload: null,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const ContactsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(firebaseContactsReducer, {
    todos: null,
  });

  const value = { state, dispatch };

  useEffect(async () => {
    const values = await db.collection("contatos").get();

    let push = [];
    values.docs.map((doc) => {
      push.push({ id: doc.id, ...doc.data() });
    });

    push.sort((a, b) => {
      if (a.nome < b.nome) {
        return -1;
      }
      if (!a.nome < b.nome) {
        return 1;
      } else {
        return 0;
      }
    });

    dispatch({
      type: "UPDATE_LIST",
      payload: push,
    });
  }, []);

  return (
    <ContactsContext.Provider value={value}>
      {children}
    </ContactsContext.Provider>
  );
};

const VendasProvider = ({ children }) => {
  const [state, dispatch] = useReducer(firebaseVendasReducer, {
    vendas: null,
  });

  const value = { state, dispatch };

  useEffect(async () => {
    const values = await db.collection("vendas").get();

    let push = [];
    values.docs.map((doc) => {
      push.push({ id: doc.id, ...doc.data() });
    });

    push.sort((a, b) => {
      if (b.data < a.data) {
        return -1;
      }
      if (!b.data < a.data) {
        return 1;
      } else {
        return 0;
      }
    });

    dispatch({
      type: "UPDATE_LIST",
      payload: push,
    });
  }, []);

  return (
    <VendasContext.Provider value={value}>{children}</VendasContext.Provider>
  );
};
const ProdutosProvider = ({ children }) => {
  const [state, dispatch] = useReducer(firebaseProdutosReducer, {
    produtos: null,
  });

  const value = { state, dispatch };

  useEffect(async () => {
    const values = await db.collection("produtos").get();

    let push = [];
    values.docs.map((doc) => {
      push.push({ id: doc.id, ...doc.data() });
    });

    push.sort((a, b) => {
      if (a.descricao < b.descricao) {
        return -1;
      }
      if (!a.descricao < b.descricao) {
        return 1;
      } else {
        return 0;
      }
    });

    dispatch({
      type: "UPDATE_LIST",
      payload: push,
    });
  }, []);

  return (
    <ProdutosContext.Provider value={value}>
      {children}
    </ProdutosContext.Provider>
  );
};

export {
  AuthContext,
  AuthProvider,
  ContactsContext,
  ContactsProvider,
  VendasContext,
  VendasProvider,
  ProdutosContext,
  ProdutosProvider,
};
