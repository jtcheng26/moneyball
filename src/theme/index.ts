export interface ThemeColor {
  color: string;
  underline: string;
}

export const THEME_COLORS: Record<string, Record<number, ThemeColor>> = {
  dark: {
    0: {
      color: "#FFFFFF",
      underline: "#E0E6E9",
    },
    50: {
      color: "#E0E6E9",
      underline: "#8098A4",
    },
    200: {
      color: "#8098A4",
      underline: "#5C7B8A",
    },
    500: {
      color: "#264F64",
      underline: "#133F56",
    },
    800: {
      color: "#003049",
      underline: "#003049",
    },
  },
  green: {
    500: {
      color: "#6FCF97",
      underline: "#27AE60",
    },
  },
  red: {
    500: {
      color: "#EB5757",
      underline: "#D62828",
    },
  },
  theme: {
    50: {
      color: "#EAE2B7",
      underline: "#FCBF49",
    },
    400: {
      color: "#FCBF49",
      underline: "#F77F00",
    },
    500: {
      color: "#F77F00",
      underline: "#D62828",
    },
  },
  horse: {
    500: {
      color: "#d58d57",
      underline: "#914f3b",
    },
  },
  pig: {
    500: {
      color: "#f9a8d4",
      underline: "#ec4899",
    },
  },
};
