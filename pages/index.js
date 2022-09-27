// import Head from "next/head";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Banner, CreatorCard } from "../components";
// import styles from '../styles/Home.module.css'
import images from "../assets";
import { makeId } from "../utils/makeId";
import { useTheme } from "next-themes";

// export default function Home() {
//   return <h1 className="text-3xl font-bold underline">Hello world!</h1>;
// }

const HOME = () => {
  const [hideButtons, setHideButtons] = useState(false);
  const parentRef = useRef();
  const scrollRef = useRef();
  const { theme } = useTheme();
  //
  const isScrollable = () => {
    const { current } = scrollRef;
    const { current: parent } = parentRef;
    if (current?.scrollWidth >= parent?.offsetWidth) {
      setHideButtons(false);
    } else {
      setHideButtons(true);
    }
  };
  useEffect(() => {
    isScrollable();
    window.addEventListener("resize", isScrollable);
    return () => {
      window.removeEventListener("resize", isScrollable);
    };
  });
  //
  const handleScroll = (direction) => {
    const { current } = scrollRef;
    const scrollAmount = window.innerWidth > 1800 ? 270 : 210;
    if (direction === "left") {
      current.scrollLeft -= scrollAmount;
    } else {
      current.scrollLeft += scrollAmount;
    }
  };
  //
  return (
    <div className="flex justify-center sm:px-4 p-12">
      <div className="w-full minmd:w-4/5">
        <Banner
          childStyles="md:text-4xl sm:text-2xl xs=text-xl text-left"
          parentstyles="justify-start mb-6 h-72 sm:h-60 p-12 xs:p-4 xs:h-44 rounded-3xl"
          name="Discover,collect,and sell extraordinary NFTs"
        />
        <div>
          <h1 className="font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold ml-4 xs:ml-0">
            Best Creators
          </h1>
          <div className="relative flex-1 max-w-full flex mt-3" ref={parentRef}>
            <div
              className="flex flex-row w-max overflow-x-scroll no-scrollbar select-none"
              ref={scrollRef}
            >
              {[6, 7, 8, 9, 10].map((i) => (
                <CreatorCard
                  key={`creator-${i}`}
                  rank={i}
                  creatorImage={images[`creator${i}`]}
                  creatorName={`0x${makeId(3)}...${makeId(4)}`}
                  creatorEths={10 - i * 0.5}
                />
              ))}

              {!hideButtons && (
                <>
                  <div
                    className="absolute w-8 h-8 minlg:w-12 minlg:h-12 top-45 cursor-pointer left-0"
                    onClick={() => handleScroll("left")}
                  >
                    <Image
                      src={images.left}
                      layout="fill"
                      objectFit="contain"
                      alt="left_arrow"
                      className={theme === "light" && "filter invert"}
                    />
                  </div>
                  <div
                    className="absolute w-8 h-8 minlg:w-12 minlg:h-12 top-45 cursor-pointer right-0"
                    onClick={() => handleScroll("right")}
                  >
                    <Image
                      src={images.right}
                      layout="fill"
                      objectFit="contain"
                      alt="left_arrow"
                      className={theme === "light" && "filter invert"}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default HOME;
