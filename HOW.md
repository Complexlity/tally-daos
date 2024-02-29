- Query https://www.tally.xyz/api/search-daos
(returns {governances: [...]} )

- Clean with active.js

- Query Proposals with each chain id using the gql query below
```
query GovernanceProposals( $chainId: ChainID!,  $governanceIds: [AccountID!]) {
  proposals(
    chainId: $chainId
    governanceIds: $governanceIds
  ) {
    id
    description
    statusChanges {
      type
    }
    block {
      timestamp
    }
    voteStats {
      votes
      weight
      support
      percent
    }

    governance {
      id
      quorum
      name
      timelockId
      organization {
        metadata {
          icon
        }
      }
      tokens {
        decimals
      }
    }
    tallyProposal {
      id
      createdAt
      status
    }
  }
}
```

- Display on frame image for user

## Current State
- Some daos (optimism, reflex, etc) does not reflect the correct data due to syncing
- All other things work okay and next is to complete the images

`
query ExploreOrgs($input: OrganizationsInput!) {
  organizations(input: $input) {
    nodes {
      ... on Organization {
        id
        slug
        name
        chainIds
        proposalsCount
        activeProposalsCount
        tokenHoldersCount
        votersCount
        governorIds
        metadata {
          icon
        }
      }
    }
    pageInfo {
      firstCursor
      lastCursor
    }
  }
}
`