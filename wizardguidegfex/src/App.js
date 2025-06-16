import React from "react";
import "./App.css";
import NotFound from "./pages/NotFound";
import AppBar from "./components/AppBar";
import MasterPage from "./pages/MasterPage";
import Header from './components/header';
import { WzdGdContextProvider } from './useContext';
const App = () => {
  return (
    <div className="App full-height">
      <Header />
      <WzdGdContextProvider>
        <MasterPage />
      </WzdGdContextProvider>
    
    </div>
  );
};

export default App;
