import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Portal",
  description: "YoüngTëch Student Portal",
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