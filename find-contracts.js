/** @param {NS} ns */
export async function main(ns) {
    const canSolve = ["Array Jumping Game",
      "Total Ways to Sum",
      "Find Largest Prime Factor",
      "Subarray with Maximum Sum"]
  
    // Create a set; sets can iterate and contain no duplicates *** replace with external function=?
    let servers = new Set(["home"])
    // iterate through set
    servers.forEach(h => { ns.scan(h).forEach(n => servers.add(n)); });
    // return an array from the set
    servers = Array.from(servers) //****************************** Exclude pserv- */
  
    while (true) {
      for (const server of servers) {
        try {
          // list all contracts
          let contracts = ns.ls(server, ".cct")
          if (contracts.length > 0) {
            for (const contract of contracts) {
              let contractType = ns.codingcontract.getContractType(contract, server)
              if (canSolve.includes(contractType)) {
                ns.tprint(`Found ${contract} ${contractType} @${server}`)
              }
              let data = await ns.codingcontract.getData(contract, server)

                //solve prime number contracts
              if (contractType == "Find Largest Prime Factor") {
                let answer = await primeNumbers(ns, data)
                await ns.codingcontract.attempt(answer, contract, server)
                ns.tprint(`Solved ${contract} @${server} with ${answer}`)
              }

                //solve subbaray with maximum sum
              if (contractType == "Subarray with Maximum Sum") { 
                let answer = await subarrayMaximumSum(ns, data)
                await ns.codingcontract.attempt(answer, contract, server)       
                ns.tprint(`Solved ${contract} @${server} with ${answer}`)
              }

              //solve total ways to sum
              if (contractType == "Total Ways to Sum") {  
                let answer = await waysToSum(ns, data)
                await ns.codingcontract.attempt(answer, contract, server)       
                ns.tprint(`Solved ${contract} @${server} with ${answer}`)
              }

            }
          }
        } catch(error) {
          await ns.tprint(error)
        }
      }
      await ns.sleep(60000)
    }

    // ------ Largest prime factor ---- //
async function primeNumbers(ns, data) {
  //Returns all the prime factors of a positive integer
  let n = data
  let factors = []
  let d = 2
  while (n > 1) {
    while (n % d == 0) {
      factors.push(d)
      n /= d
      await ns.sleep(0)
    }
    d += 1
      if (d*d > n && n > 1) {
        factors.push(n)
        break
      }
      await ns.sleep(0)
  }
  var largestPrimeFactor = Math.max(...factors) // The largest element in the prime factor list
  return largestPrimeFactor
  }

      // ------ Subbaray with maximum sum ---- //
async function subarrayMaximumSum(ns, data) {
  let bestSum = 0
  let length = data.length
for (let i = 0; i < length; i++) {
  let currentSum = 0
  ns.tprint(`slicing ! ${data}`)
  for (let j = 0; j < data.length; j++) {
    let n = data[j]
    currentSum += n
    if (currentSum > bestSum) {
      bestSum = currentSum
    }
    ns.tprint(`${n} ${bestSum} ${currentSum}`)
  }
  data.shift()   // remove first element of array, then repeat process
}
ns.tprint("answer ?")
  return bestSum
  }

      // ------ Total Ways to Sum---- //
      async function waysToSum(ns, data) {
        let number = data
  let waysToSum = new Array(number + 1).fill(0)
  waysToSum[0] = 1 //special case for zero
  for (let i = 1; i <= number; i++) { //< or <= ??
    for (let j = i; j < number; j++) { // < or <= ??
      waysToSum[j] += waysToSum[j - i]
    }
  }
  return waysToFormNumber[number] - 1;
  }

}
