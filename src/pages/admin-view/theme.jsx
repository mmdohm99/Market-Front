import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { getThemePalette, saveThemePalette } from "@/store/theme-slice";
import ProductImageUpload from "@/components/admin-view/image-upload";

const defaultPalette = {
  primary: "#ec4899",
  secondary: "#fce7f3",
  accent: "#f9a8d4",
  background: "#fffafc",
  foreground: "#2a2a2a",

  darkMode: false,
  allowDarkMode: false,

  fontHeading: '"Poppins", "Segoe UI", sans-serif',
  fontBody: '"Inter", "Segoe UI", system-ui, sans-serif',

  logo: "",
};
const presetPalettes = [
  {
    name: "Blush Pink",
    primary: "#d977a8",
    secondary: "#fde7ef",
    accent: "#f4a7c0",
    background: "#fff8fb",
    foreground: "#4b1f33",
  },
  {
    name: "Rose Gold",
    primary: "#b76e79",
    secondary: "#f7e1e5",
    accent: "#e0a4af",
    background: "#fff8f8",
    foreground: "#40252a",
  },
  {
    name: "Lavender Dream",
    primary: "#9f7aea",
    secondary: "#efe7ff",
    accent: "#c4b5fd",
    background: "#faf7ff",
    foreground: "#312e52",
  },
  {
    name: "Peach Cream",
    primary: "#f59e8b",
    secondary: "#ffe5dc",
    accent: "#fdba9a",
    background: "#fff9f7",
    foreground: "#4a2c24",
  },
  {
    name: "Soft Sakura",
    primary: "#ec4899",
    secondary: "#fce7f3",
    accent: "#f9a8d4",
    background: "#fffafc",
    foreground: "#4a044e",
  },
  {
    name: "Champagne",
    primary: "#c08a5b",
    secondary: "#f8ede3",
    accent: "#ddb892",
    background: "#fffaf5",
    foreground: "#4e3424",
  },
  {
    name: "Vanilla Beige",
    primary: "#c08457",
    secondary: "#f7efe5",
    accent: "#ddb892",
    background: "#fffdf9",
    foreground: "#43302b",
  },
  {
    name: "Dusty Rose",
    primary: "#c08497",
    secondary: "#f8e8ee",
    accent: "#e9a6b6",
    background: "#fffafb",
    foreground: "#522c35",
  },
  {
    name: "Lilac Glow",
    primary: "#a78bfa",
    secondary: "#f3e8ff",
    accent: "#d8b4fe",
    background: "#fcfaff",
    foreground: "#3b2c5a",
  },
  {
    name: "Cotton Candy",
    primary: "#fb7185",
    secondary: "#ffe4ec",
    accent: "#f9a8d4",
    background: "#fffafd",
    foreground: "#4b1d2a",
  },
  {
    name: "Baby Pink",
    primary: "#f472b6",
    secondary: "#fce7f3",
    accent: "#f9a8d4",
    background: "#fffafd",
    foreground: "#4a044e",
  },
  {
    name: "Soft Coral",
    primary: "#fb7185",
    secondary: "#ffe4e6",
    accent: "#fda4af",
    background: "#fffafa",
    foreground: "#4a1d24",
  },
  {
    name: "Creamy Latte",
    primary: "#b08968",
    secondary: "#ede0d4",
    accent: "#ddb892",
    background: "#fffaf5",
    foreground: "#3f2b20",
  },
  {
    name: "Mauve Elegance",
    primary: "#a35d6a",
    secondary: "#f4e1e6",
    accent: "#d4a5b5",
    background: "#fffafb",
    foreground: "#41222d",
  },
  {
    name: "Pastel Violet",
    primary: "#8b5cf6",
    secondary: "#ede9fe",
    accent: "#c4b5fd",
    background: "#faf8ff",
    foreground: "#312e52",
  },
  {
    name: "Soft Nude",
    primary: "#c69c72",
    secondary: "#f7ede2",
    accent: "#ddb892",
    background: "#fffdf9",
    foreground: "#4b362c",
  },
  {
    name: "Cherry Blossom",
    primary: "#f43f5e",
    secondary: "#ffe4ec",
    accent: "#fda4af",
    background: "#fff9fb",
    foreground: "#4c0519",
  },
  {
    name: "Princess Pink",
    primary: "#ff4fa3",
    secondary: "#ffe0ef",
    accent: "#ff8dc7",
    background: "#fff7fb",
    foreground: "#4a1030",
  },
  {
    name: "Elegant Plum",
    primary: "#7e5bef",
    secondary: "#efe7ff",
    accent: "#b79cff",
    background: "#faf7ff",
    foreground: "#2f2452",
  },
  {
    name: "Warm Blush",
    primary: "#e78ea9",
    secondary: "#fdecef",
    accent: "#f6b4c7",
    background: "#fffafb",
    foreground: "#4b2332",
  },
];
const colorKeys = [
  "primary",
  "secondary",
  "accent",
  "background",
  "foreground",
];
const fontOptions = [
  { label: "Default Heading", value: '"Cormorant Garamond", "Georgia", serif' },
  {
    label: "Default Body",
    value: '"DM Sans", "Segoe UI", system-ui, sans-serif',
  },
  { label: "Poppins", value: '"Poppins", "Segoe UI", sans-serif' },
  { label: "Inter", value: '"Inter", "Segoe UI", sans-serif' },
  { label: "Roboto", value: '"Roboto", "Segoe UI", sans-serif' },
  { label: "Georgia", value: '"Georgia", serif' },
];
const isValidHex = (value) => /^#([a-fA-F0-9]{3}|[a-fA-F0-9]{6})$/.test(value);
const normalizeHex = (value) => {
  const cleaned = value.trim().toLowerCase();
  if (cleaned.length === 4) {
    return `#${cleaned[1]}${cleaned[1]}${cleaned[2]}${cleaned[2]}${cleaned[3]}${cleaned[3]}`;
  }
  return cleaned;
};

function AdminTheme() {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { palette, isLoading } = useSelector((state) => state.theme);
  const [formData, setFormData] = useState(defaultPalette);
  const [hexDraft, setHexDraft] = useState({
    primary: defaultPalette.primary,
    secondary: defaultPalette.secondary,
    accent: defaultPalette.accent,
    background: defaultPalette.background,
    foreground: defaultPalette.foreground,
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);

  useEffect(() => {
    dispatch(getThemePalette());
  }, [dispatch]);

  useEffect(() => {
    if (palette) {
      setFormData({
        primary: palette.primary || defaultPalette.primary,
        secondary: palette.secondary || defaultPalette.secondary,
        accent: palette.accent || defaultPalette.accent,
        background: palette.background || defaultPalette.background,
        foreground: palette.foreground || defaultPalette.foreground,
        darkMode: palette.darkMode === true,
        allowDarkMode: palette.allowDarkMode === true,
        fontHeading: palette.fontHeading || defaultPalette.fontHeading,
        fontBody: palette.fontBody || defaultPalette.fontBody,
        logo: palette.logo || "",
      });
      setHexDraft({
        primary: palette.primary || defaultPalette.primary,
        secondary: palette.secondary || defaultPalette.secondary,
        accent: palette.accent || defaultPalette.accent,
        background: palette.background || defaultPalette.background,
        foreground: palette.foreground || defaultPalette.foreground,
      });
      setUploadedImageUrl(palette.logo || "");
    }
  }, [palette]);

  useEffect(() => {
    if (uploadedImageUrl) {
      setFormData((previous) => ({ ...previous, logo: uploadedImageUrl }));
    }
  }, [uploadedImageUrl]);

  const updateColor = (key, value) => {
    setFormData((previous) => ({ ...previous, [key]: value }));
    setHexDraft((previous) => ({ ...previous, [key]: value }));
  };

  const handleHexBlur = (key) => {
    const rawValue = (hexDraft[key] || "").trim();
    if (!rawValue) return;

    if (!isValidHex(rawValue)) {
      toast({
        title: "Invalid hex color",
        description: `Use format like #fff or #aabbcc for ${key}.`,
        variant: "destructive",
      });
      setHexDraft((previous) => ({ ...previous, [key]: formData[key] }));
      return;
    }

    const normalizedValue = normalizeHex(rawValue);
    updateColor(key, normalizedValue);
  };

  const handleSave = async () => {
    const result = await dispatch(saveThemePalette(formData));
    if (result?.payload?.success) {
      toast({
        title: "Theme saved",
        description: "The new color palette is now active for all users.",
      });
      return;
    }

    toast({
      title: "Error",
      description:
        result?.payload?.message || "Could not save theme palette right now.",
      variant: "destructive",
    });
  };

  return (
    <div className="p-6 flex justify-center">
      <Card
        className="
        max-w-6xl w-full
        bg-white/10 dark:bg-white/5
        backdrop-blur-2xl
        border-0
        shadow-[0_8px_40px_rgba(0,0,0,0.25)]
        rounded-3xl
      "
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold">Theme Palette</CardTitle>

          <p className="text-sm text-muted-foreground">
            Choose global site colors. Saving here updates the palette for every
            user.
          </p>
        </CardHeader>

        <CardContent className="space-y-8">
          <div className="relative">
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
              {presetPalettes.map((paletteItem) => (
                <button
                  key={paletteItem.name}
                  type="button"
                  onClick={() => {
                    setFormData((previous) => ({
                      ...previous,
                      primary: paletteItem.primary,
                      secondary: paletteItem.secondary,
                      accent: paletteItem.accent,
                      background: paletteItem.background,
                      foreground: paletteItem.foreground,
                    }));

                    setHexDraft({
                      primary: paletteItem.primary,
                      secondary: paletteItem.secondary,
                      accent: paletteItem.accent,
                      background: paletteItem.background,
                      foreground: paletteItem.foreground,
                    });
                  }}
                  className="
          flex items-center justify-between
          rounded-xl
          bg-white/10
          hover:bg-white/20
          transition-all
          px-3 py-2
          text-sm
          shadow-md
        "
                >
                  <span>{paletteItem.name}</span>

                  <div className="flex gap-1">
                    {[
                      paletteItem.primary,
                      paletteItem.secondary,
                      paletteItem.accent,
                      paletteItem.background,
                      paletteItem.foreground,
                    ].map((color, index) => (
                      <div
                        key={index}
                        className="h-4 w-4 rounded-full border border-white/20"
                        style={{ background: color }}
                      />
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {colorKeys.map((colorKey) => (
              <div
                key={colorKey}
                className="
                space-y-3
                bg-white/5
                backdrop-blur-xl
                rounded-2xl
                p-4
                shadow-md
              "
              >
                <Label
                  htmlFor={`${colorKey}Color`}
                  className="text-sm font-semibold"
                >
                  {colorKey.charAt(0).toUpperCase() + colorKey.slice(1)} Color
                </Label>

                <div className="flex gap-3 items-center">
                  <Input
                    id={`${colorKey}Color`}
                    type="color"
                    value={formData[colorKey]}
                    onChange={(event) =>
                      updateColor(colorKey, event.target.value)
                    }
                    className="
                    h-14 w-20 p-1
                    rounded-xl
                    border-0
                    bg-transparent
                    cursor-pointer
                    shadow-md
                  "
                  />

                  <Input
                    value={hexDraft[colorKey]}
                    onChange={(event) =>
                      setHexDraft((previous) => ({
                        ...previous,
                        [colorKey]: event.target.value,
                      }))
                    }
                    onBlur={() => handleHexBlur(colorKey)}
                    placeholder="#fff or #aabbcc"
                    className="
                    border-0
                    bg-white/10
                    backdrop-blur-lg
                    shadow-inner
                    rounded-xl
                    h-12
                  "
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div
              className="
              space-y-3
              bg-white/5
              rounded-2xl
              p-4
              shadow-md
            "
            >
              <Label htmlFor="fontHeading">Heading Font Family</Label>

              <select
                id="fontHeading"
                value={formData.fontHeading}
                onChange={(event) =>
                  setFormData((previous) => ({
                    ...previous,
                    fontHeading: event.target.value,
                  }))
                }
                className="
                w-full h-12
                rounded-xl
                border-0
                bg-white/10
                backdrop-blur-lg
                px-3
                shadow-inner
                outline-none
              "
              >
                {fontOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div
              className="
              space-y-3
              bg-white/5
              rounded-2xl
              p-4
              shadow-md
            "
            >
              <Label htmlFor="fontBody">Body Font Family</Label>

              <select
                id="fontBody"
                value={formData.fontBody}
                onChange={(event) =>
                  setFormData((previous) => ({
                    ...previous,
                    fontBody: event.target.value,
                  }))
                }
                className="
                w-full h-12
                rounded-xl
                border-0
                bg-white/10
                backdrop-blur-lg
                px-3
                shadow-inner
                outline-none
              "
              >
                {fontOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div
            className="
            space-y-5
            bg-white/5
            rounded-2xl
            p-5
            shadow-md
          "
          >
            <div className="flex items-center gap-3">
              <input
                id="allowDarkMode"
                type="checkbox"
                checked={formData.allowDarkMode}
                onChange={(event) =>
                  setFormData((previous) => ({
                    ...previous,
                    allowDarkMode: event.target.checked,
                  }))
                }
                className="h-5 w-5"
              />

              <Label htmlFor="allowDarkMode">
                Show dark mode toggle for all users and admin
              </Label>
            </div>

            <div className="flex items-center gap-3">
              <input
                id="darkMode"
                type="checkbox"
                checked={formData.darkMode}
                onChange={(event) =>
                  setFormData((previous) => ({
                    ...previous,
                    darkMode: event.target.checked,
                  }))
                }
                className="h-5 w-5"
              />

              <Label htmlFor="darkMode">
                Default mode is dark (used on first load)
              </Label>
            </div>
          </div>

          <div
            className="
            space-y-4
            bg-white/5
            rounded-2xl
            p-5
            shadow-md
          "
          >
            <Label>Website Logo (also browser tab icon)</Label>

            <ProductImageUpload
              imageFile={imageFile}
              setImageFile={setImageFile}
              uploadedImageUrl={uploadedImageUrl}
              setUploadedImageUrl={setUploadedImageUrl}
              setImageLoadingState={setImageLoadingState}
              imageLoadingState={imageLoadingState}
              isCustomStyling={true}
            />

            {formData.logo ? (
              <div className="mt-3 flex items-center gap-4">
                <img
                  src={formData.logo}
                  alt="Site logo preview"
                  className="
                  h-14 w-14
                  rounded-2xl
                  object-cover
                  shadow-lg
                "
                />

                <Button
                  variant="outline"
                  onClick={() => {
                    setFormData((previous) => ({
                      ...previous,
                      logo: "",
                    }));

                    setUploadedImageUrl("");
                    setImageFile(null);
                  }}
                  className="
                  border-0
                  bg-white/10
                  hover:bg-white/20
                  backdrop-blur-lg
                  rounded-xl
                  shadow-md
                "
                >
                  Remove Logo
                </Button>
              </div>
            ) : null}
          </div>

          <div className="flex gap-4 pt-2">
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="
              rounded-xl
              shadow-lg
              px-6
            "
            >
              Save Palette
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                setFormData(defaultPalette);

                setHexDraft({
                  primary: defaultPalette.primary,
                  secondary: defaultPalette.secondary,
                  accent: defaultPalette.accent,
                  background: defaultPalette.background,
                  foreground: defaultPalette.foreground,
                });

                setUploadedImageUrl("");
                setImageFile(null);
              }}
              disabled={isLoading}
              className="
              border-0
              bg-white/10
              hover:bg-white/20
              backdrop-blur-lg
              rounded-xl
              shadow-md
            "
            >
              Reset to Default
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminTheme;
