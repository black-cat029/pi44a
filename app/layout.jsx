import "../styles.css";
import { StoreProvider } from "../components/StoreProvider";
import { SiteHeader } from "../components/site-header";

export const metadata = {
  title: "Тесто — пицца рядом",
  description: "Тёплая пицца из печи — закажи любимую в пиццерии Тесто.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>
        <StoreProvider>
          <SiteHeader />
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
