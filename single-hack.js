/** @param {NS} ns */
export async function main(ns) {
    let target = ns.args[0]
    let delay = ns.args[1]
    await ns.hack(target, { additionalMsec: delay })
    const end = Date.now();
    ns.print(`Batch hack finished at ${end}`)
  }