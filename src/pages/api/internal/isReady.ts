import {NextApiRequest, NextApiResponse} from "next";

const isReady = (req: NextApiRequest, res: NextApiResponse): void => {
    res.status(200);
};

export default isReady;
