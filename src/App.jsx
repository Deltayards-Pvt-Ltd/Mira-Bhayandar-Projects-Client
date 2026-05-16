import { HashRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AppContextProvider from "./context/AppContext";
import { AppLayout } from "./components/AppLayout";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Blogs from "./pages/Blogs";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <HashRouter>
      <AppContextProvider>
        <div className="flex min-h-full flex-1 flex-col">
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
            theme="light"
          />
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:id" element={<ProjectDetail />} />
              <Route path="/blogs" element={<Blogs />} />
            </Route>
          </Routes>
        </div>
      </AppContextProvider>
    </HashRouter>
  );
}
