"use client";

import { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function getVisitorId() {
  if (typeof window === "undefined") return null;

  let visitorId = localStorage.getItem("visitorId");
  if (!visitorId) {
    visitorId = "v_" + Math.random().toString(36).substring(2, 15);
    localStorage.setItem("visitorId", visitorId);
  }
  return visitorId;
}

export function LikeButtons({ catatanId, initialLikes, initialDislikes }) {
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [userVote, setUserVote] = useState(null); // 'like', 'dislike', or null
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user already voted
    const votes = JSON.parse(localStorage.getItem("votes") || "{}");
    if (votes[catatanId]) {
      setUserVote(votes[catatanId]);
    }
  }, [catatanId]);

  const handleVote = async (type) => {
    if (loading) return;

    const visitorId = getVisitorId();
    if (!visitorId) return;

    setLoading(true);

    try {
      const res = await fetch("/api/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          catatanId,
          type,
          visitorId,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setLikes(data.likes);
        setDislikes(data.dislikes);
        setUserVote(data.userVote);

        // Save to localStorage
        const votes = JSON.parse(localStorage.getItem("votes") || "{}");
        if (data.userVote) {
          votes[catatanId] = data.userVote;
        } else {
          delete votes[catatanId];
        }
        localStorage.setItem("votes", JSON.stringify(votes));
      }
    } catch (error) {
      console.error("Vote error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm text-gray-500 font-medium">
        Apakah catatan ini membantu?
      </p>

      <div className="flex items-center gap-3">
        <Button
          variant={userVote === "like" ? "primary" : "secondary"}
          onClick={() => handleVote("like")}
          disabled={loading}
          className={cn(
            "flex items-center gap-2",
            userVote === "like" && "ring-2 ring-primary-300"
          )}
        >
          <ThumbsUp
            className={cn("w-5 h-5", userVote === "like" && "fill-current")}
          />
          <span className="font-semibold">{likes}</span>
        </Button>

        <Button
          variant={userVote === "dislike" ? "danger" : "secondary"}
          onClick={() => handleVote("dislike")}
          disabled={loading}
          className={cn(
            "flex items-center gap-2",
            userVote === "dislike" && "ring-2 ring-red-300"
          )}
        >
          <ThumbsDown
            className={cn("w-5 h-5", userVote === "dislike" && "fill-current")}
          />
          <span className="font-semibold">{dislikes}</span>
        </Button>
      </div>
    </div>
  );
}
