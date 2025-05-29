import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import type { VideoItem } from "@/types";
import { Button } from "../ui/button";

interface CardItemProps {
  name: string;
  description: string[];
  data: VideoItem[];
  selectedItemId: number;
  onButtonClick: (item:  VideoItem) => void;
}

export default function CardItem({ name, description, data, selectedItemId, onButtonClick }: CardItemProps) {
  return (
    <Card className="w-full max-w-md p-4 bg-white/90 shadow-lg">
      <CardHeader>
          <CardTitle className="text-4xl font-bold text-center">{name}</CardTitle>
      </CardHeader>

      <CardContent>
        {/* Botones */}
        <div
          className="flex gap-4 mb-4 justify-center"
          
        >
          {data.map((item) => (
            <Button
              key={item.id}
              onClick={() => onButtonClick(item as VideoItem)}
              className={`px-4 py-2 rounded-full text-white ${
                selectedItemId === item.id ? "bg-blue-600" : "bg-gray-400 hover:bg-gray-500"
              }`}
            >
              {item.id}
            </Button>
          ))}
        </div>

        {/* Descripción */}
        <div
          className="text-start"
  
        >
          <CardDescription>
            <ul className="flex flex-col w-full items-start justify-between list-disc list-inside">
              {description.map((desc, index) => (
                <li key={index} className="text-lg">
                  {desc}
                </li>
              ))}
            </ul>
          </CardDescription>
        </div>
      </CardContent>
    </Card>
  );
}
