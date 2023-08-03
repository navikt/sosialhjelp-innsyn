import {NextApiRequest, NextApiResponse} from "next";

const isAlive = (req: NextApiRequest, res: NextApiResponse): void => {
    res.status(200);
};

export default isAlive;
