import { create } from "ipfs-http-client";
import { STORAGE_TOKEN, INFURA_PROJECT_ID, INFURA_SECRET } from "./config/config";
import { Blob, NFTStorage } from "nft.storage";

const projectId = INFURA_PROJECT_ID;
const secret = INFURA_SECRET;

if (!STORAGE_TOKEN) {
  throw new Error("Must define STORAGE_TOKEN in the config file to run this");
}

const client = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: `Basic ${Buffer.from(`${projectId}:${secret}`, 'utf-8').toString('base64')}`,
  },
});

export const uploadIpfs = async <T>(data: T) => {
    let storageClient = new NFTStorage({ token: STORAGE_TOKEN });
    const blob = new Blob([JSON.stringify(data)]);
    const result = await storageClient.storeBlob(blob);
    console.log('upload result ipfs', result);
    return result;
};

export const uploadBlobToIpfs = async (blob : any) => {
    let storageClient = new NFTStorage({ token: STORAGE_TOKEN });
    const result = await storageClient.storeBlob(blob);
    return result;
};

export const uploadIpfsGetPath = async <T>(data: T) => {
  const result = await client.add(JSON.stringify(data));

  console.log('upload result ipfs', result);
  return result.path;
};
