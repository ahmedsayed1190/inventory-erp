import React from "react";
import ReactDOM from "react-dom/client";

/* ===== i18n (Languages) ===== */
import "./i18n";   // ✅ هنا بالظبط

import App from "./App";

import { AuthProvider } from "./context/AuthContext";
import { ProductProvider } from "./context/ProductContext";
import { WarehouseProvider } from "./context/WarehouseContext";
import { StockProvider } from "./context/StockContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <ProductProvider>
        <WarehouseProvider>
          <StockProvider>
            <App />
          </StockProvider>
        </WarehouseProvider>
      </ProductProvider>
    </AuthProvider>
  </React.StrictMode>
);