interface AvatarProps {
  src?: string | null;
  firstName: string;
  lastName: string;
  size?: "sm" | "md" | "lg" | "xl";
  theme?: "light" | "dark";
}

const sizeClasses = {
  sm: "w-10 h-10 text-sm",
  md: "w-16 h-16 text-xl",
  lg: "w-24 h-24 text-3xl",
  xl: "w-32 h-32 text-4xl",
};

export const Avatar = ({ src, firstName, lastName, size = "md", theme = "dark" }: AvatarProps) => {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  // Generate a consistent color based on the name
  const getColorFromName = (name: string) => {
    const colors = [
      "from-emerald-500 to-blue-500",
      "from-purple-500 to-pink-500",
      "from-orange-500 to-red-500",
      "from-cyan-500 to-blue-500",
      "from-yellow-500 to-orange-500",
      "from-green-500 to-teal-500",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (src) {
    return (
      <img
        src={src}
        alt={`${firstName} ${lastName}`}
        className={`${sizeClasses[size]} rounded-full object-cover border-2 ${
          theme === "dark" ? "border-gray-700" : "border-gray-300"
        }`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-bold text-white shadow-md bg-gradient-to-br ${getColorFromName(
        firstName
      )}`}
    >
      {initials}
    </div>
  );
};