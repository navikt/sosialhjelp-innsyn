import * as React from "react";
import App from "./App";
import {createRoot} from "react-dom/client";
import {act} from "@testing-library/react";

it("renders without crashing", () => {
    act(() => {
        const root = createRoot(document.createElement("div"));
        root.render(<App />);
        root.unmount();
    });
});
