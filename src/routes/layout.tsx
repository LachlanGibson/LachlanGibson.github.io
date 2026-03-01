import { Outlet } from "react-router";
import Navbar from "../navigation/Navbar";
import Footer from "../footer/Footer";
import ScrollToTop from "../ScrollToTop";

export default function AppLayout() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
