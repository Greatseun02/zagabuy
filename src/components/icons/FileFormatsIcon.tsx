import { ImageIcon, File } from "lucide-react";
import { SVGProps } from "react";

export type FileFormatTypes = "pdf" | "png" | "jpg" | "doc" | "xls";

function FileFormatsIcon({
  fileFormatType,
  ...props
}: SVGProps<SVGSVGElement> & {
  fileFormatType: FileFormatTypes;
}) {
  if (["pdf", "doc", "xls", "xlsx"].includes(fileFormatType))
    return <File {...props} />;
  else if (["png", "jpg"].includes(fileFormatType))
    return <ImageIcon {...props} />;
  else {
    return <File {...props} />;
  }
}

export default FileFormatsIcon;
