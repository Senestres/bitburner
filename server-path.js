/** @param {NS} ns */
export async function main(ns) {
    if (ns.args[0] == null) {
        ns.tprint("Use an argument. Suggested servers: CSEC; run4thehillz; avmnite-02h; I.I.I.I; run4theh111z; w0r1d_d43m0n")
    } else {
        var serverToFind = ns.args[0]
    }
// scan servers from target to home
let nodeList = [serverToFind];
while (nodeList[0] !== "home") {
	let scanNode = ns.scan(nodeList[0]); 	// Get the scan from current server
	nodeList.unshift(scanNode[0]); 	// push the first item to the front of the node list, as that is the parent.
}

var connectPath = nodeList.join("; connect ") // join the array into a string
navigator.clipboard.writeText(connectPath) // put the string in clipboard, can paste in terminal
}