import { Outlet } from "react-router";
import Navbar from "../navigation/Navbar";
import Footer from "../footer/Footer";
import ScrollToTop from "../ScrollToTop";
import { ThemeProvider } from "../theme/ThemeProvider";

export default function AppLayout() {
  return (
    <ThemeProvider>
      <ScrollToTop />
      <div className="flex min-h-dvh flex-col">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
