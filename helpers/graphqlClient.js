import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { ApolloLink, split } from "apollo-link";
import { getMainDefinition } from "apollo-utilities";
import { onError } from "apollo-link-error";
import { WebSocketLink } from "apollo-link-ws";
import { Hermes } from "apollo-cache-hermes";
import { InMemoryCache } from "apollo-cache-inmemory";

import { Constants } from "expo";
const clientId = Constants.deviceId;

let client;
export function clearClient() {
  client = null;
}
export async function getClient(address, port) {
  try {
    if (client) {
      return client;
    }
    if (!address || !port) {
      return false;
    }
    const WS_PORT = await fetch(`http://${address}:${parseInt(port, 10) + 1}`)
      .then(res => {
        if (res.status === 404) return parseInt(port, 10) + 1;
        return parseInt(port, 10);
      })
      .catch(() => {
        return parseInt(port, 10);
      });
    const wsLink = new WebSocketLink({
      uri: `ws://${address}:${WS_PORT}/${
        WS_PORT === parseInt(port, 10) ? "graphql" : "subscriptions"
      }`,
      options: {
        reconnect: true
      },
      webSocketImpl: global.Websocket
    });

    const httpLink = ApolloLink.from([
      onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors)
          graphQLErrors.map(({ message, locations, path }) =>
            console.log(
              `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            )
          );
        if (networkError) console.log(`[Network error]: ${networkError}`);
      }),
      new HttpLink({
        uri: `http://${address}:${parseInt(port, 10)}/graphql`,
        headers: { clientId },
        opts: {
          mode: "cors"
        }
      })
    ]);

    const link = split(
      // split based on operation type
      ({ query }) => {
        const { kind, operation } = getMainDefinition(query);
        return kind === "OperationDefinition" && operation === "subscription";
      },
      wsLink,
      httpLink
    );

    const cache = new Hermes();
    client = new ApolloClient({
      link,
      cache: new InMemoryCache()
    });
    return client;
  } catch (err) {
    console.log("There was an error");
    console.log(err);
  }
}
