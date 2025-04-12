"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";

interface RockArtItem {
  id: string;
  title: string;
  origin: string;
  description: string;
  interpretation: string;
  symbols: string;
  figures: string;
  significance: string;
  estimated_date: string;
  images: {
    original: string;
    enhanced: string;
    generated: string;
  };
}

const rockArtItems = [
  {
    id: "1",
    title: "Dancing Figures",
    origin: "Matobo Hills, Zimbabwe",
    description: "Depicts a group of human figures dancing in a circle.",
    interpretation: "Believed to represent a ritual or spiritual dance.",
    symbols: "Circles, lines, dots",
    figures: "Human-like, elongated limbs",
    significance: "May symbolize community bonding or ceremonial gatherings.",
    estimated_date: "1200 BCE",
    original: "https://i.ibb.co/bM5hZNz2/3ee37ed8a171.png",
    enhanced: "https://i.ibb.co/5CvJBnw/62284e92aee1.png",
    generated: "https://i.ibb.co/bj6hP9sg/775e6578a3c8.png",
  },
  {
    id: "2",
    title: "The Hunter",
    origin: "Drakensberg Mountains, South Africa",
    description: "A lone hunter aiming a spear at an antelope.",
    interpretation: "Represents hunting practices and survival methods.",
    symbols: "Spear, animal tracks",
    figures: "Single human, antelope",
    significance: "Demonstrates relationship between humans and wildlife.",
    estimated_date: "1000 BCE",
    original: "https://i.ibb.co/bM5hZNz2/3ee37ed8a171.png",
    enhanced: "https://i.ibb.co/5CvJBnw/62284e92aee1.png",
    generated: "https://i.ibb.co/bj6hP9sg/775e6578a3c8.png",
  },
  {
    id: "3",
    title: "Shaman and Spirits",
    origin: "Brandberg Mountain, Namibia",
    description: "A central figure surrounded by ghostly shapes and symbols.",
    interpretation: "Thought to depict a spiritual leader in trance.",
    symbols: "Abstract patterns, waves",
    figures: "Shaman, spirit-like shapes",
    significance: "Likely used in spiritual or healing rituals.",
    estimated_date: "1500 BCE",
    original: "https://i.ibb.co/bM5hZNz2/3ee37ed8a171.png",
    enhanced: "https://i.ibb.co/5CvJBnw/62284e92aee1.png",
    generated: "https://i.ibb.co/bj6hP9sg/775e6578a3c8.png",
  },
];

const ArtworkCard = (item: any) => {
  console.log("item: ", item);
  const [currentImage, setCurrentImage] = useState(0);
  const images = [
    { src: item.item.original, label: item.original },
    { src: item.item.enhanced, label: "AI Enhanced" },
    { src: item.item.generated, label: "AI Generated" },
  ];

  const nextImage = () => {
    console.log("current page: ", images[currentImage].src);
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative aspect-square">
          <img
            src={images[currentImage].src}
            alt={`${item.item.title} - ${images[currentImage].label}`}
            className="h-full w-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-4 text-white">
            <div className="flex items-center justify-between">
              <button onClick={prevImage} className="p-2">
                <ChevronLeft className="h-6 w-6" />
              </button>
              <span className="text-sm font-medium">
                {images[currentImage].label}
              </span>
              <button onClick={nextImage} className="p-2">
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold">{item.item.title}</h3>
              <p className="text-muted-foreground text-sm">
                {item.item.origin}
              </p>
            </div>
            <Dialog>
              <DialogTrigger>
                <Info className="text-muted-foreground h-5 w-5 hover:text-primary" />
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{item.title}</DialogTitle>
                  <DialogDescription>
                    <div className="mt-4 space-y-4">
                      <div>
                        <h4 className="font-semibold">Description</h4>
                        <p className="text-sm">{item.item.description}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Interpretation</h4>
                        <p className="text-sm">{item.item.interpretation}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Symbols</h4>
                        <p className="text-sm">{item.item.symbols}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Figures</h4>
                        <p className="text-sm">{item.item.figures}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Significance</h4>
                        <p className="text-sm">{item.item.significance}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Estimated Date</h4>
                        <p className="text-sm">{item.item.estimated_date}</p>
                      </div>
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function GalleryPage() {
  const [paintings, setPaintings] = useState<any[]>(rockArtItems);

  // useEffect(() => {
  //   const getPaintings = async () => {
  //     try {
  //       const response = await fetch("/api/paintings/all", {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       });

  //       const data = await response.json();
  //       setPaintings(data)
  //       // console.log("claims: ", data)
  //     } catch (error) {}
  //   };

  //   getPaintings();
  // }, []);
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-lora mb-8 text-center text-3xl font-bold">
        Art Gallery
      </h1>
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-8 grid w-full grid-cols-3">
          <TabsTrigger value="all">All Artworks</TabsTrigger>
          <TabsTrigger value="symbols">Symbols</TabsTrigger>
          <TabsTrigger value="figures">Figures</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {paintings &&
              paintings.map((item) => (
                <ArtworkCard key={item.id} item={item} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="symbols">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {paintings &&
              paintings
                .filter((item) => item.symbols)
                .map((item) => <ArtworkCard key={item.id} item={item} />)}
          </div>
        </TabsContent>
        <TabsContent value="figures">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {paintings &&
              paintings
                .filter((item) => item.figures)
                .map((item) => <ArtworkCard key={item.id} item={item} />)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
