import { apolloClient } from "@/apolloClient/client";
import {
  BroadcastOnchainDocument,
  BroadcastRequest,
} from '../graphql/generated';
import gql from "graphql-tag";

export const broadcastOnchainRequest = async (request: BroadcastRequest) => {
  const result = await apolloClient.mutate({
    mutation: gql(BroadcastOnchainDocument),
    variables: {
      request,
    },
  });

  return result.data!.broadcastOnchain;
};
