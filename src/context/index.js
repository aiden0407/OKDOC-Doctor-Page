//React
import { createContext, useReducer } from "react";

//initial state
const initialState = {
  isMenuTabOpened: true,
};

//create context
const Context = createContext({});

//create reducer
const reducer = (state, action) => {
  switch (action.type) {

    case 'OPEN_MENU_TAB':
      return {
        ...state,
        isMenuTabOpened: true,
      };

    case 'CLOSE_MENU_TAB':
      return {
        ...state,
        isMenuTabOpened: false,
      };

    default:
      return state;
  }
};

//create Provider component
const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export { Context, Provider };