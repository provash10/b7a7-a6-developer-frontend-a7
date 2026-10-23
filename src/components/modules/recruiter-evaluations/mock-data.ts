// mock evaluation tasks for recruiter candidate review dashboard
// console.log("recruiter evaluation mock data loaded");

import type { EvaluationTask } from "./types";

export const initialEvaluationTasks: EvaluationTask[] = [
  {
    id: "eval_101",
    candidateName: "Tariqul Islam",
    candidateEmail: "tariqul.dev@gmail.com",
    roleApplied: "Senior Backend Engineer (Go / Distributed)",
    challengeTitle: "High-Throughput Raft Consensus Engine",
    challengeLanguage: "Go",
    submittedAt: "2026-10-23 21:40",
    score: 94,
    testCasesPassed: 15,
    totalTestCases: 16,
    executionTimeMs: 142,
    antiCheatStatus: "CLEAN",
    antiCheatSignals: [
      "consistent typing velocity",
      "dual camera proctored verified",
    ],
    status: "PENDING_REVIEW",
    codeSnippet: `package consensus

import (
	"context"
	"sync"
	"time"
)

type Node struct {
	mu        sync.RWMutex
	peers     []string
	term      int
	isLeader  bool
	log       []LogEntry
	heartbeat time.Duration
}

func (n *Node) BroadcastHeartbeat(ctx context.Context) error {
	n.mu.RLock()
	defer n.mu.RUnlock()
	for _, peer := range n.peers {
		go n.sendAppendEntries(ctx, peer)
	}
	return nil
}`,
    recruiterNotes: "exceptional concurrency handling and lock granularity.",
    codeQualityRating: 5,
    architectureRating: 5,
  },
  {
    id: "eval_102",
    candidateName: "Nusrat Jahan",
    candidateEmail: "nusrat.ui@yahoo.com",
    roleApplied: "Lead React & Next.js Architect",
    challengeTitle: "Optimistic Multi-Tab State Synchronization",
    challengeLanguage: "TypeScript",
    submittedAt: "2026-10-23 20:15",
    score: 88,
    testCasesPassed: 11,
    totalTestCases: 12,
    executionTimeMs: 86,
    antiCheatStatus: "CLEAN",
    antiCheatSignals: ["zero tab switches", "paste buffer normal"],
    status: "IN_REVIEW",
    codeSnippet: `import { useEffect, useRef, useState } from 'react';

export function useBroadcastSync<T>(channelKey: string, initialValue: T) {
  const [state, setState] = useState<T>(initialValue);
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    const bc = new BroadcastChannel(channelKey);
    channelRef.current = bc;
    bc.onmessage = (event) => setState(event.data);
    return () => bc.close();
  }, [channelKey]);

  return [state, setState] as const;
}`,
    recruiterNotes: "solid custom hook with broadcastchannel cleanup logic.",
    codeQualityRating: 4,
    architectureRating: 4,
  },
  {
    id: "eval_103",
    candidateName: "Anik Chowdhury",
    candidateEmail: "anik.cloud@outlook.com",
    roleApplied: "Kubernetes Platform Engineer",
    challengeTitle: "Custom CRD Operator & Reconciliation Controller",
    challengeLanguage: "Go",
    submittedAt: "2026-10-23 18:30",
    score: 65,
    testCasesPassed: 8,
    totalTestCases: 14,
    executionTimeMs: 310,
    antiCheatStatus: "FLAGGED",
    antiCheatSignals: [
      "large 200-line clipboard paste within 3 seconds",
      "multiple window blur events detected",
    ],
    status: "PENDING_REVIEW",
    codeSnippet: `func (r *Reconciler) Reconcile(ctx context.Context, req ctrl.Request) (ctrl.Result, error) {
	var pod corev1.Pod
	if err := r.Get(ctx, req.NamespacedName, &pod); err != nil {
		return ctrl.Result{}, client.IgnoreNotFound(err)
	}
	// candidate implementation incomplete
	return ctrl.Result{RequeueAfter: time.Minute}, nil
}`,
    recruiterNotes: "plagiarism flag raised by automated proctoring daemon.",
    codeQualityRating: 2,
    architectureRating: 2,
  },
  {
    id: "eval_104",
    candidateName: "Farhana Akter",
    candidateEmail: "farhana.py@gmail.com",
    roleApplied: "Senior Machine Learning Engineer",
    challengeTitle: "Real-time Vector Embedding Indexer",
    challengeLanguage: "Python",
    submittedAt: "2026-10-23 16:50",
    score: 96,
    testCasesPassed: 18,
    totalTestCases: 18,
    executionTimeMs: 95,
    antiCheatStatus: "CLEAN",
    antiCheatSignals: ["smooth keystroke cadence", "proctoring verified"],
    status: "ACCEPTED",
    codeSnippet: `import numpy as np

class CosineVectorIndex:
    def __init__(self, dimension: int):
        self.dim = dimension
        self.vectors = np.empty((0, dimension), dtype=np.float32)
        self.ids = []

    def insert(self, doc_id: str, vec: np.ndarray):
        norm = np.linalg.norm(vec)
        normalized = vec / (norm + 1e-9)
        self.vectors = np.vstack([self.vectors, normalized])
        self.ids.append(doc_id)

    def search(self, query: np.ndarray, top_k: int = 5):
        q_norm = query / (np.linalg.norm(query) + 1e-9)
        scores = np.dot(self.vectors, q_norm)
        top_indices = np.argsort(scores)[::-1][:top_k]
        return [(self.ids[i], float(scores[i])) for i in top_indices]`,
    recruiterNotes:
      "perfect score, clean vectorized numpy matrix mathematics. approved for on-site technical round.",
    codeQualityRating: 5,
    architectureRating: 5,
  },
  {
    id: "eval_105",
    candidateName: "Mahmudul Hasan",
    candidateEmail: "hasan.sys@hotmail.com",
    roleApplied: "DevOps & SRE Engineer",
    challengeTitle: "Zero-Downtime Blue-Green Envoy Gateway",
    challengeLanguage: "YAML & Bash",
    submittedAt: "2026-10-23 14:10",
    score: 42,
    testCasesPassed: 5,
    totalTestCases: 12,
    executionTimeMs: 450,
    antiCheatStatus: "LOW_RISK",
    antiCheatSignals: ["1 window blur event during reading period"],
    status: "REJECTED",
    codeSnippet: `apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: envoy-blue-green
spec:
  rules:
  - host: api.devassess.io
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: legacy-service
            port:
              number: 80`,
    recruiterNotes:
      "did not implement traffic splitting weights or envoy filter annotations.",
    codeQualityRating: 2,
    architectureRating: 1,
  },
  {
    id: "eval_106",
    candidateName: "Zubair Rahman",
    candidateEmail: "zubair.algo@gmail.com",
    roleApplied: "Rust Systems Engineer",
    challengeTitle: "Lock-Free Ring Buffer for IPC",
    challengeLanguage: "Rust",
    submittedAt: "2026-10-23 11:20",
    score: 91,
    testCasesPassed: 14,
    totalTestCases: 15,
    executionTimeMs: 38,
    antiCheatStatus: "CLEAN",
    antiCheatSignals: ["proctoring verified clean"],
    status: "IN_REVIEW",
    codeSnippet: `use std::sync::atomic::{AtomicUsize, Ordering};

pub struct RingBuffer<T> {
    buffer: Vec<Option<T>>,
    head: AtomicUsize,
    tail: AtomicUsize,
    capacity: usize,
}

impl<T> RingBuffer<T> {
    pub fn new(capacity: usize) -> Self {
        let mut buffer = Vec::with_capacity(capacity);
        for _ in 0..capacity {
            buffer.push(None);
        }
        Self {
            buffer,
            head: AtomicUsize::new(0),
            tail: AtomicUsize::new(0),
            capacity,
        }
    }
}`,
    recruiterNotes:
      "impressive atomic ordering comprehension and memory fence usage.",
    codeQualityRating: 5,
    architectureRating: 4,
  },
];
