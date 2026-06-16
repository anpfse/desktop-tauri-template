import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("renders button children", () => {
    render(<Button>提交</Button>);

    expect(screen.getByRole("button", { name: "提交" })).toBeInTheDocument();
  });
});
