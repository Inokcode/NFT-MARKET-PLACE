import Head from "next/head";
import Image from "next/image";
import { Banner } from "../components";
// import styles from '../styles/Home.module.css'

// export default function Home() {
//   return <h1 className="text-3xl font-bold underline">Hello world!</h1>;
// }

const HOME = () => {
  return (
    <div className="flex justify-center sm:px-4 p-12">
      <div className="w-full minmd:w-4/5">
        <Banner
          childStyles="md:text-4xl sm:text-2xl xs=text-xl text-left"
          parentstyles="justify-start mb-6 h-72 sm:h-60 p-12 xs:p-4 xs:h-44 rounded-3xl"
          name="Discover,collect,and sell extraordinary NFTs"
        />
      </div>
    </div>
  );
};
export default HOME;
