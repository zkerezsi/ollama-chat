import { Footer } from "../components/Footer.tsx";
import { Main } from "../components/Main.tsx";
import { Navbar } from "../components/Navbar.tsx";
import { Layout } from "../components/Layout.tsx";

export function HomePage() {
  return (
    <Layout>
      <Navbar />
      <Main />
      <Footer />
    </Layout>
  );
}
