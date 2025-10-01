import Banner from "@/components/Banner";
import Home1 from "@/components/Home1";
import Home2 from "@/components/Home2";
import Home3 from "@/components/Home3";
import Home4 from "@/components/Home4";
import Navbar from "@/components/Navbar";
import Navbar1 from "@/components/Navbar1";
import Image from "next/image";

export default function Home() {
  return (
  <>
  <Navbar1/>
  <Navbar/>
  <Banner/>
  <Home1/>
  <Home2/>
  <Home3/>
  <Home4/>
  </>
  );
}
