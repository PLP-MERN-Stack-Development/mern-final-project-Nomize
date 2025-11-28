import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import App from "../App";
import { ThemeProvider } from "@/contexts/ThemeContext";

describe("App Component", () => {
  it("renders the application without crashing", () => {
    render(
      <ThemeProvider>
        <App />
      </ThemeProvider>
    );
    expect(true).toBe(true);
  });
});
