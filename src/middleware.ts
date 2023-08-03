import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";

export function middleware(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    if (!searchParams.has("goto")) {
        throw new Error("redirect mangler goto-parameter");
    }
    return NextResponse.redirect(new URL(searchParams.get("goto")!, request.nextUrl.origin));
}

export const config = {
    matcher: "/link",
};
