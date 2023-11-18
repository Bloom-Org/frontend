// @ts-ignore
import omitDeep from "omit-deep";
import { ethers} from "ethers";
import { httpProvider } from "./config/config";

export const ethersProvider = new ethers.providers.JsonRpcProvider(httpProvider);

export const omit = (object: any, name: any) => {
    return omitDeep(object, name);
};