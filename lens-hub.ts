import { ethers } from 'ethers';
import { LENS_HUB_ABI, LENS_HUB_CONTRACT } from './config/config';

// lens contract info can all be found on the deployed
// contract address on polygon.
export const lensHub = new ethers.Contract(
  LENS_HUB_CONTRACT,
  LENS_HUB_ABI
) as unknown as any;