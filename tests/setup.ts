import "@testing-library/jest-dom";
import { vi } from "vitest";

// Necessary for vitest to work with react-relay
global.jest = vi as unknown as typeof jest;
