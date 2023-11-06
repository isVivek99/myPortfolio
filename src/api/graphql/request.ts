import type { GraphQLVariables } from "./types";

const makeGraphQLRequest = async (
  query: string,
  variables: GraphQLVariables,
) => {
  const response = await fetch(import.meta.env.HASHNODE_BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const data = await response.json();
  return data;
};

export default makeGraphQLRequest;
