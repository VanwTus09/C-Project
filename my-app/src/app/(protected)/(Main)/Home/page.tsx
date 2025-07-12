import Chats from "@/components/chats/chat";
import Navigation from "@/components/Navigation/Navigation";
import Sidebar from "@/components/Sidebar/Sidebar";

const Home = () => {
  return (
    <>
      <div className="flex flex-row">
        <div><Navigation /></div>
        <div><Sidebar /></div>
        <div><Chats /></div>        
      </div>
    </>
  );
};
export default Home;
