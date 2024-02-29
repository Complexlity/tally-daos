//@ts-nocheck
import { fetcher } from "./fetcher";

export async function getOrganizations(
	lean: boolean = false,
  input = {
    sort: {
      isDescending: true,
      sortBy: "EXPLORE",
    },
    filters: {
      mustHaveLogo: true,
    },
    page: {
      limit: 20,
    },
  }
) {
  const governorProposalsDocument = `
    query ExploreOrgs($input: OrganizationsInput!) {
  organizations(input: $input) {
    nodes {
      ... on Organization {
        name
        slug
        chainIds
        activeProposalsCount
        votersCount
        governorIds
        metadata {
          icon
        }
      }
    }
  }
}

	`;

  const result = await fetcher({
    query: governorProposalsDocument,
    variables: {
    input
    },
	});

	const activeProposalsOrganizations = cleanOrganizations(result.organizations.nodes, lean)

  return activeProposalsOrganizations;
}

function cleanOrganizations(nodes,lean) {
const filteredNodes = nodes.filter((node) => node.activeProposalsCount > 0);

// Sort filtered nodes by voters count
	filteredNodes.sort((b, a) => a.votersCount - b.votersCount);
	if (lean) {
		const newNodes = []
    for (let i = 0; i < filteredNodes.length; i++){
      if (i == 10) break
			const curr = filteredNodes[i]
			const newCurr = {
				chainId: curr.chainIds[0],
        governorIds: curr.governorIds,
        slug: curr.slug
			}
			newNodes.push(newCurr)
		}
        return { firstOrgName: filteredNodes[0].name, orgs: newNodes };
	}

return filteredNodes

}