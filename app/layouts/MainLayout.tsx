import { Outlet } from "react-router";
import {
  Footer,
  Header,
  DisclaimerBanner,
  ImagesLoadMonitor,
  LoadingScreen,
  WhatsAppWidget,
} from "~/components";
import { useSelector } from "react-redux";
import type { RootState } from "~/store";

export default function MainLayout() {
  const loading = useSelector((state: RootState) => state.loading.loading);

  return (
    <ImagesLoadMonitor className="min-h-screen flex flex-col bg-primary text-secondary selection:bg-side-2 selection:text-secondary">
      <Header />
      <main className={`grow w-full max-w-7xl mx-auto pt-18`}>
        <Outlet />
      </main>
      <Footer />
      <WhatsAppWidget />
      <DisclaimerBanner />
      <LoadingScreen open={loading} />
    </ImagesLoadMonitor>
  );
}
