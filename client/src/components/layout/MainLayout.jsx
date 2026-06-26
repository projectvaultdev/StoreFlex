import Navbar from "./Navbar";
import Footer from "./Footer";

const MainLayout = ({ children }) => {
  return (
    <>
      <Navbar />

      <main className="min-h-[80vh]">
        {children}
      </main>

      <Footer />
    </>
  );
};

export default MainLayout;