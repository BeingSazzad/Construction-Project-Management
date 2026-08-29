# MULTI-AGENT UI/UX ORCHESTRATION ARCHITECTURE

All UI/UX development in this codebase must follow this multi-agent pipeline:

```
                    MASTER / ORCHESTRATOR
                            │
          ┌─────────────────┼─────────────────┐
          ↓                 ↓                 ↓
      UX AGENT          UI AGENT         FRONTEND AGENT
          │                 │                 │
     Flow + IA         Visual Design      React/Code
          │                 │                 │
          └─────────────────┼─────────────────┘
                            ↓
                       QA AGENT
                            │
                            ↓
                     FINAL REVIEW
```

## Execution Checklist:
1. **UX Phase**: Map user goal -> information architecture -> clutter-free flow.
2. **UI Phase**: Apply 430px shell (390px inner width), height tokens (48/40/32px), radii (24/16/12/8px), curated HSL dark mode.
3. **Frontend Phase**: Implement clean React/TypeScript code with zero errors.
4. **QA Phase**: Verify zero blank screens, zero overflow, and verify with `npx tsc --noEmit`.
