/** @param {NS} ns */
export async function main(ns) {
    // members
    let members = ns.gang.getMemberNames()
    var job = ns.args[0]
    var ascend = ns.args[1]
  
    for (const member of members) {
      if (job == "train") {
        ns.gang.setMemberTask(member, "Train Hacking");
      } else if (job == "money") {
        ns.gang.setMemberTask(member, "Money Laundering");
      } else {
        ns.gang.setMemberTask(member, "Cyberterrorism");
      }
      if (ascend == "ascend") {
        ns.gang.ascendMember(member)
      } else {
        continue
      }
    }
  }
  
  