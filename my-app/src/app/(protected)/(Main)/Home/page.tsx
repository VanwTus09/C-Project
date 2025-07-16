"use client";
import Chats from "@/components/chats/chat";
import Navigation from "@/components/Navigation/Navigation";
import AppSidebar from "@/components/Sidebar/AppSidebar";
import { useState } from "react";

const Home = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  return (
    <>
      <div className="flex">
        <div className="hidden h-screen md:flex border-r flex-shrink-0">
          <div className="hidden md:flex w-[100px]">
            <Navigation />
          </div>
          <div className="hidden md:flex w-[300px]">
            <AppSidebar />
          </div>
        </div>
        {/* Sidebar mobile (overlay) */}
        {showSidebar && (
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setShowSidebar(false)}
          >
            <div
              className="absolute left-0 top-0 w-[300px] h-full bg-white shadow z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <Navigation />
              <AppSidebar />
            </div>
          </div>
        )}
        <div className="flex-1 relative ">
          {/* ☰ Hamburger button chỉ hiện khi < md */}
          <button
            onClick={() => setShowSidebar(true)}
            className="md:hidden absolute top-4 left-4 z-50"
          >
            ☰
          </button>
          <div>
            <Chats />
          </div>
        </div>
      </div>
    </>
  );
};
export default Home;
