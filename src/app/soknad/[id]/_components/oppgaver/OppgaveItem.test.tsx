import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import OppgaveItem from "./OppgaveItem";

const flag = vi.hoisted(() => ({ enabled: false }));
const box = vi.hoisted(() => vi.fn((_props: { mode?: string }) => null));
vi.mock("@featuretoggles/context", () => ({ useFlag: () => ({ enabled: flag.enabled }) }));
vi.mock("@components/filopplasting/OpplastingsboksTus", () => ({ default: box }));
vi.mock("@components/filopplasting/utils/useContextId", () => ({ useContextId: () => "ctx" }));
vi.mock("@hooks/useVisningstekster", () => ({
    useVisningstekster: () => () => ({ typeTekst: "t", tilleggsinfoTekst: "d" }),
}));
vi.mock("next/navigation", () => ({ useParams: () => ({ id: "s1" }) }));
vi.mock("../tasklistitem/TaskListItem", () => ({
    default: ({ children }: { children: React.ReactNode }) => <li>{children}</li>,
}));
vi.mock("../tasklistitem/OppgaveTag", () => ({ default: () => null }));

const oppgave = { hendelsereferanse: "h1", dokumenttype: "a", tilleggsinformasjon: "b", erLastetOpp: false } as never;

describe("OppgaveItem", () => {
    it.each([
        [false, "tus"],
        [true, "sync"],
    ])("passes mode for toggle %s", (enabled, mode) => {
        flag.enabled = enabled;
        render(<OppgaveItem oppgave={oppgave} />);
        expect(box.mock.calls.at(-1)?.[0].mode).toBe(mode);
    });
});
