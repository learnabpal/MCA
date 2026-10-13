## Woen is
```agsl
One User
   ↓
One Workspace
   ↓
Many Flows
   ↓
Many Flow Versions
   ↓
Many Runs
   ↓
Steps
   ↓
Tasks / Approvals / Conditions
   ↓
Activity / Comments / Attachments
```
### The Core Relational Model
```agsl
User
  │
  └── 1 : 1
        Workspace
           │
           └── 1 : N
                 Flow
                   │
                   └── 1 : N
                         FlowVersion
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
          FlowField     FlowStep    FlowRule
                             │
                             │
                       FlowTransition
                             │
                             ▼
                            Run
                             │
             ┌───────────────┼────────────────┐
             │               │                │
             ▼               ▼                ▼
        FieldValue         Task            Approval
             │               │                │
             └───────────────┼────────────────┘
                             │
                         Activity
                             │
                          Comment
                             │
                        Attachment
```
```agsl
                    User
                     │
                     │ 1:N
                     ▼
                  Workspace
                     │
                     │ 1:N
                     ▼
                    Flow
                     │
                     │ 1:N
                     ▼
                FlowVersion
              ┌──────┼──────┐
              │      │      │
             1:N    1:N    1:N
              │      │      │
            Field   Step   Run
                     │      │
                     │      ├── 1:N FieldValue
                     │      ├── 1:N Task
                     │      ├── 1:N Approval
                     │      ├── 1:N Activity
                     │      ├── 1:N Comment
                     │      └── 1:N Attachment
                     │
                1:N Transition
                     │
                  1:N Rule
```
