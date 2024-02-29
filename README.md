## Tally Active Daos

- Query https://www.tally.xyz/api/search-daos
(returns {governances: [...]} )

Found in [src/utils/getActiveProposalsOrganizations.ts](src/utils/getActiveProposalsOrganizations.ts)

**Update**:
The search-daos api route does not display all the active organizations. Using this endpoint instead:

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
Found in: [src/utils/getOrganizations.ts](src/utils/getOrganizations.ts)

- Clean data

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

Found in [src\utils\getActiveProposals.ts](src\utils\getActiveProposals.ts)


- Display on frame image for user

## Current State
- Some daos (optimism, reflex, etc) does not reflect the correct data due to syncing
-


