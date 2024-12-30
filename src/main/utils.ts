import { ChildProcessWithoutNullStreams, spawn } from "child_process"
/*
 * internetCard is the interface number
  */
export function tracker(internetCard: number): ChildProcessWithoutNullStreams {
  // incase internetCard is null/undefined
  if (!internetCard) internetCard = 1

  // defining the base command that would be spawned
  const command = spawn('tshark', [
    "-i", String(internetCard),
    "-T", "fields", // output specific fields
    "-e", "frame.time_epoch", // when the transaction happened in ms
    "-e", "frame.len", // length of the frame,
    "-e", "ip.src",
    "-e", "ip.dst"
  ])

  return command
}

// const command = tracker(5)
// command.stdout.on("data", data => {
//   const captured = data.toString().split("\n")
//   for (let idx = 0; idx < captured.length; idx++) {
//     const [time, len, src, dst] = captured[idx].split("\t")
//     // only if all the above exist
//     if (time && len && src && dst) {
//       const output = { time: time, len: len, src: src, dst: dst }
//       console.log(output)
//     }
//   } })
