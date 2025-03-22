import { useRef } from "react";
import { CreateSong } from "../components/CreateSong";
import Hero from "./Hero";

export const Home = () => {
  const sectionRef = useRef(null);

  const scrollToCreateSong = () => {
    sectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Hero scrollTo={scrollToCreateSong} />
      <div ref={sectionRef}>
        <CreateSong />
      </div>
    </>
  );
};
