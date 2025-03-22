import { motion, useTransform, useScroll } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export const Slider = ({
  prompt,
  count,
}: {
  prompt: string;
  count: number;
}) => {
  const [images, setImages] = useState<
    { url: string; title: string; id: string }[] | []
  >([]);

  useEffect(() => {
    if (!prompt || !count) {
      return;
    }
    const fetchImages = async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/openai/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt, count }),
        }
      );
      const data = await response.json();
      console.log(data);
      console.log(data.images);
      const finalImages = data?.images?.map((image, index) => {
        return {
          url: image,
          title: `image-1`,
          id: index,
        };
      });
      setImages(finalImages);
    };
    fetchImages();
  }, [prompt, count]);

  return images && images.length > 0 ? (
    <div className="bg-neutral-800">
      <div className="flex h-48 items-center justify-center">
        <span className="font-semibold uppercase text-neutral-500">
          Scroll down
        </span>
      </div>
      <HorizontalScrollCarousel images={images} />
      <div className="flex h-48 items-center justify-center">
        <span className="font-semibold uppercase text-neutral-500">
          Scroll up
        </span>
      </div>
    </div>
  ) : (
    ""
  );
};

const HorizontalScrollCarousel = (
  images: { url: string; title: string; id: string }[]
) => {
  console.log(images)
  const imagesArray = images.images
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["1%", "-95%"]);

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-neutral-900">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div style={{ x }} className="flex gap-4">
          {imagesArray.map((card) => {
            return <Card card={card} key={card.id} />;
          })}
        </motion.div>
      </div>
    </section>
  );
};

const Card = ({ card }) => {
  return (
    <div
      key={card.id}
      className="group relative h-[450px] w-[450px] overflow-hidden bg-neutral-200"
    >
      <div
        style={{
          backgroundImage: `url(${card.url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="absolute inset-0 z-0 transition-transform duration-300 group-hover:scale-110"
      ></div>
      <div className="absolute inset-0 z-10 grid place-content-center">
        <p className="bg-gradient-to-br from-white/20 to-white/0 p-8 text-6xl font-black uppercase text-white backdrop-blur-lg">
          {card.title}
        </p>
      </div>
    </div>
  );
};
