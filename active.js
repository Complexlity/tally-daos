
// Parse JSON data
const data = JSON.parse(jsonData);

// Extract nodes
const nodes = data.data.organizations.nodes;

// Filter nodes with active proposals count greater than zero
const filteredNodes = nodes.filter((node) => node.activeProposalsCount > 0);

// Sort filtered nodes by voters count
filteredNodes.sort((b, a) => a.votersCount - b.votersCount);

// Display the sorted nodes
console.log(filteredNodes);
