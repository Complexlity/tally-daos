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
