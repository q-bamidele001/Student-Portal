import { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Landing Page",
  description: "This is the landingPage for this application",
};

export default function LandingPageLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      {/* <Navbar /> */}
      <div>{children}</div>
      {/* <Footer /> */}
    </div>
  );
}