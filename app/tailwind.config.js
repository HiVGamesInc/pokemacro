module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        gray: {
          850: "#1f2937",
          925: "#111827",
          950: "#0f172a",
        },
      },
      fontSize: {
        xs: ["11px", "16px"],
        sm: ["13px", "18px"],
        base: ["14px", "20px"],
        lg: ["16px", "24px"],
        xl: ["18px", "28px"],
        "2xl": ["20px", "28px"],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
