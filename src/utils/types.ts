export interface Pokedex {
  governances: PokedexGovernance[];
}

export interface PokedexGovernance {
  id: string;
  slug: string;
  name: string;
  kind: Kind;
  chainId: ChainID;
  organization: Organization | null;
}

export enum ChainID {
  Eip1551 = "eip155:1",
  Eip15510 = "eip155:10",
  Eip155100 = "eip155:100",
  Eip1551101 = "eip155:1101",
  Eip1551284 = "eip155:1284",
  Eip155137 = "eip155:137",
  Eip155168587773 = "eip155:168587773",
  Eip155255 = "eip155:255",
  Eip155324 = "eip155:324",
  Eip15542161 = "eip155:42161",
  Eip15542170 = "eip155:42170",
  Eip15542220 = "eip155:42220",
  Eip15543114 = "eip155:43114",
  Eip15556 = "eip155:56",
  Eip1558453 = "eip155:8453",
}

export enum Kind {
  MultiGovPrimary = "MULTI_GOV_PRIMARY",
  MultiGovSecondary = "MULTI_GOV_SECONDARY",
  SingleGov = "SINGLE_GOV",
}

export interface Organization {
  name: string;
  slug: string;
  metadata: Metadata;
  governances: OrganizationGovernance[];
}

export interface OrganizationGovernance {
  id: string;
  stats: Stats;
}

export interface Stats {
  proposals: Proposals;
  tokens: Tokens;
}

export interface Proposals {
  active: number;
  total: number;
}

export interface Tokens {
  owners: number;
  voters: number;
}

export interface Metadata {
  icon: null | string;
}

export type PickedOrgs = Pick<Organization, "name" | "governances" | "slug">[]


export interface Welcome {
  proposals: Proposal[];
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  statusChanges: StatusChange[];
  voteStats: VoteStat[];
  governance: {name: string, slug: string}
}

export interface StatusChange {
  type: Type;
}

export enum Type {
  Active = "ACTIVE",
  Defeated = "DEFEATED",
  Empty = "",
  Executed = "EXECUTED",
  Pending = "PENDING",
  Queued = "QUEUED",
  Succeeded = "SUCCEEDED",
}

export interface VoteStat {
  votes: string | number;
  weight: string | number;
  support: Support;
  percent: number;
}

export enum Support {
  Abstain = "ABSTAIN",
  Against = "AGAINST",
  For = "FOR",
}
