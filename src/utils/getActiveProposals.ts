import { Proposal, StatusChange, Type } from "./types";
import { fetcher } from "./fetcher";

export async function getActiveProposals(
  chainId: string,
	governanceIds : string[]
) {
  const governorProposalsDocument = `
		query GovernanceProposals( $chainId: ChainID!,  $governanceIds: [AccountID!]) {
  proposals(
    chainId: $chainId
    governanceIds: $governanceIds
  ) {
    id
		title
		# description
    statusChanges {
      type
    }
    voteStats {
      votes
      weight
      support
      percent
    }
  }
}`;



  const result = await fetcher({
		query: governorProposalsDocument,
    variables: {
			chainId,
			governanceIds
    },
	});

	const activeProposals = cleanActiveProposals(result.proposals)
	return activeProposals
}

function cleanActiveProposals(proposals: Proposal[]) {
	let newProposals: (Omit<Proposal, "statusChanges">)[] = []

	for (let i = 0; i < proposals.length; i++){
		let curr = proposals[i]
		if (isActive(curr.statusChanges)) {
			curr.voteStats.forEach((item, index)=> {
				const newItem = {
					votes: Number(item.votes),
					weight: Number(item.weight),
					support: item.support,
					percent: item.percent
				}
				curr.voteStats[index] = newItem
			})
      newProposals.push(curr)
		}

	}

	return newProposals
}

function isActive(statusChanges: StatusChange[]) {
	const wrongTypes = [Type.Defeated, Type.Empty, Type.Executed, Type.Queued, Type.Succeeded, Type.Canceled]
	for (let i = 0; i < statusChanges.length; i++){
		const curr = statusChanges[i]
		if (wrongTypes.includes(curr.type)) {
			return false
		}
	}
	return true
}


