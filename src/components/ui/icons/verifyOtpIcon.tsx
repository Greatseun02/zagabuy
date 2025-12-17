import { RectangleEllipsis } from "lucide-react";
import { Card } from "../card";

export default function VerifyOtpIcon() {
  return (
    <Card
      width={"fit"}
      variant={"secondary"}
      rounded={"full"}
      size={"md"}
      shadow={"xl"}
      withHover={"enabled"}
      className="hover:"
    >
      <Card
        width={"fit"}
        variant={"primary"}
        rounded={"full"}
        size={"md"}
        // opacity={"50"}
        shadow={"xl"}
      >
        <RectangleEllipsis size={24} />
      </Card>
    </Card>
  );
}
