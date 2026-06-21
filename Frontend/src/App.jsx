import { Routes, Route } from "react-router-dom";
import Auth from "./components/Auth/Auth";
import Dashboard from "./pages/Dashboard";
import CreateCategory from "./pages/CreateCategory";
import CreateItem from "./pages/CreateItem";
import CategoriesPage from "./pages/CategoriesPage";
import ItemsPage from "./pages/ItemsPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-category" element={<CreateCategory />} />
        <Route path="/create-item" element={<CreateItem />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route
          path="/categories/edit/:id"
          element={<CreateCategory isEdit={true} />}
        />
        <Route path="/items" element={<ItemsPage />} />
        <Route path="/items/edit/:id" element={<CreateItem />} />
      </Routes>
    </>
  );
}

export default App;
