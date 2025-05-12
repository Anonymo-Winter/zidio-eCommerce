// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import HeroSection from "./components/hero/HeroSection";
import CategoryLinks from "./components/hero/CategoryLinks";
import FeaturedProducts from "./components/hero/FeaturedProducts";
import Sidebar from "./components/admin/Sidebar";
import { RiMenuFold2Fill } from "react-icons/ri";
import ProductPage from "./components/productPage";

function App() {
    // const authToken = localStorage.getItem("authToken");
    // const userRole = localStorage.getItem("userRole");
    // const isAdmin = userRole === "admin";
    const [isOpen, setIsOpen] = useState(true);
    const authToken = true;
    const isAdmin = true;

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };
    return (
        <BrowserRouter>
            <div className="bg-gray-900 min-h-screen">
                {isAdmin && authToken ? (
                    <div className="flex bg-gray-900 text-white">
                        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} toggleSidebar={toggleSidebar} />

                        {/* Main Content */}
                        <div className="flex-1 p-4 ml-2 md:ml-0">
                            <button
                                onClick={toggleSidebar}
                                className="text-white bg-gray-800 p-2 rounded-md md:hidden mb-4"
                            >
                                <RiMenuFold2Fill />
                            </button>
                            <Routes>
                                <Route path="/products" element={<ProductPage />} />
                                <Route path="/admin" element={<Sidebar />} />
                                <Route path="/admin/dashboard" element={<Sidebar />} />
                                <Route path="/admin/users" element={<Sidebar />} />
                                <Route path="/admin/analytics" element={<Sidebar />} />
                                <Route path="/admin/logout" element={<Sidebar />} />
                            </Routes>
                        </div>
                    </div>
                ) : (
                    <>
                        <Navbar />
                        <Routes>
                            <Route
                                path="/"
                                element={
                                    <>
                                        <HeroSection />
                                        <CategoryLinks />
                                        <FeaturedProducts />
                                    </>
                                }
                            />
                            <Route path="/products" element={<ProductPage />} />
                        </Routes>
                    </>
                )}
            </div>
        </BrowserRouter>
    );
}

export default App;
