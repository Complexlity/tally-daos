export async function fetcher({ query, variables }: {query: string, variables: {chainId: string} & any}) {
  return fetch(process.env.TALLY_API_URL!, {
		method: "POST",
		//@ts-expect-error
    headers: {
      "Content-Type": "application/json",
      "Api-Key": process.env.TALLY_API_KEY,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  })
    .then((response) => response.json())
    .then((json) => {
      if (json?.errors) {
        console.error("error when fetching");

        return null;
      }

      return json.data;
    })
    .catch((error) => {
      console.log("Error when fetching =>", error);

      return null;
    });
};
