import { NextApiRequest, NextApiResponse } from "next";

const isAlive = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    res.status(200).json({ message: "I'm alive!" });
};

export default isAlive;
