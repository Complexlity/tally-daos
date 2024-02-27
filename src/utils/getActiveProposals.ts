import { Organization, Pokedex } from "./types";

async function getActiveProposalOrganizations() {
	const url = "https://www.tally.xyz/api/search-daos";
	const allGovernors = await fetch(url).then((res) => res.json())
	const activeGovernors = cleanGovernances(allGovernors)
  return activeGovernors
}


function cleanGovernances(governors: Pokedex): Organization[] {
  const governances = governors.governances
  let activeGovernors = [];

	//Remove governors with 0 active proposals
  for (let i = 0; i < governances.length; i++) {
    let currOrg = governances[i].organization;
    if (!currOrg) continue;
    let currOrgGov = currOrg.governances;
    if (!currOrgGov) continue;
    for (let j = 0; j < currOrgGov.length; j++) {
      let currGov = currOrgGov[j];
      if (currGov.stats.proposals.active > 0) {
        activeGovernors.push(currOrg);
        break;
      }
    }
	}

	// Sort by number of voters (similar to tally explore page)
  activeGovernors = activeGovernors.sort((a, b) => {
    return (
      b.governances[0].stats.tokens.voters -
      a.governances[0].stats.tokens.voters
    );
  });


	// Remove individual proposals with 0 active. Remaining data structure with only contain organizations and sub-proposals with active proposals
  for (let i = 0; i < activeGovernors.length; i++) {
    let curr = activeGovernors[i];
    let currNew = {
      ...curr,
      governances: [
        ...curr.governances.filter((x) => x.stats.proposals.active > 0),
      ],
    };
    activeGovernors[i] = currNew;
  }

	// Remove duplicate entries
  activeGovernors = activeGovernors.filter((obj, index, self) => {
    return (
      index ===
      self.findIndex((o) => o.name === obj.name && o.slug === obj.slug)
    );
  });

  return activeGovernors;
}

export { getActiveProposalOrganizations };