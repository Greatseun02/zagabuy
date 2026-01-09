"use client";
import { useTheme } from "next-themes";
import { Button, ButtonProps } from "../ui/button";
import { themesEnum } from "@/utilities/enums/themesEnum";
import { SunMoon } from "lucide-react";

export default function ThemeSwitcher({ ...rest }: ButtonProps) {
  const { theme, setTheme } = useTheme();

  const handleThemeSwitch = () => {
    if (theme === themesEnum.light) {
      setTheme(themesEnum.dark);
    } else {
      setTheme(themesEnum.light);
    }
  };

  return (
    <Button
      value={theme}
      onClick={handleThemeSwitch}
      variant={"transparent"}
      startIcon={<SunMoon />}
      startIconProps={{
        className: "size-7",
      }}
      width={"fit"}
      size={"icon-lg"}
      // className="absolute top-3 right-5"
      {...rest}
    ></Button>
  );
}
