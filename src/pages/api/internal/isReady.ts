import {NextApiRequest, NextApiResponse} from "next";

const isReady = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    res.status(200).json({message: "I'm ready!"});
};

export default isReady;
