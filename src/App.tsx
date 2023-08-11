import React from "react";
import { Provider } from "react-redux";
import { Route, Routes } from "react-router";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import Locations from "./components/Locations";
import Map from "./components/Map";
import store from "./components/reducers/store/store";

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Locations />} />
            <Route path="/map" element={<Map />} />
          </Routes>
        </BrowserRouter>
      </div>
    </Provider>
  );
}

export default App;
