import { withMetadata } from "@navikt/next-logger/secure-log/pages";
import { jwtDecode, JwtPayload } from "jwt-decode";

export default withMetadata((req) => {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwtDecode<{ pid?: string } & JwtPayload>(token ?? "");

    return { x_fodselsdato: decoded.pid };
});
