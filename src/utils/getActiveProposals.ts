import { Proposal, StatusChange, Type } from "./types";
import { fetcher } from "./fetcher";

export async function getActiveProposals(
  chainId: string = "eip155:42161",
	governanceIds = ["eip155:42161:0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9"],
	lean = false
) {
  const governorProposalsDocument = `
		query GovernanceProposals( $chainId: ChainID!,  $governanceIds: [AccountID!]) {
  proposals(
    chainId: $chainId
    governanceIds: $governanceIds
  ) {
    id
		title
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

	const governorProposalsDocumentLean = `
		query GovernanceProposals( $chainId: ChainID!,  $governanceIds: [AccountID!]) {
  proposals(
    chainId: $chainId
    governanceIds: $governanceIds
  ) {
    id
		title
  }
}`;

  const result = await fetcher({
		query: lean ? governorProposalsDocumentLean: governorProposalsDocument,
    variables: {
			chainId,
			governanceIds
    },
	});

	if(lean) return result.proposals
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
	const wrongTypes = [Type.Defeated, Type.Empty, Type.Executed, Type.Queued, Type.Succeeded]
	for (let i = 0; i < statusChanges.length; i++){
		const curr = statusChanges[i]
		if (wrongTypes.includes(curr.type)) {
			return false
		}
	}
	return true
}


