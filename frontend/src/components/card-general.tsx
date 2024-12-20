import { ShoppingCart, User } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

import { CourseData } from "@/features/courses/interfaces";

import { Card, CardContent, CardHeader } from "./ui/card";
import { StarRating } from "./start-rating";
import { Button } from "./ui/button";

interface CardGeneralProps extends CourseData {
  handleNavigation?: (id: number) => void;
}

const CardGeneral = ({
  id,
  title,
  description,
  tags,
  type,
  image,
  calification,
  price,
  handleNavigation,
}: CardGeneralProps) => {
  return (
    <Card className="flex flex-col  w-full min-h-[500px] h-full   bg-background dark:bg-gray-700/80  rounded-md overflow-hidden ">
      <CardHeader className="flex basis-2/5    p-0 m-0 relative ">
        <Image src={image ?? "/images/default.png"} alt="header" fill />

        <div
          className={cn(
            "absolute top-2 left-4 flex items-center gap-x-2 rounded-md bg-primario/60 dark:bg-primario-100/80 text-primario-100 dark:text-primario-300 px-2 py-1 text-xs",
            type === "app"
              ? "bg-green-600/60 dark:bg-green-100 text-green-100 dark:text-green-400"
              : ""
          )}
        >
          <p>{type}</p>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col basis-3/5  p-4  text-sm justify-between gap-2">
        <h1 className="font-semibold">{title}</h1>

        <p className="text-xs">{description}</p>
        <div className="flex  text-xs bg-primario-200 dark:bg-gray-600 rounded-md px-2 py-1  min-w-[80px] text-primario-700 dark:text-primary items-center justify-center">
          <User className="size-6 pr-2" />
          <p>User</p>
        </div>
        <div className="flex gap-x-2 ">
          {tags?.map((tag, index) => (
            <div
              key={index}
              className="flex items-center gap-x-2 rounded-md bg-primario/80 dark:bg-primario-100/80 text-primario-100 dark:text-primario px-2 py-1 text-xs"
            >
              <p>{tag}</p>
            </div>
          ))}
        </div>

        <div className="mt-2">
          <StarRating rating={calification} />
        </div>

        <div>
          <p>$ {price}</p>
        </div>

        <div className="flex   justify-around w-full gap-2">
          <Button variant={"primario"} className="w-1/2 sm:w-1/2 text-xs">
            <ShoppingCart className="size-5 " /> Añadir al Carrito
          </Button>

          <Button
            variant={"link"}
            className="w-1/2 sm:w-1/2 text-xs text-primario dark:text-primario-200"
            onClick={() => {
              handleNavigation?.(id);
            }}
          >
            Ver Detalles
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardGeneral;
