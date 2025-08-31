"use client";
import { useParams } from "next/navigation";
import { useReadContract, useWriteContract } from "wagmi";
import vaultAbi from "@/lib/DeadmanSwitchVault.abi.json";

export default function VaultPage() {
  const { address } = useParams<{address: `0x${string}` }>();
  const { data: nextDeadline } = useReadContract({
    address, abi: vaultAbi, functionName: "nextDeadline",
  });
  const { data: executed } = useReadContract({
    address, abi: vaultAbi, functionName: "executed",
  });
  const { writeContractAsync } = useWriteContract();

  async function checkIn() {
    await writeContractAsync({ address, abi: vaultAbi, functionName: "checkIn", args: [] });
  }

  return (
    <main className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold break-all">{address}</h1>
      <div className="p-4 border rounded">
        <p>Next deadline: {nextDeadline ? new Date(Number(nextDeadline) * 1000).toLocaleString() : "…"}</p>
        <p>Status: {executed ? "Executed (payout complete)" : "Active"}</p>
      </div>
      {!executed && (
        <button onClick={checkIn} className="px-4 py-2 rounded-xl bg-black text-white">
          Check In (reset timer)
        </button>
      )}
    </main>
  );
}